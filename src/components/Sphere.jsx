import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { TextureLoader, Vector3, CatmullRomCurve3, BufferGeometry, LineBasicMaterial, Line } from 'three';
import vertexShader from '../shaders/vertexShader.glsl';
import fragmentShader from '../shaders/fragmentShader.glsl';

const convertLatLonToXYZ = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

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
  let animationProgress = useRef(0);

  const uniforms = useMemo(
    () => ({
      globeTexture: { value: texture },
      uOpacity: { value: 0.6 },
    }),
    [texture]
  );

  useFrame(() => {
    if (!dragging) {
      sphereRef.current.rotation.y += rotationSpeed;
    }
    sphereRef.current.rotation.x += rotation.x * 0.03;
    sphereRef.current.rotation.y += rotation.y * 0.03;
    
    animationProgress.current += 0.01;
    if (animationProgress.current > 1) animationProgress.current = 0;
  });

  const locations = [
    { lat: 40.7128, lon: -74.006 }, // New York
    { lat: 51.5074, lon: -0.1278 }, // London
    { lat: 35.6895, lon: 139.6917 }, // Tokyo
    { lat: 48.8566, lon: 2.3522 }, // Paris
    { lat: 20.5937, lon: 78.9629}
  ];

  const points = locations.map(({ lat, lon }) => convertLatLonToXYZ(lat, lon, 1));

  const connections = [
    [points[0], points[1]],
    [points[2], points[3]],
  ];

  return (
    <>
      <mesh
        ref={sphereRef}
        scale={[scale, scale, scale]}
        position={[positionX, 0, 0]}
        onPointerDown={(event) => {
          setDragging(true);
          setLastMousePos({ x: event.clientX, y: event.clientY });
          window.addEventListener('mousemove', handlePointerMove);
          window.addEventListener('mouseup', handlePointerUp);
        }}
        onPointerMove={(event) => {
          const deltaX = (event.clientX - size.width / 2) / size.width;
          const deltaY = (event.clientY - size.height / 2) / size.height;
          setRotation({ x: deltaY, y: deltaX });
        }}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
        />

        {points.map((pos, index) => (
          <mesh key={index} position={pos}>
            <sphereGeometry args={[0.005, 8, 8]} />
            <meshBasicMaterial color="red" />
          </mesh>
        ))}

        {/* {connections.map((connection, index) => {
          const curve = new CatmullRomCurve3([connection[0], new Vector3(0, 0, 0), connection[1]], false);
          const points = curve.getPoints(50);
          const geometry = new BufferGeometry().setFromPoints(points);

          return (
            <line key={index} geometry={geometry}>
              <lineBasicMaterial attach="material" color="#3eacb0" linewidth={2} />
            </line>
          );
        })} */}
      </mesh>
    </>
  );
};

export default Sphere;
