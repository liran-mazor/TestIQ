import { z } from 'zod';
import { Tool, ToolResult } from './types';
import { Octokit } from '@octokit/rest';

const GithubApiParams = z.object({
  action: z.enum(['post_comment', 'get_pr_info']).describe('Action to perform'),
  content: z.string().optional().describe('Comment content (markdown) for post_comment action'),
});

async function execute(params: z.infer<typeof GithubApiParams>): Promise<ToolResult> {
  try {
    const { action, content } = params;
    
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

      // Check if running in GitHub Actions
      if (!token || !repository || !prNumber) {
        return {
          success: true,
          data: {
            message: 'Mock: Would post comment to GitHub PR',
            content: content.substring(0, 200) + '...',
            note: 'GitHub environment variables not set (running locally)'
          }
        };
      }

      // Real implementation with Octokit
      const octokit = new Octokit({ auth: token });
      const [owner, repo] = repository.split('/');

      const comment = await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: parseInt(prNumber),
        body: content
      });

      return {
        success: true,
        data: {
          message: 'Comment posted successfully',
          commentId: comment.data.id,
          url: comment.data.html_url,
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
          message: repository && prNumber ? 'PR info available' : 'Not running in PR context'
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
  description: 'Interact with GitHub API. Actions: post_comment (post analysis summary to PR as a comment), get_pr_info (get PR details). Use post_comment to share a brief summary of your analysis on the PR.',
  parameters: GithubApiParams,
  execute
};