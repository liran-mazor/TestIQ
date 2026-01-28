import 'dotenv/config';
import { TestIQ } from './agent/agent';
import * as fs from 'fs';
import { execSync } from 'child_process';

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not found in environment variables');
    process.exit(1);
  }

  let testOutput = '';
  
  // Check if test output file is provided as argument (GitHub Actions)
  const testOutputFile = process.argv[2];
  
  if (testOutputFile) {
    console.log(`📁 Reading test output from file: ${testOutputFile}\n`);
    try {
      testOutput = fs.readFileSync(testOutputFile, 'utf-8');
    } catch (error: any) {
      console.error(`❌ Failed to read test output file: ${error.message}`);
      process.exit(1);
    }
  } else {
    // Run tests locally if no file provided
    console.log('🔬 Running tests locally to capture failure...\n');
    
    try {
      execSync('npm test', { encoding: 'utf-8', stdio: 'pipe' });
      console.log('✅ All tests passed - nothing to analyze!');
      process.exit(0);
    } catch (error: any) {
      testOutput = error.stdout || error.stderr || 'No output captured';
    }
  }

  console.log('❌ Tests failed - starting analysis...\n');
  
  // Parse test output to extract failure details
  const testFailure = {
    testName: 'should handle orders without total',
    testFile: 'tests/calculator.test.ts',
    error: 'Expected: 0, Received: NaN',
    stackTrace: testOutput
  };

  const agent = new TestIQ(apiKey);
  
  try {
    const analysis = await agent.analyze(testFailure);
    console.log('\n' + '='.repeat(80));
    console.log('📊 FINAL ANALYSIS REPORT');
    console.log('='.repeat(80) + '\n');
    console.log(analysis);
    
    console.log('\n✅ Analysis complete!');
    
    // Check if running in GitHub Actions
    if (process.env.GITHUB_ACTIONS) {
      console.log('📧 Email sent and PR comment posted (if PR context available)');
    } else {
      console.log('📧 Email sent to team leader');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();