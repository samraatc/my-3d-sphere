import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import vertexShader from '../shaders/vertexShader.glsl';
import fragmentShader from '../shaders/fragmentShader.glsl';

// Functional component for the Sphere
const Sphere = () => {
  // Reference to the sphere mesh
  const sphereRef = useRef();
  
  // Loading the texture image for the sphere
  const texture = useLoader(TextureLoader, '/earth.png');

  // State for tracking whether the sphere is being dragged
  const [dragging, setDragging] = useState(false);

  // State for storing the last mouse position when dragging
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Rotation speed of the sphere when not being dragged
  const rotationSpeed = 0.01;

  // useFrame hook is used to update the sphere's rotation on each frame
  useFrame(() => {
    // Rotate the sphere if it is not being dragged
    if (!dragging) {
      sphereRef.current.rotation.y += rotationSpeed;
    }
  });

  // Function to handle mouse down (start dragging)
  const handlePointerDown = (event) => {
    setDragging(true); // Set dragging state to true
    setLastMousePos({ x: event.clientX, y: event.clientY }); // Store the current mouse position
  };

  // Function to handle mouse move (while dragging)
  const handlePointerMove = (event) => {
    if (dragging) {
      // Calculate the difference in mouse position since the last movement
      const deltaX = event.clientX - lastMousePos.x;
      const deltaY = event.clientY - lastMousePos.y;

      // Update the sphere's rotation based on the mouse movement
      sphereRef.current.rotation.y += deltaX * 0.01;
      sphereRef.current.rotation.x += deltaY * 0.01;

      // Update the last mouse position to the current one
      setLastMousePos({ x: event.clientX, y: event.clientY });
    }
  };

  // Function to handle mouse up (stop dragging)
  const handlePointerUp = () => {
    setDragging(false); // Set dragging state to false when the mouse is released
  };

  return (
    <mesh
      ref={sphereRef} // Reference to the mesh for direct manipulation
      scale={[7, 7, 7]} // Scale the sphere 7 times its original size in all axes
      onPointerDown={handlePointerDown} // Trigger when the mouse button is pressed
      onPointerMove={handlePointerMove} // Trigger when the mouse is moving
      onPointerUp={handlePointerUp} // Trigger when the mouse button is released
      onPointerOut={handlePointerUp} // Ensure drag stops when pointer leaves the sphere
    >
      <sphereGeometry args={[1, 64, 64]} /> {/* Create a sphere geometry with a radius of 1 and 64 segments */}
      
      {/* Shader material with a custom vertex and fragment shader */}
      <shaderMaterial
        uniforms={{ globeTexture: { value: texture } }} // Pass the texture as a uniform to the shader
        vertexShader={vertexShader} // Use the custom vertex shader
        fragmentShader={fragmentShader} // Use the custom fragment shader
      />
    </mesh>
  );
};

export default Sphere; // Export the Sphere component for use in other parts of the app
