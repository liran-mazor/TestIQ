import { z } from 'zod';
import { Tool, ToolResult } from './types';

const TestParserParams = z.object({
  testOutput: z.string().describe('Raw test runner output (Jest, Mocha, etc.) to parse'),
});

async function execute(params: z.infer<typeof TestParserParams>): Promise<ToolResult> {
  try {
    const { testOutput } = params;
    
    // Extract information from test output
    const parsed = {
      failedTests: [] as string[],
      errors: [] as string[],
      stackTraces: [] as string[],
      affectedFiles: [] as string[],
    };

    // Simple parsing logic (can be enhanced for different test runners)
    const lines = testOutput.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect failed test names (Jest format: ✕ test name)
      if (line.includes('✕') || line.includes('FAIL') || line.includes('×')) {
        parsed.failedTests.push(line.trim());
      }
      
      // Detect error messages (lines with Error:, TypeError:, etc.)
      if (line.match(/Error:|TypeError:|ReferenceError:|SyntaxError:/)) {
        parsed.errors.push(line.trim());
      }
      
      // Detect file paths in stack traces
      const fileMatch = line.match(/at .* \((.+\.ts|.+\.js|.+\.tsx|.+\.jsx):(\d+):(\d+)\)/);
      if (fileMatch) {
        const filePath = fileMatch[1];
        if (!parsed.affectedFiles.includes(filePath)) {
          parsed.affectedFiles.push(filePath);
        }
        parsed.stackTraces.push(line.trim());
      }
    }

    return {
      success: true,
      data: {
        summary: {
          totalFailedTests: parsed.failedTests.length,
          totalErrors: parsed.errors.length,
          affectedFilesCount: parsed.affectedFiles.length,
        },
        failedTests: parsed.failedTests,
        errors: parsed.errors,
        stackTraces: parsed.stackTraces,
        affectedFiles: parsed.affectedFiles,
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to parse test output: ${error.message}`
    };
  }
}

export const testParserTool: Tool = {
  name: 'test_parser_tool',
  description: 'Parse test runner output (Jest, Mocha, etc.) to extract failed test names, error messages, stack traces, and affected files. Use this to understand the structure of test failures.',
  parameters: TestParserParams,
  execute
};