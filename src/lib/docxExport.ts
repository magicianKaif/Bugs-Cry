import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { saveAs } from 'file-saver';
import type { FinalReport, ReportFinding } from '@/types';

const ACCENT = 'F97316';
const TEAL = '14B8A6';
const DARK = '0F1B2D';

const SEV_COLORS: Record<string, string> = {
  Critical: 'EF4444',
  High: 'F59E0B',
  Medium: 'EAB308',
  Low: '22C55E',
  Informational: '3B82F6',
};

function h1(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, color: DARK, bold: true, size: 36 })],
  });
}

function h2(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, color: DARK, bold: true, size: 28 })],
  });
}

function body(text: string): Paragraph {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, size: 22 })] });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function labelValue(label: string, value: string, valueColor?: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22, color: DARK }),
      new TextRun({ text: value, size: 22, color: valueColor ?? '222222' }),
    ],
  });
}

function findingBlock(f: ReportFinding, index: number): (Paragraph | Table)[] {
  const sevColor = SEV_COLORS[f.severity] ?? DARK;
  const verdictLabel = f.verdict.replace(/_/g, ' ').toUpperCase();
  const rows: (Paragraph | Table)[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 320, after: 100 },
      children: [
        new TextRun({ text: `${index + 1}. ${f.title}`, bold: true, size: 26, color: DARK }),
      ],
    }),
    labelValue('Severity', f.severity, sevColor),
    labelValue('Verdict', verdictLabel, f.verdict === 'false_positive' ? '3B82F6' : undefined),
    labelValue('Confidence', `${f.confidence}/100`),
    labelValue('CWE', f.cwe),
    labelValue('OWASP', f.owasp),
    labelValue('CVSS', f.cvssVector),
    h2('Evidence'),
    body(f.evidence),
    h2('Business impact'),
    body(f.businessImpact),
    h2('Executive note'),
    body(f.executiveNote),
    h2('Remediation'),
    ...f.remediation.map((s) => bullet(s)),
  ];
  if (f.references.length) {
    rows.push(h2('References'), ...f.references.map((r) => bullet(r)));
  }
  return rows;
}

export async function exportReportDocx(report: FinalReport): Promise<void> {
  const statsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    },
    rows: [
      new TableRow({
        children: ['Total findings', 'True positives', 'False positives', 'Informational'].map(
          (t) =>
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: t, bold: true, size: 20, color: DARK })],
                }),
              ],
            }),
        ),
      }),
      new TableRow({
        children: [
          report.statistics.total,
          report.statistics.truePositives,
          report.statistics.falsePositives,
          report.statistics.informational,
        ].map(
          (n) =>
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: String(n), size: 22 })],
                }),
              ],
            }),
        ),
      }),
    ],
  });

  const doc = new Document({
    creator: 'BugsCry — Evidence-Grounded Multi-Agent Pipeline',
    title: report.reportTitle,
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({ text: report.reportTitle, bold: true, size: 44, color: DARK }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `Generated ${new Date().toLocaleString()} · BugsCry evidence-grounded pipeline`,
                size: 20,
                color: '666666',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: `Overall risk rating: ${report.overallRiskRating}`,
                bold: true,
                size: 26,
                color: SEV_COLORS[report.overallRiskRating] ?? ACCENT,
              }),
            ],
          }),
          h1('1. Executive summary'),
          body(report.executiveSummary),
          h1('2. Statistics'),
          statsTable,
          h1('3. Scope'),
          body(report.scope),
          h1('4. Methodology'),
          body(report.methodology),
          h1('5. Findings'),
          ...report.findings.flatMap((f, i) => findingBlock(f, i)),
          h1('6. Recommendations'),
          ...report.recommendations.map((r) => bullet(r)),
          ...(report.reviewFlags.length
            ? [
                h1('7. Items flagged for human review'),
                ...report.reviewFlags.map((r) =>
                  new Paragraph({
                    bullet: { level: 0 },
                    spacing: { after: 80 },
                    children: [new TextRun({ text: r, size: 22, color: TEAL })],
                  }),
                ),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safe = report.reportTitle.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').slice(0, 60);
  saveAs(blob, `${safe || 'security-report'}.docx`);
}
