# TestIQ - Project State (LLM Context Document)

## Overview
Autonomous CI/CD Test Failure Analyzer. Built from scratch using ReAct pattern with Claude Sonnet 4 to analyze test failures and generate actionable developer reports.

**Stack:** Node.js, TypeScript, Claude Sonnet 4, GitHub Actions

---

## Current Status: CORE TOOLS COMPLETE ✅

### Project Goal
When tests fail in CI/CD:
1. Agent reads test failure output
2. Examines relevant source files
3. Checks recent git changes
4. Generates root cause analysis with suggested fixes
5. Posts report as GitHub PR comment

### Planned Capabilities
- **Test Analysis:** Parse Jest/Mocha/Pytest output
- **Code Context:** Read source files from stack traces
- **Git Integration:** See recent commits that might have caused failures
- **Smart Reports:** Markdown analysis with file references and fix suggestions
- **GitHub Integration:** Post as PR comments automatically

### 4 Implemented Tools ✅
1. **file_reader_tool** - Read source code files from repository
2. **git_diff_tool** - Get recent commits and changes
3. **test_parser_tool** - Parse test runner output (Jest/Mocha)
4. **github_api_tool** - Post comments on PRs

### 1 Interface
- **GitHub Action** - Triggers on test failure, runs agent, posts comment

---

## Architecture (From AgentIQ Pattern)

### ReAct Control Loop
Same pattern as AgentIQ:
```typescript
public async run(testFailure: TestFailure): Promise<string>
```

**Flow:**
1. Receive test failure data (error message, stack trace, test name)
2. Agent decides which tools to use (file reader, git diff, etc.)
3. Execute tools via registry
4. Generate analysis report
5. Return markdown report

### Tool Registry Pattern
Location: `src/tools/index.ts`

Each tool exports:
```typescript
interface Tool {
  name: string;
  description: string;
  parameters: ZodSchema;
  execute: (params: any) => Promise<ToolResult>;
}
```

### No Conversation Memory Needed
Unlike AgentIQ (multi-turn BI queries), TestIQ is **single-shot analysis**:
- Input: Test failure data
- Output: Analysis report
- No follow-up questions

---

## File Structure (Planned)
```
src/
├── agent/
│   ├── agent.ts              # Core ReAct loop
│   └── prompts.ts            # System prompt
├── tools/
│   ├── fileReaderTool.ts     # Read source files
│   ├── gitDiffTool.ts        # Git history
│   ├── testParserTool.ts     # Parse test output
│   ├── githubApiTool.ts      # Post PR comments
│   ├── types.ts              # Tool interfaces
│   └── index.ts              # Tool registry
├── workflows/
│   └── analyze-failures.yml  # GitHub Action
└── index.ts                  # CLI entry (for local testing)
```

---

## Environment Variables (Planned)
```env
# LLM API
ANTHROPIC_API_KEY=sk-ant-...

# GitHub Integration
GITHUB_TOKEN=ghp_...          # For posting comments
GITHUB_REPOSITORY=owner/repo  # Auto-provided by Actions
GITHUB_SHA=commit-hash        # Auto-provided by Actions
```

---

## Technical Decisions

### Why GitHub Actions (Not Jenkins)?
- Easier to demo in public repos
- YAML-based (simpler than Groovy)
- Free for open source
- Better portfolio showcase

### Why Single-Shot (No Memory)?
- Test analysis is one-time: failure → report
- No conversation needed
- Simpler architecture

### Why Copy AgentIQ Patterns?
- Proven ReAct implementation
- Tool registry already works
- Faster development

---

## Development Plan

### Phase 1: Core Agent ✅ (Current)
- [ ] Initialize repo
- [ ] Setup TypeScript + dependencies
- [ ] Copy ReAct loop from AgentIQ
- [ ] Create system prompt for test analysis

### Phase 2: Tools
- [ ] file_reader_tool
- [ ] git_diff_tool
- [ ] test_parser_tool
- [ ] github_api_tool

### Phase 3: GitHub Action
- [ ] Create workflow YAML
- [ ] Test failure detection
- [ ] Agent integration
- [ ] PR comment posting

### Phase 4: Demo
- [ ] Demo repo with failing tests
- [ ] Example PR with agent comment
- [ ] README with video/screenshots

---

## Demo Scenario (Target)

**Setup:**
1. Developer pushes code with bug
2. CI runs tests → Test fails
3. TestIQ GitHub Action triggers

**Agent Flow:**
1. Parses error: "TypeError: Cannot read property 'total' of undefined"
2. Reads `revenue.ts` (from stack trace)
3. Checks recent commits (sees Order type changed)
4. Reads test file `revenue.test.ts`
5. Generates report

**Output (Posted as PR Comment):**
```markdown
## 🤖 TestIQ Analysis

**Failed Test:** `should calculate revenue`
**Error:** TypeError: Cannot read property 'total' of undefined

### Root Cause
Recent commit abc123 changed the Order type to require `total` property,
but the test mock wasn't updated.

### Suggested Fix
Update test mock in `tests/revenue.test.ts:12`:

\`\`\`typescript
// Current
const mockOrder = { id: 1, customer_id: 2 };

// Suggested
const mockOrder = { id: 1, customer_id: 2, total: 100 };
\`\`\`

### Files to Review
- `src/revenue.ts` (function expects total)
- `tests/revenue.test.ts` (mock needs updating)
- `types/Order.ts` (type definition changed)
```

---

## Key Differences from AgentIQ

| Aspect | AgentIQ | TestIQ |
|--------|---------|--------|
| **Use Case** | Business questions | Test failure analysis |
| **User** | Business analysts | Developers |
| **Interaction** | Multi-turn conversation | Single-shot analysis |
| **Memory** | Per-session history | None needed |
| **Interface** | CLI, Telegram bot | GitHub Action |
| **Tools** | SQL, charts, email | File reader, git, GitHub API |

---

## GitHub Repository
https://github.com/liran-mazor/TestIQ (to be created)

---

**Last Updated:** January 2026  
**Maintainer:** Liran Mazor  
**Purpose:** Technical demonstration for agentic AI engineering interviews