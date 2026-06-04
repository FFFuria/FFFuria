const fs = require('fs');

const readmePath = 'README.md';
const startMarker = '<!-- year-progress:start -->';
const endMarker = '<!-- year-progress:end -->';

const thisYear = new Date().getUTCFullYear();
const startTimeOfThisYear = new Date(`${thisYear}-01-01T00:00:00Z`).getTime();
const endTimeOfThisYear = new Date(`${thisYear}-12-31T23:59:59Z`).getTime();
const progressOfThisYear = (Date.now() - startTimeOfThisYear) / (endTimeOfThisYear - startTimeOfThisYear);

function generateProgressBar() {
  const progressBarCapacity = 30;
  const passedProgressBarIndex = Math.max(
    0,
    Math.min(progressBarCapacity, Math.floor(progressOfThisYear * progressBarCapacity))
  );

  return `{ ${'█'.repeat(passedProgressBarIndex)}${'░'.repeat(progressBarCapacity - passedProgressBarIndex)} }`;
}

const progressSection = `${startMarker}
⏳ Year progress: ${generateProgressBar()} ${(progressOfThisYear * 100).toFixed(2)}%

⏰ Updated on ${new Date().toUTCString()}
${endMarker}`;

const readme = fs.readFileSync(readmePath, 'utf8');
const progressPattern = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);

const nextReadme = progressPattern.test(readme)
  ? readme.replace(progressPattern, progressSection)
  : readme.replace(/^(.*\n)/, `$1\n${progressSection}\n\n`);

fs.writeFileSync(readmePath, nextReadme);
