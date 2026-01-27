import 'dotenv/config';
import { TestIQ } from './agent/agent';

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not found in environment variables');
    process.exit(1);
  }

  // Mock test failure for testing
  const mockTestFailure = {
    testName: 'should calculate total revenue',
    testFile: 'tests/revenue.test.ts',
    error: 'TypeError: Cannot read property "total" of undefined',
    stackTrace: `
    at calculateRevenue (src/revenue.ts:45:12)
    at Object.<anonymous> (tests/revenue.test.ts:10:5)
    `
  };

  const agent = new TestIQ(apiKey);
  
  try {
    const analysis = await agent.analyze(mockTestFailure);
    console.log('\n📊 Analysis Report:\n');
    console.log(analysis);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();