import React from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import { random } from 'maath';

export default function Stars() {
  // Generate stars in a much larger radius to fill the background
  const [positions] = React.useState(() =>
    random.inSphere(new Float32Array(20000), { radius: 200 }) // Expanded radius
  );

  return (
    <Points positions={positions} stride={3}>
      {/* White small stars for full background effect */}
      <PointMaterial transparent color="white" size={0.02} />
    </Points>
  );
}
