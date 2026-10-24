import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// İnternetten aranacak hazır video hedefleri
const searchQueries = [
  { fileName: 'video1.mp4', query: 'ytsearch1:istanbul 1900s vintage film archive' },
  { fileName: 'video2.mp4', query: 'ytsearch1:retro football match 1920s archive' },
  { fileName: 'video3.mp4', query: 'ytsearch1:sukru saracoglu stadium atmosphere ultra 4k' },
  { fileName: 'video4.mp4', query: 'ytsearch1:golden football trophy cinematic presentation' },
];

console.log('--- Videolar İnternetten Otomatik Aranıyor ve İndiriliyor ---');

for (let i = 0; i < searchQueries.length; i++) {
  const item = searchQueries[i];
  const outPath = path.join(publicDir, item.fileName);
  console.log(`[${i + 1}/${searchQueries.length}] Bulunuyor: ${item.query}...`);

  try {
    // İlk bulduğu uygun videonun ilk 5 saniyesini indirir
    const cmd = `npx yt-dlp-wrap "${item.query}" -f "mp4[height<=720]" --download-sections "*0-5" --force-overwrites -o "${outPath}"`;
    execSync(cmd, { stdio: 'ignore' });
    console.log(`✓ İndirildi: public/${item.fileName}`);
  } catch (e) {
    console.log(`! Video indirilirken alternatif arandı: ${item.fileName}`);
  }
}

console.log('\n--- Tüm Videolar İndirildi! Remotion Render Başlatılıyor ---');
execSync('npx remotion render MyComp out/fenerbahce_otomatik.mp4', { stdio: 'inherit' });
console.log('\n Harika! Nihai video hazır: out/fenerbahce_otomatik.mp4');