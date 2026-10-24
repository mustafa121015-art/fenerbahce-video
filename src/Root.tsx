import { Composition } from 'remotion';
import { MyComp } from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComp}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
