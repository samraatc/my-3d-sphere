import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import vertexShader from '../shaders/vertexShader.glsl';
import fragmentShader from '../shaders/fragmentShader.glsl';

const Sphere = () => {
  const sphereRef = useRef(); // Reference to the sphere object
  const texture = useLoader(TextureLoader, '/earth.png'); // Load texture for the globe

  // State to track dragging and last mouse position
  const [dragging, setDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const rotationSpeed = 0.005; // Auto-rotation speed when not dragging

  // Memoized uniforms to pass texture to shader material
  const uniforms = useMemo(() => ({
    globeTexture: { value: texture },
  }), [texture]);

  // Rotate the sphere automatically when not dragging
  useFrame(() => {
    if (!dragging) {
      sphereRef.current.rotation.y += rotationSpeed;
    }
  });

  // Handle mouse press (start dragging)
  const handlePointerDown = (event) => {
    setDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });

    // Add event listeners to track mouse movement and release
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
  };

  // Handle mouse movement to rotate the sphere
  const handlePointerMove = (event) => {
    if (dragging) {
      // Calculate the difference in mouse movement
      const deltaX = (event.clientX - lastMousePos.x) * 0.005; // Adjust for smooth rotation
      const deltaY = (event.clientY - lastMousePos.y) * 0.005;

      // Apply rotation to the sphere
      sphereRef.current.rotation.y += deltaX; // Rotate left/right
      sphereRef.current.rotation.x += deltaY; // Rotate up/down

      // Store the new mouse position
      setLastMousePos({ x: event.clientX, y: event.clientY });
    }
  };

  // Handle mouse release (stop dragging)
  const handlePointerUp = () => {
    setDragging(false);

    // Remove event listeners to prevent memory leaks
    window.removeEventListener("mousemove", handlePointerMove);
    window.removeEventListener("mouseup", handlePointerUp);
  };

  return (
    <mesh
      ref={sphereRef}
      scale={[8, 8, 8]} // Increased size for better visibility
      onPointerDown={handlePointerDown} // Attach pointer down event to start dragging
    >
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

export default Sphere;
