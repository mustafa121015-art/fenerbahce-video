import { AbsoluteFill, OffthreadVideo, Sequence, Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import React from 'react';

const scenes = [
  { video: 'video1.mp4', badge: '1907 • KADIKÖY', title: 'BİR EFSANENİN DOĞUŞU', desc: 'Moda sahilinde yakılan ilk meşale, milyonların sönmeyen sevdası oldu.' },
  { video: 'video2.mp4', badge: 'MİLLİ MÜCADELE', title: 'HARINGTON KUPASI', desc: 'İşgal altındaki İstanbul\'a umut, cepheye güç veren şanlı zafer.' },
  { video: 'video3.mp4', badge: 'KADIKÖY MABEDİ', title: 'ŞÜKRÜ SARACOĞLU RUHU', desc: 'Lefter\'den Can Bartu\'ya nesiller boyu süren sarı-lacivert asalet.' },
  { video: 'video4.mp4', badge: 'SONSUZ TUTKU', title: 'FENERBAHÇE YIKILMAZ', desc: 'Dünden yarına, sarı-lacivert aşkla daima yanında!' },
];

export const MyComp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#001A3A' }}>
      <Audio src={staticFile('ses.mp3')} />
      {scenes.map((s, i) => (
        <Sequence key={i} from={i * 150} durationInFrames={150}>
          <AbsoluteFill>
            <OffthreadVideo
              src={staticFile(s.video)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <AbsoluteFill
              style={{
                background: 'linear-gradient(to top, rgba(0, 26, 58, 0.9) 10%, rgba(0, 26, 58, 0.35) 55%, rgba(0,0,0,0.15) 100%)',
              }}
            />
            <SceneText badge={s.badge} title={s.title} desc={s.desc} />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const SceneText: React.FC<{ badge: string; title: string; desc: string }> = ({ badge, title, desc }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 135, 150], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 85, textAlign: 'center', color: '#fff', fontFamily: 'Segoe UI, sans-serif', opacity }}>
      <span style={{ backgroundColor: '#FFED00', color: '#001A3A', padding: '6px 22px', borderRadius: 25, fontSize: 22, fontWeight: 900, marginBottom: 14 }}>
        {badge}
      </span>
      <h1 style={{ fontSize: 58, fontWeight: 900, margin: '0 0 12px 0', textShadow: '0 4px 15px rgba(0,0,0,0.9)' }}>
        {title}
      </h1>
      <p style={{ fontSize: 26, maxWidth: 950, margin: 0, color: '#F0F0F0', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
        {desc}
      </p>
    </AbsoluteFill>
  );
};
