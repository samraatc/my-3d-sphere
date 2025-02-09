import React from 'react';
import { Canvas } from '@react-three/fiber';
import Sphere from './components/Sphere';
import Stars from './components/Stars';
import './App.css';

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }} gl={{ antialias: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <Sphere />
      <Stars />
    </Canvas>
  );
}
