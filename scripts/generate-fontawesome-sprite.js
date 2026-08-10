const fs = require('fs');
const path = require('path');

const vendorDir = path.join(__dirname, '..', 'assets', 'vendor', 'fontawesome-pro');
const outputFile = path.join(__dirname, '..', 'assets', 'img', 'fontawesome-pro.svg');

const icons = fs.readdirSync(vendorDir)
  .filter((filename) => filename.endsWith('.svg'))
  .sort();

const symbols = icons.map((filename) => {
  const source = fs.readFileSync(path.join(vendorDir, filename), 'utf8');
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1];
  const contents = source
    .replace(/^.*?<svg[^>]*>/s, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  if (!viewBox || !contents) {
    throw new Error(`Unable to parse Font Awesome icon: ${filename}`);
  }

  const id = path.basename(filename, '.svg');
  return `  <symbol id="${id}" viewBox="${viewBox}">${contents}</symbol>`;
});

const sprite = `<svg xmlns="http://www.w3.org/2000/svg">
<!-- Font Awesome Pro 7.3.1. Commercial license: https://fontawesome.com/license -->
${symbols.join('\n')}
</svg>
`;

fs.writeFileSync(outputFile, sprite);
console.log(`Generated Font Awesome Pro sprite with ${icons.length} icons.`);
