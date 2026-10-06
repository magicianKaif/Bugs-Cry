import { useCallback, useRef, useState } from 'react';
import { callGeminiJson, type GeminiPart } from '@/lib/gemini';
import { evidenceToParts } from '@/lib/files';
import { buildAnalystPrompt, buildReportPrompt, buildTranslatorPrompt } from '@/lib/prompts';
import type {
  AnalystResult,
  EvidenceItem,
  FinalReport,
  StageInfo,
  TranslatorResult,
} from '@/types';

const IDLE_STAGES: StageInfo[] = [
  { status: 'idle' },
  { status: 'idle' },
  { status: 'idle' },
];

export interface PipelineState {
  stages: StageInfo[];
  log: string[];
  running: boolean;
  error: string | null;
  analyst: AnalystResult | null;
  translator: TranslatorResult | null;
  report: FinalReport | null;
}

export function usePipeline() {
  const [state, setState] = useState<PipelineState>({
    stages: IDLE_STAGES,
    log: [],
    running: false,
    error: null,
    analyst: null,
    translator: null,
    report: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const appendLog = useCallback((line: string) => {
    const stamp = new Date().toLocaleTimeString();
    setState((s) => ({ ...s, log: [...s.log, `[${stamp}] ${line}`] }));
  }, []);

  const setStage = useCallback((idx: number, info: Partial<StageInfo>) => {
    setState((s) => {
      const stages = s.stages.map((st, i) => (i === idx ? { ...st, ...info } : st));
      return { ...s, stages };
    });
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({
      stages: IDLE_STAGES,
      log: [],
      running: false,
      error: null,
      analyst: null,
      translator: null,
      report: null,
    });
  }, []);

  const run = useCallback(
    async (evidence: EvidenceItem[], pastedText: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({
        stages: IDLE_STAGES,
        log: [],
        running: true,
        error: null,
        analyst: null,
        translator: null,
        report: null,
      });

      const evidenceParts: GeminiPart[] = evidenceToParts(evidence, pastedText);
      appendLog(
        `Pipeline started — ${evidence.length} file(s), ${pastedText.trim() ? '1 pasted finding' : 'no pasted text'}.`,
      );

      const onAttempt = (stageIdx: number) => (keyIndex: number, model: string) => {
        setStage(stageIdx, { status: 'running', keyIndex, model });
        appendLog(`Stage ${stageIdx + 1}: trying key ${keyIndex + 1} (${model})…`);
      };

      try {
        // ── Stage 1 · Analyst (key 1) ────────────────────────────────
        appendLog('Stage 1 · Analyst — classifying under CWE/OWASP, adjudicating false positives…');
        const t1 = performance.now();
        const { json: analyst, meta: m1 } = await callGeminiJson<AnalystResult>(
          0,
          [{ text: buildAnalystPrompt() }, ...evidenceParts],
          { onAttempt: onAttempt(0), signal: controller.signal },
        );
        setStage(0, {
          status: 'done',
          keyIndex: m1.keyIndex,
          model: m1.model,
          durationMs: Math.round(performance.now() - t1),
        });
        const n = analyst.findings?.length ?? 0;
        appendLog(
          `Stage 1 done via key ${m1.keyIndex + 1} — ${n} finding(s), ${analyst.findings?.filter((f) => f.verdict === 'false_positive').length ?? 0} flagged false-positive.`,
        );
        if (!n) {
          appendLog('No security-relevant findings in the evidence. Pipeline stopped.');
          setState((s) => ({ ...s, running: false, analyst }));
          return;
        }

        // ── Stage 2 · Translator (key 2) ─────────────────────────────
        appendLog('Stage 2 · Translator — rewriting fixes in business language…');
        const t2 = performance.now();
        const { json: translator, meta: m2 } = await callGeminiJson<TranslatorResult>(
          1,
          [{ text: buildTranslatorPrompt(analyst) }],
          { onAttempt: onAttempt(1), signal: controller.signal },
        );
        setStage(1, {
          status: 'done',
          keyIndex: m2.keyIndex,
          model: m2.model,
          durationMs: Math.round(performance.now() - t2),
        });
        appendLog(`Stage 2 done via key ${m2.keyIndex + 1} — dual-audience content generated.`);

        // ── Stage 3 · Synthesizer (key 3) ────────────────────────────
        appendLog('Stage 3 · Synthesizer — assembling the end-user report…');
        const t3 = performance.now();
        const { json: report, meta: m3 } = await callGeminiJson<FinalReport>(
          2,
          [{ text: buildReportPrompt(analyst, translator) }],
          { onAttempt: onAttempt(2), signal: controller.signal, maxOutputTokens: 16384 },
        );
        setStage(2, {
          status: 'done',
          keyIndex: m3.keyIndex,
          model: m3.model,
          durationMs: Math.round(performance.now() - t3),
        });
        appendLog(
          `Stage 3 done via key ${m3.keyIndex + 1} — report ready (${report.findings?.length ?? 0} findings, overall risk: ${report.overallRiskRating}).`,
        );

        setState((s) => ({ ...s, running: false, analyst, translator, report }));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        appendLog(`Pipeline failed: ${msg}`);
        setState((s) => ({
          ...s,
          running: false,
          error: msg,
          stages: s.stages.map((st) => (st.status === 'running' ? { ...st, status: 'error' } : st)),
        }));
      }
    },
    [appendLog, setStage],
  );

  return { ...state, run, reset };
}
