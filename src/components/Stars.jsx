import React from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import { random } from 'maath';

export default function Stars() {
  // Generate random positions for the stars, spread over a large area
  const [positions] = React.useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 200 }) // Increased radius to 200
  );

  return (
    <group position={[0, 0, -50]}> {/* Move stars further back */}
      <Points positions={positions} stride={3}>
        <PointMaterial transparent color="white" size={0.3} depthWrite={false} />
      </Points>
    </group>
  );
}
