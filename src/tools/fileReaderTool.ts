import { z } from 'zod';
import { Tool, ToolResult } from './types';
import * as fs from 'fs';
import * as path from 'path';

const FileReaderParams = z.object({
  filePath: z.string().describe('Path to the file to read (relative to repository root)'),
  startLine: z.number().optional().describe('Optional: Start line number (1-indexed)'),
  endLine: z.number().optional().describe('Optional: End line number (1-indexed)')
});

async function execute(params: z.infer<typeof FileReaderParams>): Promise<ToolResult> {
  try {
    const { filePath, startLine, endLine } = params;
    
    // In real usage, this would be the repo root
    // For now, we'll read from current working directory
    const fullPath = path.resolve(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      return {
        success: false,
        error: `File not found: ${filePath}`
      };
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');

    // If line range specified, extract only those lines
    if (startLine !== undefined && endLine !== undefined) {
      // Handle -1 as "end of file"
      const end = endLine === -1 ? lines.length : endLine;
      const selectedLines = lines.slice(startLine - 1, end);
      return {
        success: true,
        data: {
          filePath,
          lineRange: endLine === -1 ? `${startLine}-end` : `${startLine}-${endLine}`,
          content: selectedLines.join('\n'),
          totalLines: lines.length
        }
      };
    }

    return {
      success: true,
      data: {
        filePath,
        content,
        totalLines: lines.length
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to read file: ${error.message}`
    };
  }
}

export const fileReaderTool: Tool = {
  name: 'file_reader_tool',
  description: 'Read source code files from the repository. Can read entire file or specific line ranges. Use this to examine files mentioned in stack traces or to understand the code context.',
  parameters: FileReaderParams,
  execute
};