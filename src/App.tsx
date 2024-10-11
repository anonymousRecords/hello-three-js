import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/fish.glb');
  const [rotation, setRotation] = useState([0, -Math.PI / 2, 0]);
  const [position, setPosition] = useState([0, 0, 0]);

  useFrame(() => {
    const scrollY = window.scrollY;
    setRotation([
      Math.sin(scrollY * 0.002) * 0.1,
      Math.PI / 2 + Math.sin(scrollY * 0.001) * 0.1,
      Math.cos(scrollY * 0.002) * 0.1,
    ]);
    setPosition([Math.sin(scrollY * 0.001) * 0.5, Math.cos(scrollY * 0.002) * 0.5, 0]);
  });

  return <primitive object={scene} rotation={rotation} position={position} />;
}

interface ScrollTextProps {
  text: string;
  index: number;
}

function ScrollText({ text, index }: ScrollTextProps) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const showPosition = 1000 * (index + 1);
      if (scrollPosition > showPosition) {
        setOpacity(Math.min((scrollPosition - showPosition) / 500, 1));
      } else {
        setOpacity(0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [index]);

  return (
    <div
      style={{
        position: 'fixed',
        left: '15%',
        top: `${30 + index * 5}%`,
        transform: 'translateX(-50%)',
        fontSize: '24px',
        color: 'black',
        textAlign: 'left',
        opacity: opacity,
        transition: 'opacity 0.5s',
      }}
    >
      {text}
    </div>
  );
}

function Scene() {
  const texts = [
    '저는 구피를 키웁니다.',
    '그런데 구피가 계속 죽어서 슬퍼요.',
    '구피가 안 죽고 오래 살았으면 좋겠어요.',
  ];

  return (
    <>
      <div style={{ height: '5000px' }} />
      <Canvas style={{ width: '100vw', height: '100vh', position: 'fixed', left: 0, top: 0 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      {texts.map((text, index) => (
        <ScrollText key={index} text={text} index={index} />
      ))}
    </>
  );
}

export default Scene;
