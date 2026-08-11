const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, '..', 'assets', 'img');

const c = {
  coral: '#f8ad9d',
  coralStrong: '#f08080',
  coralShade: '#f4978e',
  ink: '#56494c',
  text: '#2f2f2f',
  muted: '#5a5a5a',
  line: '#e8e8e8',
  canvas: '#f7f7f7',
  white: '#ffffff',
  mint: '#cfe8da',
  green: '#9ecbb0',
  blue: '#c9d8f3',
  blueStrong: '#9fb6e6',
  yellow: '#f8e7af',
  yellowStrong: '#e0c874',
  teal: '#bfe6e1',
  tealStrong: '#7fc5bd',
  pink: '#f5cddd',
  pinkStrong: '#dc9ab8',
  purple: '#ded2f4',
  purpleStrong: '#b8a2df',
  red: '#f7c7c7',
  redStrong: '#df8d8d',
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
    return `${rect(14, y - 27, 202, 46, selected ? c.pink : '#fbe9e5', 'none', 8, `opacity="${selected ? 0.92 : 0.54}"`)}
      <g transform="translate(32 ${y - 14})" fill="none" stroke="${c.coralStrong}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="${selected ? 1 : 0.8}">
        <rect x="0" y="0" width="20" height="20" rx="5"/>
        <path d="M5 10h10M10 5v10" opacity="${index === 0 ? 1 : 0.48}"/>
      </g>
      ${bar(68, y - 10, 80 + (index % 3) * 16, 12, c.coralStrong, 6, selected ? 1 : 0.78)}`;
  }).join('');

  return `<rect width="230" height="838" fill="${c.canvas}"/>
  <line x1="229" y1="0" x2="229" y2="838" stroke="${c.line}" stroke-width="2"/>
  <circle cx="43" cy="42" r="24" fill="${c.coral}"/>
  <circle cx="43" cy="42" r="10" fill="${c.white}"/>
  ${bar(78, 32, 64, 20, c.coral, 8)}
  ${nav}
  <line x1="20" y1="496" x2="210" y2="496" stroke="${c.line}"/>
  ${rect(20, 526, 190, 90, c.white, c.coral, 10, 'stroke-width="2"')}
  ${iconTile(34, 541, c.blue, c.blueStrong, 30)}
  ${bar(76, 542, 68, 9, c.coralStrong)}
  ${bar(76, 560, 112, 8, c.ink, 4, 0.82)}
  ${bar(76, 578, 88, 7, c.muted, 4, 0.45)}
  ${dot(48, 782, 18, c.pink)}
  ${bar(78, 767, 92, 10, c.ink, 5, 0.82)}
  ${bar(78, 787, 116, 8, c.muted, 4, 0.38)}`;
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
  const studyX = 256;
  const studyY = 24;
  const studyW = 1128;
  const studyH = 276;

  const taskGroups = [
    [284, 112, 650, 72, 1],
    [284, 194, 650, 72, 2],
  ].map(([x, y, width, height, courseIndex]) => {
    const [fill, accent] = courses[courseIndex];
    return `${rect(x, y, width, height, c.white, accent, 8)}
      <rect x="${x}" y="${y}" width="${width}" height="28" rx="7" fill="${fill}"/>
      ${bar(x + 14, y + 9, 116, 10, c.ink, 5, 0.82)}
      ${bar(x + width - 122, y + 10, 98, 8, accent, 4, 0.92)}
      <circle cx="${x + 24}" cy="${y + 50}" r="11" fill="${c.white}" stroke="${accent}" stroke-width="2"/>
      ${check(x + 18, y + 45, .62, accent)}
      ${bar(x + 48, y + 44, width * .42, 10, c.ink, 5, .76)}
      ${bar(x + width - 92, y + 46, 64, 7, accent, 4, .8)}`;
  }).join('');

  const examRows = [
    [974, 118, 378, 62, 3],
    [974, 190, 378, 62, 0],
  ].map(([x, y, width, height, courseIndex], index) => {
    const [fill, accent] = courses[courseIndex];
    return `${rect(x, y, width, height, fill, accent, 8)}
      <rect x="${x}" y="${y}" width="5" height="${height}" rx="2.5" fill="${accent}"/>
      ${bar(x + 20, y + 14, 132 + index * 22, 10, c.ink, 5, .78)}
      ${bar(x + 20, y + 36, 82, 7, accent, 4, .9)}
      ${bar(x + width - 62, y + 24, 36, 12, accent, 6, .86)}`;
  }).join('');

  const widgets = [
    [256, 320, 554, 238, 0, 3],
    [830, 320, 554, 238, 2, 2],
    [256, 578, 554, 236, 4, 2],
    [830, 578, 554, 236, 1, 3],
  ].map(([x, y, width, height, startCourse, rows], widgetIndex) => `${rect(x, y, width, height, c.white, c.coral, 10, 'stroke-width="2"')}
    <circle cx="${x + 38}" cy="${y + 34}" r="17" fill="${c.pink}"/>
    <path d="M${x + 30} ${y + 34}h16M${x + 38} ${y + 26}v16" fill="none" stroke="${c.coralStrong}" stroke-width="3" stroke-linecap="round" opacity="${widgetIndex === 1 ? .45 : 1}"/>
    ${bar(x + 68, y + 27, 166 - widgetIndex * 8, 13, c.coralStrong, 7)}
    ${bar(x + width - 72, y + 29, 42, 8, c.coral, 4)}
    ${Array.from({ length: rows }, (_, rowIndex) =>
      courseRow(x + 20, y + 68 + rowIndex * 52, width - 40, 42, startCourse + rowIndex, true),
    ).join('')}
    ${rows === 2 ? rect(x + 20, y + 178, width - 40, 38, c.canvas, c.line, 8) : ''}
    ${rows === 2 ? bar(x + width / 2 - 38, y + 193, 76, 7, c.muted, 4, .46) : ''}`).join('');

  return `${rect(studyX, studyY, studyW, studyH, c.white, c.coral, 10, 'stroke-width="2"')}
    <circle cx="292" cy="64" r="20" fill="${c.pink}"/>
    <path d="M284 64h16M292 56v16" fill="none" stroke="${c.coralStrong}" stroke-width="3" stroke-linecap="round"/>
    ${bar(326, 54, 156, 16, c.coralStrong, 8)}
    ${rect(1264, 48, 82, 30, c.pink, 'none', 7)}
    ${bar(1283, 59, 44, 8, c.coralStrong, 4)}
    ${bar(284, 91, 118, 9, c.coralStrong, 5)}
    ${bar(974, 91, 132, 9, c.coralStrong, 5)}
    <line x1="952" y1="100" x2="952" y2="272" stroke="${c.line}" stroke-width="2"/>
    ${taskGroups}
    ${examRows}
    ${widgets}`;
}

function desktopDashboard() {
  return `<rect width="1440" height="838" fill="${c.canvas}"/>
  ${sidebar(0)}
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
  <g transform="translate(0 -58)">${content}</g>`);
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
  'UMS-Dashboard.svg': svg(
    'Current UMS dashboard',
    'A refined representation of the current UMS dashboard with Study Focus, grouped tasks, upcoming exams, and four course widgets.',
    '0 0 1440 838',
    desktopDashboard(),
  ),
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
  fs.writeFileSync(path.join(imageDir, filename), contents.replace(/[ \t]+$/gm, ''));
});

console.log(`Generated ${Object.keys(assets).length} text-free UMS SVG mockups.`);
