export interface EvidenceItem {
  name: string;
  mimeType: string;
  kind: 'image' | 'pdf' | 'text';
  /** base64 payload for image/pdf, utf-8 text for text */
  data: string;
}

export type Verdict =
  | 'true_positive'
  | 'false_positive'
  | 'informational'
  | 'uncertain'
  | 'insufficient_evidence';

export interface AnalystFinding {
  id: string;
  title: string;
  verdict: Verdict;
  confidence: number; // 0-100
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  cwe: string;
  cweName: string;
  owasp: string;
  cvssVector: string;
  cvssScore: number | null;
  evidenceCitations: string[];
  falsePositiveReasoning: string;
  technicalSummary: string;
}

export interface AnalystResult {
  findings: AnalystFinding[];
}

export interface Translation {
  id: string;
  executiveSummary: string;
  businessImpact: string;
  regulatoryImplications: string;
  remediationPriority: 'Immediate' | 'High' | 'Medium' | 'Low';
  remediationSteps: string[];
  codeExample: string;
}

export interface TranslatorResult {
  translations: Translation[];
}

export interface ReportFinding {
  title: string;
  verdict: Verdict;
  severity: string;
  confidence: number;
  cwe: string;
  owasp: string;
  cvssVector: string;
  evidence: string;
  businessImpact: string;
  executiveNote: string;
  remediation: string[];
  references: string[];
}

export interface FinalReport {
  reportTitle: string;
  executiveSummary: string;
  scope: string;
  methodology: string;
  overallRiskRating: string;
  statistics: {
    total: number;
    truePositives: number;
    falsePositives: number;
    informational: number;
  };
  findings: ReportFinding[];
  recommendations: string[];
  reviewFlags: string[];
}

export type StageStatus = 'idle' | 'running' | 'done' | 'error';

export interface StageInfo {
  status: StageStatus;
  keyIndex?: number;
  model?: string;
  durationMs?: number;
  note?: string;
}
