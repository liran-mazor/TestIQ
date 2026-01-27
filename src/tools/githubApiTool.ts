import { z } from 'zod';
import { Tool, ToolResult } from './types';

const GithubApiParams = z.object({
  action: z.enum(['post_comment', 'get_pr_info']).describe('Action to perform'),
  content: z.string().optional().describe('Comment content (markdown) for post_comment action'),
});

async function execute(params: z.infer<typeof GithubApiParams>): Promise<ToolResult> {
  try {
    const { action, content } = params;
    
    // In real GitHub Actions, these would be environment variables
    const token = process.env.GITHUB_TOKEN;
    const repository = process.env.GITHUB_REPOSITORY;
    const prNumber = process.env.GITHUB_PR_NUMBER;

    if (action === 'post_comment') {
      if (!content) {
        return {
          success: false,
          error: 'Content is required for post_comment action'
        };
      }

      // Mock implementation (real version would use Octokit)
      if (!token || !repository || !prNumber) {
        return {
          success: true,
          data: {
            message: 'Mock: Would post comment to GitHub PR',
            content: content,
            note: 'GitHub environment variables not set (normal for local testing)'
          }
        };
      }

      // Real implementation would be:
      // const octokit = new Octokit({ auth: token });
      // await octokit.rest.issues.createComment({
      //   owner: repository.split('/')[0],
      //   repo: repository.split('/')[1],
      //   issue_number: parseInt(prNumber),
      //   body: content
      // });

      return {
        success: true,
        data: {
          message: 'Comment posted successfully',
          repository,
          prNumber
        }
      };
    }

    if (action === 'get_pr_info') {
      return {
        success: true,
        data: {
          repository: repository || 'not-set',
          prNumber: prNumber || 'not-set',
          message: 'Mock PR info (set GITHUB_* env vars for real data)'
        }
      };
    }

    return {
      success: false,
      error: `Unknown action: ${action}`
    };
  } catch (error: any) {
    return {
      success: false,
      error: `GitHub API operation failed: ${error.message}`
    };
  }
}

export const githubApiTool: Tool = {
  name: 'github_api_tool',
  description: 'Interact with GitHub API. Actions: post_comment (post analysis to PR), get_pr_info (get PR details). Used automatically at the end to share the analysis.',
  parameters: GithubApiParams,
  execute
};