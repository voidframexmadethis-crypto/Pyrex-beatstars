import fs from 'fs';

const content = fs.readFileSync('src/components/BeatUploader.tsx', 'utf8');

const tags = [];
const regex = /<\/?([a-zA-Z0-9]+)(>|\s[^>]*>)/g;
let match;
let lineNumber = 1;
let lastIndex = 0;

while ((match = regex.exec(content)) !== null) {
  const textBefore = content.substring(lastIndex, match.index);
  lineNumber += (textBefore.match(/\n/g) || []).length;
  lastIndex = match.index;
  
  const tagString = match[0];
  const tagName = match[1];
  
  if (tagString.endsWith('/>')) continue;
  if (['img', 'input', 'br', 'hr', 'source', 'path', 'circle', 'svg', 'rect', 'line', 'polyline', 'polygon'].includes(tagName.toLowerCase())) continue;

  if (content.substring(match.index, match.index + 50).includes('STEP 2:')) {
    console.log(`STACK at STEP 2 (line ${lineNumber}):`);
    tags.forEach(t => console.log(`  ${t.name} (line ${t.line})`));
  }

  if (tagString.startsWith('</')) {
    if (tags.length > 0) {
      if (tags[tags.length - 1].name === tagName) {
        tags.pop();
      } else {
        tags.pop();
      }
    }
  } else {
    tags.push({ name: tagName, line: lineNumber, str: tagString });
  }
}
