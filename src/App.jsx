import React from 'react';
import { Canvas } from '@react-three/fiber';
import Sphere from './components/Sphere';
import Stars from './components/Stars';
import './App.css';

export default function App() {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 9] }} gl={{ antialias: true }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />

        {/* Stars should be in the background */}
        <Stars />

        {/* Sphere should be in front */}
        <Sphere />
      </Canvas>
    </div>
  );
}
