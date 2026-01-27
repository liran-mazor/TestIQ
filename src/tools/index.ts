import { Tool } from './types';
import { fileReaderTool } from './fileReaderTool';
import { testParserTool } from './testParserTool';
import { gitDiffTool } from './gitDiffTool';
import { githubApiTool } from './githubApiTool';

export const tools: Tool[] = [
  fileReaderTool,
  testParserTool,
  gitDiffTool,
  githubApiTool,
];

export function getToolByName(name: string): Tool | undefined {
  return tools.find(tool => tool.name === name);
}

export * from './types';
