const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const files = [
  'index.html',
  'manifest.json',
  'offline.html',
  'sw.js',
  'privacy-policy',
  'terms',
  'assets/bootstrap/css/bootstrap.min.css',
  'assets/css/styles.min.css',
  'assets/img',
  'assets/js/app.js',
  'assets/js/smart-forms.min.js'
];

fs.rmSync(output, { force: true, recursive: true });
fs.mkdirSync(output, { recursive: true });

for (const entry of files) {
  const source = path.join(root, entry);
  const destination = path.join(output, entry);

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
}

console.log(`Built static site in ${path.relative(root, output)}/.`);
