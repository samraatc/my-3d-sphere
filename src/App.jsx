import React from 'react';
import { Canvas } from '@react-three/fiber';
import Sphere from './components/Sphere';
import Stars from './components/Stars';
import './App.css';

export default function App() {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 15] }} gl={{ antialias: true }}>
        {/* Lights for better visibility */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />

        {/* 3D Objects */}
        <Sphere />
        <Stars />
      </Canvas>
    </div>
  );
}
