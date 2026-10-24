import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const publicDir = path.resolve('public');
const srcDir = path.resolve('src');
const outDir = path.resolve('out');

[publicDir, srcDir, outDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const videoSources = [
  { name: 'v1.mp4', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { name: 'v2.mp4', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
  { name: 'v3.mp4', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
  { name: 'v4.mp4', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4' },
];

async function main() {
  console.log('1/3 -> Bulut Sunucusu Videoları İndiriyor...');
  for (let i = 0; i < videoSources.length; i++) {
    const item = videoSources[i];
    const target = path.join(publicDir, item.name);
    const res = await fetch(item.url);
    const buf = await res.arrayBuffer();
    fs.writeFileSync(target, Buffer.from(buf));
    console.log(`✓ İndirildi: ${item.name}`);
  }

  console.log('2/3 -> Türkçe Seslendirme Oluşturuluyor...');
  const text = encodeURIComponent("1907'de Kadıköy sahilinde doğan bu asil sevda, Milli Mücadele'de bağımsızlık ateşine dönüştü. Lefter'den Can Bartu'ya, Kadıköy Mabedi'nde yazılan şanlı tarih... Sonsuza dek Fenerbahçe!");
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${text}&tl=tr&client=tw-ob`;
  
  try {
    const res = await fetch(ttsUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(path.join(publicDir, 'ses.mp3'), Buffer.from(buffer));
    console.log('✓ Ses hazır.');
  } catch (e) {
    console.log('Ses atlandı.');
  }

  console.log('3/3 -> ffmpeg ile Montaj ve Render Yapılıyor...');
  const listFile = path.join(publicDir, 'list.txt');
  let listContent = '';

  for (let i = 1; i <= 4; i++) {
    const inV = path.join(publicDir, `v${i}.mp4`);
    const outPart = path.join(publicDir, `part_${i}.mp4`);
    execSync(`ffmpeg -y -i "${inV}" -t 5 -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" -c:v libx264 -pix_fmt yuv420p -an "${outPart}"`, { stdio: 'inherit' });
    listContent += `file '${outPart}'\n`;
  }
  fs.writeFileSync(listFile, listContent);

  const finalOutput = path.join(outDir, 'fenerbahce_video.mp4');
  const sesPath = path.join(publicDir, 'ses.mp3');
  
  execSync(`ffmpeg -y -f concat -safe 0 -i "${listFile}" -i "${sesPath}" -c:v copy -c:a aac -shortest "${finalOutput}"`, { stdio: 'inherit' });
  console.log('>>> BULUTTA RENDER TAMAMLANDI: ' + finalOutput);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});