const fs = require('fs');
const content = fs.readFileSync('src/components/BeatUploader.tsx', 'utf8');

let divCount = 0;
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Remove comments so they don't mess up counting
  const noComments = line.replace(/\{\/\*.*?\*\/\}/g, '').replace(/\/\/.*$/, '');
  
  const opens = (noComments.match(/<div/g) || []).length;
  const closes = (noComments.match(/<\/div>/g) || []).length;
  
  divCount += opens;
  divCount -= closes;
}
console.log('Final div count:', divCount);
