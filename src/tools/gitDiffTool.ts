import { z } from 'zod';
import { Tool, ToolResult } from './types';
import { execSync } from 'child_process';

const GitDiffParams = z.object({
  filePattern: z.string().optional().describe('Optional: Filter commits by file pattern (e.g., "src/*.ts")'),
  commitCount: z.number().optional().describe('Number of recent commits to retrieve (default: 10)'),
});

async function execute(params: z.infer<typeof GitDiffParams>): Promise<ToolResult> {
  try {
    const { filePattern, commitCount = 10 } = params;
    
    // Check if we're in a git repository
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    } catch {
      return {
        success: false,
        error: 'Not a git repository'
      };
    }

    // Get recent commits
    let command = `git log -${commitCount} --pretty=format:"%H|%an|%ae|%ad|%s" --date=short`;
    if (filePattern) {
      command += ` -- ${filePattern}`;
    }

    const output = execSync(command, { encoding: 'utf-8' });
    const commits = output.split('\n').filter(line => line.trim()).map(line => {
      const [hash, author, email, date, message] = line.split('|');
      return { hash, author, email, date, message };
    });

    // Get changed files in recent commits
    const changedFiles: string[] = [];
    for (const commit of commits.slice(0, 5)) { // Only check last 5 commits for files
      try {
        const files = execSync(`git diff-tree --no-commit-id --name-only -r ${commit.hash}`, { encoding: 'utf-8' });
        files.split('\n').filter(f => f.trim()).forEach(file => {
          if (!changedFiles.includes(file)) {
            changedFiles.push(file);
          }
        });
      } catch {
        // Skip if commit diff fails
      }
    }

    return {
      success: true,
      data: {
        recentCommits: commits,
        changedFiles: changedFiles.slice(0, 20), // Limit to 20 files
        summary: `Found ${commits.length} recent commits affecting ${changedFiles.length} files`
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Git operation failed: ${error.message}`
    };
  }
}

export const gitDiffTool: Tool = {
  name: 'git_diff_tool',
  description: 'Get recent git commits and changed files. Use this to see what code changes might have caused the test failure. Can filter by file pattern.',
  parameters: GitDiffParams,
  execute
};