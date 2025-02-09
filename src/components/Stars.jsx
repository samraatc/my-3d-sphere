import React from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import { random } from 'maath';

export default function Stars() {
  // Increase the radius of the sphere to make the stars cover a larger area
  const [positions] = React.useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 50 }) // Increased radius to 50
  );

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial transparent color="white" size={0.01} />
    </Points>
  );
}
