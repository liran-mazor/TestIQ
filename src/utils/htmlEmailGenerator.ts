import { marked } from 'marked';

export function generateHtmlEmail(markdownContent: string, title: string): string {
  const htmlContent = marked(markdownContent);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #e6edf3;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #0d1117;
    }
    .container {
      background-color: #161b22;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 1px solid #30363d;
    }
    h1 {
      color: #f85149;
      border-bottom: 3px solid #f85149;
      padding-bottom: 10px;
      margin-top: 0;
    }
    h2 {
      color: #58a6ff;
      margin-top: 30px;
      border-left: 4px solid #58a6ff;
      padding-left: 15px;
    }
    h3 {
      color: #8b949e;
      margin-top: 20px;
    }
    code {
      background-color: #161b22;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
      color: #f85149;
      font-size: 0.9em;
      border: 1px solid #30363d;
    }
    pre {
      background-color: #0d1117;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
    }
    pre code {
      background-color: transparent;
      padding: 0;
      color: #e6edf3;
      font-size: 0.85em;
      border: none;
    }
    ul, ol {
      padding-left: 25px;
    }
    li {
      margin: 8px 0;
    }
    strong {
      color: #f0f6fc;
    }
    a {
      color: #58a6ff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #30363d;
      text-align: center;
      color: #8b949e;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    ${htmlContent}
    <div class="footer">
      <p><strong>🤖 TestIQ - Autonomous CI/CD Test Analyzer</strong></p>
      <p>Generated automatically by AI • For questions, contact your DevOps team</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}