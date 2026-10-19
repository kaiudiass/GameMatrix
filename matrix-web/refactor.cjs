const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace font-size: XXpx with rem (assuming 1rem = 10px on base)
  content = content.replace(/font-size:\s*(\d+)px/g, (match, p1) => {
    return `font-size: ${parseInt(p1) / 10}rem`;
  });
  
  // Replace max-width: XXpx with rem
  content = content.replace(/max-width:\s*(\d+)px/g, (match, p1) => {
    return `max-width: ${parseInt(p1) / 10}rem`;
  });
  
  fs.writeFileSync(file, content);
});

console.log('CSS files refactored to use rem for font-size and max-width.');
