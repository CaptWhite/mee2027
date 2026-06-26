import fs from 'fs';
import path from 'path';

const docsDir = './src/content/docs/Apéndices';

// Read all files in src/content/docs
const files = fs.readdirSync(docsDir);

files.forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(docsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add newlines before and after any line that is a $$ ... $$ equation
    // We match lines that contain only a $$ ... $$ formula (with optional surrounding space)
    // We replace it to ensure a blank line before and after.
    const originalLength = content.length;
    
    // Convert single-line $$ formula $$ on its own line to multi-line $$ blocks
    content = content.replace(/(?:\r?\n|^)[ \t]*\$\$(.*?)\$\$[ \t]*(?:\r?\n|$)/g, (match, formula) => {
      return `\n\n$$\n${formula.trim()}\n$$\n\n`;
    });
    
    if (content.length !== originalLength) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Preprocessed: ${file}`);
    }
  }
});
