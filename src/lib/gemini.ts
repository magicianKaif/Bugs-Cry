/**
 * Gemini client with three-key rotation.
 *
 * Key roles (per product spec):
 *   key 0 → Stage 1 Analyst    (OWASP/CWE classification + false-positive reduction)
 *   key 1 → Stage 2 Translator (business-language fixes)
 *   key 2 → Stage 3 Synthesizer (final end-user report)
 *
 * If a stage's preferred key fails (network error, 4xx/5xx, quota), the call
 * automatically falls over to the remaining keys, so the pipeline keeps moving.
 */

export const GEMINI_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY_ANALYST,
  import.meta.env.VITE_GEMINI_API_KEY_TRANSLATOR,
  import.meta.env.VITE_GEMINI_API_KEY_SYNTHESIZER,
];

export const KEY_LABELS = ['Analyst key', 'Translator key', 'Synthesizer key'];

const MODEL_CANDIDATES = ['gemini-2.5-flash', 'gemini-2.5-flash', 'gemini-2.5-flash'];
const TIMEOUT_MS = 120_000;

export type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export interface GeminiCallMeta {
  keyIndex: number;
  model: string;
  durationMs: number;
  attempts: string[];
}

interface CallOptions {
  temperature?: number;
  maxOutputTokens?: number;
  onAttempt?: (keyIndex: number, model: string) => void;
  signal?: AbortSignal;
}

async function postToGemini(
  key: string,
  model: string,
  parts: GeminiPart[],
  opts: CallOptions,
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const linkAbort = () => controller.abort();
  opts.signal?.addEventListener('abort', linkAbort);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: opts.temperature ?? 0.2,
          maxOutputTokens: opts.maxOutputTokens ?? 8192,
          responseMimeType: 'application/json',
        },
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText} — ${body.slice(0, 220)}`);
    }
    const data = await res.json();
    const text = (data?.candidates?.[0]?.content?.parts ?? [])
      .map((p: { text?: string }) => p.text ?? '')
      .join('');
    if (!text) throw new Error('Empty response from model');
    return text;
  } finally {
    clearTimeout(timer);
    opts.signal?.removeEventListener('abort', linkAbort);
  }
}

/** Extract the first JSON object/array from a model response, tolerating code fences. */
export function parseJsonLoose<T>(raw: string): T {
  let s = raw.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) s = fence[1].trim();
  try {
    return JSON.parse(s) as T;
  } catch {
    const start = s.search(/[{[]/);
    const end = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'));
    if (start >= 0 && end > start) {
      return JSON.parse(s.slice(start, end + 1)) as T;
    }
    throw new Error('Model returned non-JSON output');
  }
}

/**
 * Call Gemini for a pipeline stage. Tries the stage's own key first, then the
 * other keys in rotation; for each key it walks the model candidates.
 */
export async function callGeminiJson<T>(
  stageIndex: 0 | 1 | 2,
  parts: GeminiPart[],
  opts: CallOptions = {},
): Promise<{ json: T; meta: GeminiCallMeta }> {
  const keyOrder = [0, 1, 2].map((i) => (stageIndex + i) % GEMINI_KEYS.length);
  const attempts: string[] = [];
  let lastError: unknown = null;

  for (const keyIndex of keyOrder) {
    for (const model of MODEL_CANDIDATES) {
      if (opts.signal?.aborted) throw new Error('Cancelled');
      opts.onAttempt?.(keyIndex, model);
      const started = performance.now();
      try {
        const raw = await postToGemini(GEMINI_KEYS[keyIndex], model, parts, opts);
        const json = parseJsonLoose<T>(raw);
        return {
          json,
          meta: { keyIndex, model, durationMs: Math.round(performance.now() - started), attempts },
        };
      } catch (err) {
        lastError = err;
        attempts.push(
          `key ${keyIndex + 1} / ${model}: ${err instanceof Error ? err.message : String(err)}`,
        );
        // A model-level 404 is not worth retrying with the other models on the
        // same key forever — but key errors (403 quota etc.) justify key rotation,
        // which the outer loop already does.
      }
    }
  }
  throw new Error(
    `All Gemini keys/models failed for this stage.\n${attempts.join('\n')}${
      lastError ? `\nLast error: ${String(lastError)}` : ''
    }`,
  );
}
