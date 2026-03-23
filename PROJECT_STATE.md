# TestIQ - Project State (LLM Context Document)

## Overview
Autonomous CI/CD Test Failure Analyzer. Built from scratch using ReAct pattern with Claude Sonnet 4 to analyze test failures, upload beautiful HTML reports to S3, and email team leaders.

**Stack:** Node.js, TypeScript, Claude Sonnet 4, GitHub Actions, AWS S3, Jest

---

## Current Status: NEAR COMPLETE (Polish Phase) 🚧

### Fully Working Features ✅
- **5 Autonomous Tools:** file_reader, git_diff, test_parser, document_generator, email
- **ReAct Control Loop:** Claude Sonnet 4 with tool orchestration
- **Real Test Execution:** Jest tests trigger actual failures
- **Document Generation:** Markdown + HTML reports
- **S3 Upload:** HTML reports hosted on AWS S3 with public URLs
- **Email Delivery:** Concise emails with S3 links (no attachments)
- **GitHub Actions:** CI/CD integration (tests fail → agent triggers → email sent)
- **Local Testing:** `npm start` for immediate analysis

### Currently Polishing 🎨
- HTML report styling (dark mode, better fonts, cleaner layout)
- Report content (removing duplicate headers, too much detail)
- Template enforcement (agent sometimes ignores format instructions)

### Architecture Highlights
- **Single-shot analysis** (no conversation memory needed)
- **File-based test output** (CI saves to artifact, agent reads)
- **S3-hosted reports** (beautiful HTML, no downloads needed)
- **Email-first delivery** (link to report, not attachments)

---

## Tools & Capabilities

### 1. file_reader_tool
- Reads source files from repository
- Supports line range selection
- Handles both absolute and relative paths

### 2. git_diff_tool  
- Gets recent commits and changed files
- Filters by file pattern
- Extracts commit metadata (author, date, message)

### 3. test_parser_tool
- Parses Jest/Mocha output
- Extracts failed test names, errors, stack traces
- Identifies affected files from stack traces

### 4. document_generator_tool
- Creates markdown + HTML reports
- Uploads HTML to S3 automatically
- Returns public URL for sharing
- Applies beautiful dark-mode styling

### 5. email_tool
- Sends concise summary emails
- Resolves role-based recipients (team_leader → email)
- Includes S3 link to full report
- No file attachments (link only)

---

## Workflow: How It Works

### Local Development
```bash
npm start  # Runs tests, captures failure, analyzes, emails
```

### CI/CD (GitHub Actions)
```
1. Developer pushes code to PR
2. ci-tests.yml runs → Tests FAIL
3. test-failure-analysis.yml triggers
   - Downloads test output artifact
   - Runs TestIQ agent
   - Agent uses tools autonomously
   - Generates HTML report
   - Uploads to S3
   - Emails team leader with link
4. Team leader receives email with S3 link
5. Clicks link → Beautiful HTML report in browser
```

---

## File Structure
```
src/
├── agent/
│   ├── agent.ts              # ReAct control loop
│   └── prompts.ts            # System prompt
├── tools/
│   ├── fileReaderTool.ts     # Read source files
│   ├── gitDiffTool.ts        # Git history
│   ├── testParserTool.ts     # Parse test output
│   ├── documentGeneratorTool.ts  # Generate markdown + HTML
│   ├── emailTool.ts          # Send emails
│   ├── types.ts              # Tool interfaces
│   └── index.ts              # Tool registry
├── utils/
│   ├── s3Upload.ts           # AWS S3 uploads
│   └── htmlEmailGenerator.ts # HTML report styling
├── config/
│   └── team.ts               # Team member email mappings
├── app/
│   └── calculator.ts         # Demo app with intentional bug
├── tests/
│   └── calculator.test.ts    # Tests with intentional failure
└── index.ts                  # CLI entry point

.github/workflows/
├── ci-tests.yml              # Runs tests, saves output
└── test-failure-analysis.yml # Runs TestIQ on failures
```

---

## Environment Variables

### Local (.env)
```env
ANTHROPIC_API_KEY=sk-ant-...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-north-1
AWS_S3_BUCKET=agentiq-charts-liran
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=email@gmail.com
SMTP_PASS=app-password
EMAIL_FROM=email@gmail.com
```

### GitHub Secrets (Required)
All of the above plus:
- `GITHUB_TOKEN` (auto-provided)

---

## Key Design Decisions

### Why Email Instead of PR Comments?
- PR comments hit GitHub's `workflow_run` permission restrictions (403 errors)
- Email is more reliable and reaches team leaders immediately
- S3-hosted HTML provides better formatting than markdown comments
- **Future:** Can add PAT (Personal Access Token) for PR comments if needed

### Why S3-Hosted HTML?
- No downloads required (click link → see report)
- Beautiful formatting with dark mode styling
- Professional presentation
- Permanent links for reference

### Why No Attachments?
- Email clients often block/hide attachments
- S3 link is cleaner and faster
- HTML renders better in browser than email client
- Reduces email size

### Why Single-Shot (No Memory)?
- Test analysis is one-time: failure → report → done
- No conversation needed
- Simpler architecture
- Lower token costs

---

## Known Issues & TODO

### Current Issues (Being Fixed)
- [ ] HTML report has duplicate titles (working on template enforcement)
- [ ] Agent sometimes ignores format instructions (refining prompt)
- [ ] Font size too small in HTML (adjusting CSS)
- [ ] Too much detail in reports (enforcing strict template)

### Future Enhancements
- [ ] Publish as npm package (`npm install -g testiq`)
- [ ] Create GitHub Action (`uses: liran-mazor/testiq-action@v1`)
- [ ] Support more test frameworks (Pytest, RSpec, PHPUnit)
- [ ] Add PAT support for PR comments
- [ ] Semantic caching for similar failures
- [ ] Historical failure pattern analysis

---

## Comparison with AgentIQ

| Aspect | AgentIQ | TestIQ |
|--------|---------|--------|
| **Domain** | Business Intelligence | CI/CD Test Analysis |
| **User** | Business analysts | Developers |
| **Interaction** | Multi-turn conversation | Single-shot analysis |
| **Memory** | Per-session history | Stateless |
| **Interface** | CLI + Telegram + Interactive | GitHub Actions + CLI |
| **Tools** | SQL, Charts, Web Search, Email, Calculator, Monitoring | File Reader, Git Diff, Test Parser, Document Gen, Email |
| **Output** | Charts (S3), Emails with attachments | HTML Reports (S3), Emails with links |
| **Deployment** | Docker + PostgreSQL + cAdvisor | Jest + GitHub Actions + AWS S3 |

**Common Pattern:** Both use ReAct with Claude Sonnet 4, custom tool registries, Zod validation

---

## Demo Materials (Ready)

### Live Demo
- **Repository:** https://github.com/liran-mazor/TestIQ
- **Test PR:** https://github.com/liran-mazor/TestIQ/pull/1
- **Sample Report:** https://agentiq-charts-liran.s3.eu-north-1.amazonaws.com/reports/[filename]

### Local Demo
```bash
git clone https://github.com/liran-mazor/TestIQ
cd TestIQ
npm install
npm start  # Analyzes intentional test failure
```

---

## Interview Talking Points

> "TestIQ is an autonomous CI/CD analyzer I built from scratch using Claude Sonnet 4's ReAct pattern. When tests fail in GitHub Actions, it automatically reads the failure output, examines source files, checks git history, generates a comprehensive HTML report, uploads it to S3, and emails the team leader with a link - all without human intervention. I chose email over PR comments due to GitHub's workflow_run security restrictions, but the S3-hosted HTML reports actually provide better formatting. The system demonstrates advanced agent orchestration, tool chaining, and production-ready error handling - all without using frameworks like LangChain."

---

**Last Updated:** January 2026  
**Status:** 95% Complete (polishing HTML styling)  
**Maintainer:** Liran Mazor  
**Purpose:** Technical demonstration for agentic AI engineering interviews