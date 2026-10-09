const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🔍 Cross-referencing DOM IDs between script.js and index.html...\n');

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

// Extract all getElementById calls
const getElementByIdRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
const jsIds = new Set();
let match;
while ((match = getElementByIdRegex.exec(jsContent)) !== null) {
  jsIds.add(match[1]);
}

// Extract all IDs from HTML
const htmlIdRegex = /id=["']([^"']+)["']/g;
const htmlIds = new Set();
while ((match = htmlIdRegex.exec(htmlContent)) !== null) {
  htmlIds.add(match[1]);
}

let missingCount = 0;
jsIds.forEach(id => {
  if (!htmlIds.has(id)) {
    console.error(`  ❌ Missing in HTML: id="${id}" (queried in script.js)`);
    missingCount++;
  } else {
    console.log(`  ✅ Verified ID: id="${id}"`);
  }
});

console.log(`\nVerified ${jsIds.size} referenced IDs. Missing: ${missingCount}`);
if (missingCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 100% of DOM IDs in script.js exist in index.html!\n');
}
