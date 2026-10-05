# BugsCry

### Evidence-Grounded Multi-Agent LLM Framework for Vulnerability Analysis & Security Report Generation

**BugsCry** is an AI-assisted cybersecurity framework designed to transform raw vulnerability evidence into structured, evidence-grounded, and professional security reports.

Instead of relying on a single AI model, BugsCry uses a **multi-agent LLM pipeline** in which different models perform specialized roles across vulnerability analysis, business translation, report synthesis, and quality validation.

> **Detect less noise. Analyze with evidence. Report with confidence.**

---

## Overview

Security assessments can generate large volumes of raw findings from penetration testing, bug bounty research, SAST tools, API testing, and manual security analysis.

The difficult part is often not only identifying a potential vulnerability, but also determining:

* Is the finding actually valid?
* Is it a false positive?
* What CWE or OWASP category does it belong to?
* What is its severity?
* What is the actual business impact?
* How should a developer remediate it?
* Can the final report be trusted?

BugsCry addresses this workflow by combining **evidence grounding, role-specialized LLMs, structured analysis, and human validation**.

---

## Core Idea

```text
Raw Security Evidence
        │
        ▼
┌─────────────────────┐
│ Evidence Extraction │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│ Gemini — Security Analyst   │
│ • Validity assessment       │
│ • False-positive analysis   │
│ • Vulnerability class       │
│ • CWE / OWASP mapping       │
│ • Severity assessment       │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ ChatGPT — Translator        │
│ • Business impact           │
│ • Executive summary         │
│ • Remediation guidance      │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ Claude — Synthesizer        │
│ • Report assembly           │
│ • Cross-model consistency   │
│ • Contradiction detection   │
│ • Unsupported-claim flags   │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────┐
│ Human Review Gate   │
│ Approve / Modify / Reject │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Final Security Report│
└─────────────────────┘
```

---

## Why Multi-Agent?

BugsCry does not treat every LLM as a general-purpose chatbot.

Each model is assigned a specialized responsibility:

| Agent           | Model   | Primary Responsibility                                                     |
| --------------- | ------- | -------------------------------------------------------------------------- |
| **Analyst**     | Gemini  | Evidence interpretation, validity assessment, vulnerability classification |
| **Translator**  | ChatGPT | Business impact, executive communication, remediation guidance             |
| **Synthesizer** | Claude  | Report synthesis, coherence checking, contradiction detection              |

This role-specialized architecture is intended to reduce the limitations of relying on a single monolithic LLM workflow.

---

## Evidence-Grounded Analysis

A major design principle of BugsCry is:

> **AI-generated claims should be supported by the supplied security evidence.**

The framework accepts heterogeneous evidence such as:

* HTTP request/response pairs
* Screenshots
* Code snippets
* Security-tool output
* Researcher notes
* Structured vulnerability findings

The evidence is converted into a normalized representation before being processed by downstream stages.

For security findings, the analysis can include:

```text
Validity
    ↓
Vulnerability Classification
    ↓
CWE Mapping
    ↓
OWASP Mapping
    ↓
CVSS / Severity Assessment
    ↓
Impact Analysis
    ↓
Remediation
```

Findings with insufficient evidence, low confidence, or significant model disagreement can be routed to human review.

---

## Human-in-the-Loop Validation

BugsCry is designed as an **assistant, not a replacement for security professionals**.

Before a report is finalized, a reviewer can examine the generated analysis and:

```text
APPROVE
   │
   ├── MODIFY
   │
   └── REJECT
```

Human validation is especially important for:

* Low-confidence findings
* Severity disagreements
* Unsupported claims
* Ambiguous evidence
* Incorrect CWE/OWASP mappings
* Context-specific business impact

This creates a final verification layer between AI-generated analysis and report delivery.

---

## Dual-Audience Reporting

A security report often has two very different readers.

### Executive Audience

BugsCry can generate:

* Executive summary
* Business impact
* Potential risk
* Loss/risk framing
* Remediation priority
* Compliance considerations

### Developer / Security Audience

BugsCry can generate:

* Technical vulnerability description
* Evidence
* Reproduction steps
* CWE
* OWASP mapping
* CVSS information
* Remediation guidance
* Secure coding recommendations

The objective is to create a single report that remains understandable to decision-makers while still being actionable for technical teams.

---

## Example

### Input

```text
Endpoint:
POST /api/user/updateEmail

Observed behavior:
An authenticated user can modify the user_id parameter.

Changing user_id from 1024 to 1025
allows modification of another user's account data.

Evidence:
HTTP request/response and researcher notes.
```

### Analysis

```text
Validity:
True Positive

Vulnerability:
Broken Object Level Authorization

CWE:
CWE-639

OWASP:
API1

Severity:
High
```

### Generated Report

```text
Title
Broken Object Level Authorization in User Update API

Summary
The API does not properly verify whether the authenticated
user is authorized to modify the requested object.

Impact
An attacker may modify another user's account information.

Reproduction
1. Authenticate as a valid user.
2. Submit the update request.
3. Modify the user_id parameter.
4. Observe unauthorized modification.

Remediation
Enforce server-side authorization using the authenticated
user's identity and object-level access controls.
```

---

## Key Research Contributions

The BugsCry research explores three major ideas:

### 1. Role-Specialized Multi-Agent Architecture

Different LLMs are assigned different cybersecurity and communication responsibilities instead of using one model for the entire workflow.

### 2. Evidence-Grounded Validation

Security findings are required to be supported by raw evidence, and unsupported or uncertain claims can be flagged for review.

### 3. Dual-Audience Security Reporting

The framework combines executive-level business communication with developer-oriented technical remediation within the same reporting workflow.

---

## Evaluation

The research prototype is evaluated across multiple dimensions:

| Evaluation Area         | Metric                                |
| ----------------------- | ------------------------------------- |
| Validity classification | Precision, Recall, F1                 |
| Severity assessment     | Exact match, CVSS error               |
| Report quality          | Accuracy, completeness, actionability |
| Human validation        | Review time                           |
| Evidence grounding      | Unsupported-claim detection           |

The research paper reports a **preliminary evaluation on a 200-finding dataset**, with reported validity-classification results of:

```text
Precision : 0.91
Recall    : 0.87
F1 Score  : 0.89
```

These values are **preliminary research results**, not a universal claim of BugsCry's accuracy.

---

## Baselines

The research compares the proposed workflow against:

1. **Single-model workflow**
2. **Hybrid SAST + LLM workflow**
3. **Manual security-reporting workflow**

This allows the project to investigate whether multi-agent orchestration can improve reporting quality and reduce analyst effort.

---

## Technology Stack

The prototype architecture described by the research uses:

### Frontend

Browser-based web interface for:

* Evidence input
* File upload
* Analysis status
* Report review
* Final report access

### Backend

**Python + FastAPI**

Responsible for:

* Request handling
* Model orchestration
* State management
* Error handling
* Intermediate result persistence

### AI Providers

* **Google Gemini API**
* **OpenAI API**
* **Anthropic Claude API**

### Report Generation

* **python-docx**
* Template-based security report rendering

### Architecture

```text
Frontend
   │
   ▼
FastAPI Backend
   │
   ▼
Orchestration Layer
   │
   ├── Gemini Adapter
   ├── OpenAI Adapter
   └── Claude Adapter
   │
   ▼
Validation / Report Layer
   │
   ▼
DOCX Security Report
```

---

## Security Design Principles

Because vulnerability evidence can contain sensitive information, BugsCry follows several important design principles:

* API keys remain on the backend.
* Provider credentials should be stored using environment variables.
* Raw evidence should be treated as untrusted input.
* AI-generated output should not automatically be considered authoritative.
* Human review remains part of the workflow.
* Sensitive client evidence should not be sent to third-party AI providers without appropriate authorization and data-handling controls.

---

## Project Status

**Research Prototype / Aavishkar Project**

BugsCry is currently being developed as an experimental cybersecurity research prototype.

The current focus is:

```text
Evidence
   ↓
Analysis
   ↓
Validation
   ↓
Report Generation
```

Future development can extend the framework toward integrations with professional security workflows.

---

## Future Scope

Planned research and development directions include:

* RAG-based organizational context
* Burp Suite integration
* OWASP ZAP integration
* Nuclei and other security-tool imports
* Jira / GitHub issue creation
* Advanced CVSS calculation
* Organization-specific reporting templates
* Human-feedback loops
* Larger evaluation datasets
* Additional LLM providers
* Enterprise deployment
* Privacy-preserving/self-hosted model options

---

## Responsible Use

BugsCry is intended for:

* Authorized penetration testing
* Bug bounty research
* Security assessments
* Application security research
* Educational cybersecurity labs
* Vulnerability documentation

**Do not use BugsCry to analyze or test systems without authorization.**

BugsCry generates AI-assisted security analysis and documentation. Its output should be reviewed by a qualified security professional before being used in a real security engagement.

---

## Research Paper

This repository accompanies the research work:

> **An Evidence-Grounded Multi-Agent LLM Framework for Vulnerability Analysis and Report Generation**

**Author:** Kaif Shaikh ( Magician Slime )

The research describes the framework architecture, orchestration protocol, evaluation methodology, limitations, and future research directions.

---

## Author

**Kaif Shaikh ( Magician Slime )**
Cybersecurity Student & Security Researcher

---

## Project Vision

```text
From raw evidence
        ↓
to security intelligence
        ↓
to actionable remediation.
```

**BugsCry — turning security findings into evidence-grounded reports.**

---

## Disclaimer

This project is an academic and research-oriented prototype.

The AI-generated output may contain errors, omissions, or incorrect security classifications. Always verify findings, severity, impact, and remediation recommendations against the original evidence and relevant security standards before relying on the output.

---
