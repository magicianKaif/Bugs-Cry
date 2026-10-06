import type { FinalReport } from '@/types';

/** Synthetic sample data used only to preview the report flow when Gemini is unavailable. */
export function makeDemoReport(): FinalReport {
  return {
    reportTitle: 'Synthetic Preview — Sample Security Finding',
    executiveSummary:
      'This is fictional sample data showing how a completed BugsCry report is presented. Gemini rejected the configured API keys, so no uploaded evidence was analyzed and no security conclusion is being made about the submitted system.',
    scope: 'Preview only. Uploaded evidence was not analyzed because Gemini credentials were rejected.',
    methodology: 'Synthetic example generated locally to demonstrate the report, human-review, and download flow. It is not an AI assessment.',
    overallRiskRating: 'Informational',
    statistics: { total: 1, truePositives: 0, falsePositives: 0, informational: 1 },
    findings: [
      {
        title: 'Sample record — verify server-side authorization for object access',
        verdict: 'uncertain',
        severity: 'Informational',
        confidence: 0,
        cwe: 'CWE-862',
        owasp: 'A01:2021 Broken Access Control',
        cvssVector: 'Not assessed',
        evidence: 'Synthetic sample only. No evidence from this submission was analyzed.',
        businessImpact: 'If an application does not check permissions for each requested object, one user might access another user’s data. This sample does not establish that the submitted application has this issue.',
        executiveNote: 'Example content only. A security reviewer must assess actual evidence before drawing conclusions.',
        remediation: [
          'Check authorization on the server for every object requested by the current user.',
          'Add tests that verify one user cannot read or modify another user’s records.',
        ],
        references: ['https://cwe.mitre.org/data/definitions/862.html', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'],
      },
    ],
    recommendations: ['Configure valid Gemini API keys, rerun the analysis, and have a reviewer verify all findings before relying on the report.'],
    reviewFlags: [
      'Synthetic preview only: Gemini API keys were rejected; this report is not based on the submitted evidence.',
      'Human review required before this sample report can be downloaded.',
    ],
  };
}
