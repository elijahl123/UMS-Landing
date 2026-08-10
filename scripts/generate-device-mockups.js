const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, '..', 'assets', 'img');

const c = {
  coral: '#f8ad9d',
  coralStrong: '#f08080',
  coralShade: '#f4978e',
  ink: '#56494c',
  muted: '#9a9295',
  line: '#e8e8e8',
  canvas: '#f7f7f7',
  white: '#ffffff',
  mint: '#eaf6f1',
  green: '#9fd0b6',
  blue: '#e7eefb',
  blueStrong: '#9bb6e7',
  yellow: '#fff5d8',
  yellowStrong: '#d8bf7b',
  pink: '#fff0ed',
  purple: '#f0eafa',
  purpleStrong: '#b49cdd',
};

const courses = [
  [c.yellow, c.yellowStrong],
  [c.blue, c.blueStrong],
  [c.mint, c.green],
  [c.purple, c.purpleStrong],
  [c.pink, c.coralStrong],
];

function svg(title, description, viewBox, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="title description">
  <title id="title">${title}</title>
  <desc id="description">${description}</desc>
  ${body}
</svg>
`;
}

function rect(x, y, width, height, fill = c.white, stroke = c.line, radius = 10, extra = '') {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" ${extra}/>`;
}

function bar(x, y, width, height = 10, fill = c.line, radius = height / 2, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" opacity="${opacity}"/>`;
}

function dot(x, y, radius = 7, fill = c.coral) {
  return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}"/>`;
}

function check(x, y, scale = 1, color = c.green) {
  return `<path d="M${x} ${y + 7 * scale}l${5 * scale} ${5 * scale} ${11 * scale}-${13 * scale}" fill="none" stroke="${color}" stroke-width="${3 * scale}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function iconTile(x, y, fill = c.pink, accent = c.coralStrong, size = 34) {
  return `${rect(x, y, size, size, fill, 'none', 8)}
  <circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size * 0.22}" fill="none" stroke="${accent}" stroke-width="3"/>
  ${bar(x + size * 0.43, y + size * 0.08, size * 0.14, size * 0.22, accent, 2)}`;
}

function sidebar(active = 0) {
  const nav = Array.from({ length: 6 }, (_, index) => {
    const y = 108 + index * 62;
    const selected = index === active;
    return `${selected ? rect(18, y - 25, 194, 44, c.pink, 'none', 8) : ''}
      <circle cx="43" cy="${y - 3}" r="8" fill="${selected ? c.coralStrong : c.muted}" opacity="${selected ? 1 : 0.72}"/>
      ${bar(68, y - 9, 76 + (index % 3) * 18, 12, selected ? c.coral : c.line, 6)}`;
  }).join('');

  return `<rect width="230" height="838" fill="${c.canvas}"/>
  <line x1="230" y1="0" x2="230" y2="838" stroke="${c.line}"/>
  <circle cx="43" cy="42" r="24" fill="${c.coral}"/>
  <circle cx="43" cy="42" r="10" fill="${c.white}"/>
  ${bar(78, 32, 76, 20, c.coral, 8)}
  ${nav}
  <line x1="20" y1="496" x2="210" y2="496" stroke="${c.line}"/>
  ${rect(20, 526, 190, 90, c.white, c.line, 10)}
  ${iconTile(34, 541, c.blue, c.blueStrong, 30)}
  ${bar(76, 542, 68, 9, c.muted)}
  ${bar(76, 560, 112, 8, c.ink, 4, 0.75)}
  ${bar(76, 578, 88, 7, c.line)}
  ${dot(48, 782, 18, c.pink)}
  ${bar(78, 767, 92, 10, c.ink, 5, 0.75)}
  ${bar(78, 787, 116, 8, c.line)}`;
}

function topbar() {
  return `<rect x="230" width="1210" height="76" fill="${c.white}"/>
  <line x1="230" y1="76" x2="1440" y2="76" stroke="${c.line}"/>
  ${bar(266, 22, 160, 14, c.ink, 7, 0.78)}
  ${bar(266, 47, 226, 8, c.line)}
  ${rect(1274, 18, 122, 40, c.pink, 'none', 9)}
  ${dot(1300, 38, 6, c.coralStrong)}
  ${bar(1316, 33, 54, 9, c.coral, 5)}`;
}

function cardHeader(x, y, width, accent = c.coralStrong) {
  return `${iconTile(x + 20, y + 18, c.pink, accent, 32)}
  ${bar(x + 66, y + 24, Math.min(170, width * 0.38), 12, c.coral, 6)}
  ${bar(x + width - 82, y + 26, 50, 8, c.line, 4)}`;
}

function courseRow(x, y, width, height, courseIndex = 0, compact = false) {
  const [fill, accent] = courses[courseIndex % courses.length];
  return `${rect(x, y, width, height, fill, 'none', 8)}
  <rect x="${x}" y="${y}" width="5" height="${height}" rx="2.5" fill="${accent}"/>
  ${bar(x + 20, y + (compact ? 12 : 14), width * 0.34, compact ? 7 : 9, c.ink, 4, 0.68)}
  ${bar(x + 20, y + (compact ? 26 : 32), width * 0.24, compact ? 5 : 7, accent, 3, 0.8)}
  ${bar(x + width - width * 0.18 - 16, y + height / 2 - 4, width * 0.18, 8, accent, 4, 0.78)}`;
}

function emptyState(x, y, width, height) {
  const cx = x + width / 2;
  const cy = y + height / 2 - 12;
  return `${rect(x, y, width, height, c.mint, '#d8ece3', 10)}
  <circle cx="${cx}" cy="${cy}" r="28" fill="${c.white}"/>
  ${check(cx - 9, cy - 5, 1.1)}
  ${bar(cx - 64, cy + 47, 128, 10, c.ink, 5, 0.68)}
  ${bar(cx - 44, cy + 68, 88, 7, c.green, 4, 0.7)}`;
}

function dashboardContent() {
  const cards = [
    [256, 100, 554, 322, 0],
    [830, 100, 554, 322, 1],
    [256, 442, 554, 322, 2],
    [830, 442, 554, 322, 3],
  ];

  return cards.map(([x, y, width, height], cardIndex) => {
    const insideX = x + 20;
    const insideY = y + 72;
    const insideW = width - 40;
    return `${rect(x, y, width, height, c.white, c.coral, 12)}
      ${cardHeader(x, y, width)}
      ${cardIndex === 2
        ? emptyState(insideX, insideY, insideW, 224)
        : [0, 1, 2].slice(0, cardIndex === 1 ? 2 : 3).map((_, rowIndex) =>
          courseRow(insideX, insideY + rowIndex * 70, insideW, 56, cardIndex + rowIndex),
        ).join('')}`;
  }).join('');
}

function desktopDashboard() {
  return `<rect width="1440" height="838" fill="${c.canvas}"/>
  ${sidebar(0)}
  ${topbar()}
  ${dashboardContent()}`;
}

function mobileCard(x, y, width, height, startCourse = 0, rows = 2) {
  return `${rect(x, y, width, height, c.white, c.line, 12)}
  ${iconTile(x + 14, y + 14, c.pink, c.coralStrong, 28)}
  ${bar(x + 54, y + 21, width * 0.38, 10, c.coral, 5)}
  ${bar(x + width - 62, y + 22, 40, 7, c.coralStrong, 4, 0.65)}
  ${Array.from({ length: rows }, (_, index) =>
    courseRow(x + 14, y + 54 + index * 51, width - 28, 41, startCourse + index, true),
  ).join('')}`;
}

function mobileDashboard() {
  const stats = courses.slice(0, 4).map(([fill, accent], index) => {
    const x = 18 + index * 89;
    return `${rect(x, 76, 80, 84, fill, 'none', 10)}
      ${dot(x + 18, 97, 7, accent)}
      ${bar(x + 13, 121, 25 + index * 4, 12, c.ink, 5, 0.72)}
      ${bar(x + 13, 143, 42, 6, accent, 3, 0.72)}`;
  }).join('');

  return `<rect width="390" height="844" fill="${c.canvas}"/>
  ${bar(20, 22, 178, 16, c.ink, 8, 0.8)}
  ${bar(20, 50, 126, 8, c.line)}
  ${dot(350, 31, 16, c.pink)}
  ${stats}
  ${mobileCard(18, 176, 354, 166, 0, 2)}
  ${mobileCard(18, 354, 354, 166, 2, 2)}
  ${mobileCard(18, 532, 354, 220, 3, 3)}
  <rect x="0" y="772" width="390" height="72" fill="${c.white}"/>
  <line x1="0" y1="772" x2="390" y2="772" stroke="${c.line}"/>
  ${Array.from({ length: 5 }, (_, index) => {
    const x = 39 + index * 78;
    return index === 2
      ? `<circle cx="${x}" cy="803" r="25" fill="${c.coral}"/>
        <path d="M${x - 9} 803h18M${x} 794v18" stroke="${c.white}" stroke-width="3" stroke-linecap="round"/>`
      : `${dot(x, 798, 8, index === 0 ? c.coralStrong : c.muted)}
        ${bar(x - 17, 820, 34, 5, index === 0 ? c.coral : c.line, 3)}`;
  }).join('')}`;
}

function calendarContent() {
  const eventPositions = [
    [1, 1, 0], [3, 1, 2], [5, 2, 1], [0, 3, 4], [4, 3, 3], [2, 4, 0], [6, 4, 2],
  ];
  return `${rect(256, 100, 1128, 664, c.white, c.line, 12)}
  ${bar(286, 130, 136, 18, c.ink, 9, 0.75)}
  ${bar(1190, 130, 158, 18, c.pink, 9)}
  ${Array.from({ length: 7 }, (_, index) => {
    const x = 290 + index * 150;
    return `${dot(x + 66, 188, 6, [c.coralStrong, c.yellowStrong, c.green, c.blueStrong, c.purpleStrong][index % 5])}
      ${bar(x + 40, 204, 52, 6, c.line, 3)}`;
  }).join('')}
  ${Array.from({ length: 5 }, (_, row) => Array.from({ length: 7 }, (_, col) => {
    const x = 278 + col * 150;
    const y = 226 + row * 99;
    return `${rect(x, y, 142, 91, c.white, c.line, 6)}
      ${dot(x + 16, y + 16, 5, c.line)}`;
  }).join('')).join('')}
  ${eventPositions.map(([col, row, courseIndex]) => {
    const x = 288 + col * 150;
    const y = 260 + row * 99;
    const [fill, accent] = courses[courseIndex];
    return `${rect(x, y, 122, 28, fill, 'none', 5)}
      <rect x="${x}" y="${y}" width="4" height="28" rx="2" fill="${accent}"/>
      ${bar(x + 13, y + 10, 66 + (col % 3) * 12, 7, accent, 4, 0.78)}`;
  }).join('')}`;
}

function scheduleContent() {
  const blocks = [
    [0, 0, 2, 2], [2, 1, 2, 1], [1, 3, 2, 0], [3, 4, 2, 3], [4, 2, 2, 4],
  ];
  return `${rect(256, 100, 1128, 664, c.white, c.line, 12)}
  ${bar(286, 130, 220, 18, c.ink, 9, 0.75)}
  ${Array.from({ length: 5 }, (_, index) => {
    const x = 378 + index * 190;
    return `${dot(x + 76, 190, 7, courses[index][1])}
      ${bar(x + 43, 207, 66, 6, c.line, 3)}`;
  }).join('')}
  ${Array.from({ length: 6 }, (_, row) => {
    const y = 244 + row * 84;
    return `${bar(286, y - 4, 38, 7, c.line, 4)}
      <line x1="350" y1="${y}" x2="1350" y2="${y}" stroke="${c.line}"/>`;
  }).join('')}
  ${Array.from({ length: 6 }, (_, index) => `<line x1="${350 + index * 190}" y1="222" x2="${350 + index * 190}" y2="730" stroke="${c.line}"/>`).join('')}
  ${blocks.map(([day, slot, span, courseIndex]) => {
    const x = 364 + day * 190;
    const y = 232 + slot * 84;
    const [fill, accent] = courses[courseIndex];
    return `${rect(x, y, 162, 70 * span, fill, 'none', 8)}
      <rect x="${x}" y="${y}" width="5" height="${70 * span}" rx="2.5" fill="${accent}"/>
      ${bar(x + 17, y + 20, 98, 10, c.ink, 5, 0.65)}
      ${bar(x + 17, y + 42, 70, 7, accent, 4, 0.75)}
      ${bar(x + 17, y + 63, 118, 6, c.white, 3, 0.8)}`;
  }).join('')}`;
}

function homeworkContent() {
  const summaries = courses.slice(0, 3).map(([fill, accent], index) => {
    const x = 256 + index * 376;
    return `${rect(x, 100, 348, 104, fill, 'none', 12)}
      ${dot(x + 30, 132, 9, accent)}
      ${bar(x + 54, 126, 112, 10, accent, 5, 0.78)}
      ${bar(x + 24, 165, 48 + index * 14, 18, c.ink, 8, 0.7)}`;
  }).join('');
  const rows = Array.from({ length: 5 }, (_, index) => {
    const y = 306 + index * 85;
    const [fill, accent] = courses[index];
    return `<circle cx="292" cy="${y + 24}" r="13" fill="${c.white}" stroke="${accent}" stroke-width="2"/>
      ${bar(326, y + 8, 210 + index * 18, 11, c.ink, 6, 0.7)}
      ${bar(326, y + 33, 146, 7, accent, 4, 0.75)}
      ${rect(1164, y + 4, 166, 42, fill, 'none', 7)}
      ${bar(1192, y + 21, 110, 8, accent, 4, 0.8)}
      <line x1="278" y1="${y + 66}" x2="1350" y2="${y + 66}" stroke="${c.line}"/>`;
  }).join('');
  return `${summaries}
  ${rect(256, 224, 1128, 540, c.white, c.line, 12)}
  ${bar(286, 254, 144, 16, c.ink, 8, 0.72)}
  ${rect(1150, 244, 200, 40, c.canvas, c.line, 8)}
  ${dot(1172, 264, 6, c.muted)}
  ${bar(1190, 260, 112, 8, c.line, 4)}
  ${rows}`;
}

function notesContent() {
  const noteCards = courses.slice(0, 5).map(([fill, accent], index) => {
    const y = 230 + index * 100;
    return `${rect(276, y, 306, 82, fill, 'none', 8)}
      ${bar(296, y + 18, 150 + index * 12, 10, c.ink, 5, 0.68)}
      ${bar(296, y + 42, 108, 7, accent, 4, 0.8)}
      ${dot(550, y + 41, 6, accent)}`;
  }).join('');
  return `${rect(256, 100, 346, 664, c.white, c.line, 12)}
  ${bar(286, 132, 146, 16, c.ink, 8, 0.72)}
  ${rect(286, 168, 286, 42, c.canvas, c.line, 8)}
  ${dot(308, 189, 6, c.muted)}
  ${bar(326, 185, 116, 8, c.line, 4)}
  ${noteCards}
  ${rect(622, 100, 762, 664, c.white, c.line, 12)}
  ${bar(656, 136, 240, 18, c.ink, 9, 0.75)}
  ${bar(656, 170, 176, 8, c.line, 4)}
  <line x1="656" y1="204" x2="1350" y2="204" stroke="${c.line}"/>
  ${rect(656, 230, 660, 72, c.mint, 'none', 8)}
  ${dot(682, 256, 8, c.green)}
  ${bar(704, 248, 158, 10, c.ink, 5, 0.65)}
  ${bar(704, 272, 392, 7, c.green, 4, 0.62)}
  ${[340, 378, 416, 478, 516, 578].map((y, index) => bar(656, y, [620, 548, 660, 586, 510, 408][index], 12, index === 3 ? c.coral : c.line, 6, index === 3 ? 0.62 : 1)).join('')}
  ${rect(656, 640, 184, 46, c.pink, 'none', 8)}
  ${dot(682, 663, 7, c.coralStrong)}
  ${bar(702, 659, 110, 8, c.coral, 4)}`;
}

function appScene(title, description, active, content) {
  return svg(title, description, '0 0 1440 838', `<rect width="1440" height="838" fill="${c.canvas}"/>
  ${sidebar(active)}
  ${topbar()}
  ${content}`);
}

const desktopDevice = svg(
  'Abstract UMS dashboard on a MacBook',
  'A text-free vector representation of the UMS dashboard inside a coral laptop frame.',
  '0 0 1600 960',
  `<defs>
    <clipPath id="desktop-screen"><rect width="1440" height="838" rx="12"/></clipPath>
    <linearGradient id="base" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${c.white}"/><stop offset="1" stop-color="${c.line}"/></linearGradient>
  </defs>
  <rect x="48" y="12" width="1504" height="884" rx="34" fill="${c.coral}" stroke="${c.coralShade}" stroke-width="5"/>
  <g clip-path="url(#desktop-screen)" transform="translate(80 38)">${desktopDashboard()}</g>
  <circle cx="800" cy="25" r="5" fill="${c.coralStrong}"/>
  <path d="M32 892H1568Q1584 892 1576 908L1558 936Q1554 942 1544 942H56Q46 942 42 936L24 908Q16 892 32 892Z" fill="url(#base)" stroke="${c.coral}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M640 892H960Q948 916 912 916H688Q652 916 640 892Z" fill="${c.coral}"/>`,
);

const mobileDevice = svg(
  'Abstract UMS dashboard on an iPhone',
  'A text-free vector representation of the UMS mobile dashboard inside a coral phone frame.',
  '0 0 430 930',
  `<defs><clipPath id="phone-screen"><rect width="390" height="844" rx="48"/></clipPath></defs>
  <rect x="4" y="4" width="422" height="922" rx="68" fill="${c.coral}" stroke="${c.coralShade}" stroke-width="4"/>
  <rect x="14" y="38" width="402" height="862" rx="54" fill="${c.canvas}"/>
  <g clip-path="url(#phone-screen)" transform="translate(20 46)">${mobileDashboard()}</g>
  <rect x="165" y="15" width="100" height="22" rx="11" fill="${c.coralStrong}"/>
  <circle cx="250" cy="26" r="4" fill="${c.coralShade}"/>
  <rect x="1" y="185" width="8" height="72" rx="4" fill="${c.coralShade}"/>
  <rect x="421" y="236" width="8" height="112" rx="4" fill="${c.coralShade}"/>`,
);

const assets = {
  'ums-app-dashboard-desktop.svg': desktopDevice,
  'ums-app-dashboard-mobile.svg': mobileDevice,
  'ums-abstract-dashboard.svg': svg(
    'Abstract UMS dashboard',
    'A text-free representation of the dashboard layout and course color coding.',
    '0 0 1440 838',
    desktopDashboard(),
  ),
  'ums-abstract-calendar.svg': appScene(
    'Abstract UMS calendar',
    'A text-free monthly calendar using course color coding.',
    1,
    calendarContent(),
  ),
  'ums-abstract-schedule.svg': appScene(
    'Abstract UMS class schedule',
    'A text-free weekly schedule with color-coded course blocks.',
    2,
    scheduleContent(),
  ),
  'ums-abstract-homework.svg': appScene(
    'Abstract UMS homework tracker',
    'A text-free assignment tracker using color-coded course rows.',
    3,
    homeworkContent(),
  ),
  'ums-abstract-notes.svg': appScene(
    'Abstract UMS notes workspace',
    'A text-free course notes layout using color-coded note cards.',
    4,
    notesContent(),
  ),
};

Object.entries(assets).forEach(([filename, contents]) => {
  fs.writeFileSync(path.join(imageDir, filename), contents);
});

console.log(`Generated ${Object.keys(assets).length} text-free UMS SVG mockups.`);
