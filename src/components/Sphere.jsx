import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import vertexShader from '../shaders/vertexShader.glsl';
import fragmentShader from '../shaders/fragmentShader.glsl';

const Sphere = () => {
  const sphereRef = useRef();
  const texture = useLoader(TextureLoader, '/earth.png');

  const { size, camera } = useThree();
  camera.position.set(0, 0, 5);

  const scaleFactor = Math.min(size.width * 0.08, 2);
  const scale = Math.max(scaleFactor, 2);
  const positionX = (size.width / 200) * 0.2;

  const [dragging, setDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const rotationSpeed = 0.005;

  const uniforms = useMemo(
    () => ({
      globeTexture: { value: texture },
      uOpacity: { value: 0.5 },
    }),
    [texture]
  );

  useFrame(() => {
    if (!dragging) {
      sphereRef.current.rotation.y += rotationSpeed;
    }
    sphereRef.current.rotation.x += rotation.x * 0.03;
    sphereRef.current.rotation.y += rotation.y * 0.03;
  });

  const handleMouseMove = (event) => {
    const deltaX = (event.clientX - size.width / 2) / size.width;
    const deltaY = (event.clientY - size.height / 2) / size.height;
    setRotation({ x: deltaY, y: deltaX });
  };

  const handlePointerDown = (event) => {
    setDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
  };

  const handlePointerMove = (event) => {
    if (dragging) {
      const deltaX = (event.clientX - lastMousePos.x) * 0.01;
      const deltaY = (event.clientY - lastMousePos.y) * 0.01;
      sphereRef.current.rotation.y += deltaX;
      sphereRef.current.rotation.x += deltaY;
      setLastMousePos({ x: event.clientX, y: event.clientY });
    }
  };

  const handlePointerUp = () => {
    setDragging(false);
    window.removeEventListener('mousemove', handlePointerMove);
    window.removeEventListener('mouseup', handlePointerUp);
  };

  return (
    <mesh
      ref={sphereRef}
      scale={[scale, scale, scale]}
      position={[positionX, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handleMouseMove}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
      />
    </mesh>
  );
};

export default Sphere;
