const fs = require('fs');
const content = fs.readFileSync('src/components/BeatUploader.tsx', 'utf8');

// Simplistic tag matching to find unclosed divs
let divCount = 0;
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Count opening divs
  const opens = (line.match(/<div/g) || []).length;
  // Count closing divs
  const closes = (line.match(/<\/div>/g) || []).length;
  
  divCount += opens;
  divCount -= closes;
  
  // If count is crazy, log it
  if (i > 3460) {
    console.log(`Line ${i + 1}: count=${divCount} opens=${opens} closes=${closes}`);
  }
}
console.log('Final div count:', divCount);
