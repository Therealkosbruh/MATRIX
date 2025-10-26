import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

interface Model3DProps {
  modelPath: string;
}

export default function Model3D({ modelPath }: Model3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useLoader(STLLoader, modelPath);
  React.useEffect(() => {
    if (geometry) {
      geometry.center();
      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox;
      if (boundingBox) {
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        geometry.scale(scale, scale, scale);
      }
    }
  }, [geometry]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <mesh 
    ref={meshRef} 
    geometry={geometry} 
    castShadow 
    receiveShadow
    rotation={[-Math.PI / 2, 0, 0]} 
  >
    <meshStandardMaterial
      color="#c0c0c0"
      metalness={0.6}
      roughness={0.3}
    />
  </mesh>
  );
}