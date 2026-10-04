import type { EvidenceItem } from '@/types';
import type { GeminiPart } from './gemini';

/** Executables/installers are never accepted. Everything else is fair game. */
export const BLOCKED_EXTENSIONS = ['exe', 'dpkg', 'apk'];
const IMAGE_MIMES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
};
const MAX_TEXT_BYTES = 400 * 1024; // keep prompts within sane token limits
const MAX_FILE_BYTES = 8 * 1024 * 1024;

export function extOf(name: string): string {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : '';
}

export function isBlocked(name: string): boolean {
  return BLOCKED_EXTENSIONS.includes(extOf(name));
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error(`Could not read ${file.name}`));
    r.readAsDataURL(file);
  });
}

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error(`Could not read ${file.name}`));
    r.readAsText(file);
  });
}

export async function fileToEvidence(file: File): Promise<EvidenceItem> {
  if (isBlocked(file.name)) {
    throw new Error(`${file.name}: executables and installer packages (.exe / .dpkg / .apk) are not accepted.`);
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`${file.name}: file exceeds the 8 MB limit.`);
  }
  const ext = extOf(file.name);
  if (IMAGE_MIMES[ext] || file.type.startsWith('image/')) {
    const dataUrl = await readAsDataURL(file);
    return {
      name: file.name,
      mimeType: IMAGE_MIMES[ext] ?? file.type,
      kind: 'image',
      data: dataUrl.split(',')[1] ?? '',
    };
  }
  if (ext === 'pdf' || file.type === 'application/pdf') {
    const dataUrl = await readAsDataURL(file);
    return { name: file.name, mimeType: 'application/pdf', kind: 'pdf', data: dataUrl.split(',')[1] ?? '' };
  }
  // Everything else (json, xml, txt, log, csv, html, yaml, har, md, burp/zap
  // exports, source files …) is treated as text evidence.
  let text = await readAsText(file);
  if (new Blob([text]).size > MAX_TEXT_BYTES) {
    text = `${text.slice(0, MAX_TEXT_BYTES)}\n… [truncated at 400 KB]`;
  }
  return {
    name: file.name,
    mimeType: file.type || 'text/plain',
    kind: 'text',
    data: text,
  };
}

export function evidenceToParts(items: EvidenceItem[], pastedText: string): GeminiPart[] {
  const parts: GeminiPart[] = [];
  for (const item of items) {
    if (item.kind === 'text') {
      parts.push({ text: `\n===== EVIDENCE FILE: ${item.name} (${item.mimeType}) =====\n${item.data}\n===== END ${item.name} =====` });
    } else {
      parts.push({ text: `\n===== EVIDENCE IMAGE/DOCUMENT: ${item.name} =====` });
      parts.push({ inlineData: { mimeType: item.mimeType, data: item.data } });
    }
  }
  if (pastedText.trim()) {
    parts.push({ text: `\n===== PASTED RAW FINDING =====\n${pastedText.trim().slice(0, MAX_TEXT_BYTES)}\n===== END PASTED FINDING =====` });
  }
  return parts;
}
