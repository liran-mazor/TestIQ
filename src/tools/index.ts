import { Tool } from './types';
import { fileReaderTool } from './fileReaderTool';
import { testParserTool } from './testParserTool';
import { gitDiffTool } from './gitDiffTool';
import { githubApiTool } from './githubApiTool';
import { documentGeneratorTool } from './documentGeneratorTool';
import { emailTool } from './emailTool';

export const tools: Tool[] = [
  fileReaderTool,
  testParserTool,
  gitDiffTool,
  githubApiTool,
  documentGeneratorTool,
  emailTool,
];

export function getToolByName(name: string): Tool | undefined {
  return tools.find(tool => tool.name === name);
}

export * from './types';
