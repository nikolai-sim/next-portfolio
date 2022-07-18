import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { InstancedMesh, Object3D } from "three";
import { useTexture } from "@react-three/drei";
// import { useControls } from "leva";

export default function Fog(props: {
  position?: [number, number, number];
  opacity?: number;
}) {
  const tempObject = useMemo(() => new Object3D(), []);
  const ref = useRef<InstancedMesh | null>(null);
  const texture = useTexture("/textures/smoke.png");

  // const options = useControls("fog", {
  //   opacity: { min: 0, max: 1, value: 0.4 },
  // });

  const particles = useMemo(() => {
    const cloudParticles = [];
    for (let p = 0; p < 50; p++) {
      const positionX = Math.random() * 800 - 400;
      const positionZ = Math.random() * 500 - 500;
      const rotationZ = Math.random() * 2 * Math.PI;

      cloudParticles.push({
        positionX,
        positionZ,
        rotationZ,
      });
    }
    return cloudParticles;
  }, []);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { positionX, positionZ, rotationZ } = particle;
      tempObject.position.set(positionX, 0, positionZ);
      tempObject.rotation.set(0, 0, rotationZ);
      tempObject.updateMatrix();
      if (ref.current) {
        ref.current.setMatrixAt(i, tempObject.matrix);
        ref.current.instanceMatrix.needsUpdate = true;
      }
    });
    particles.forEach((particle) => (particle.rotationZ -= 0.0007));
  });

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, 40]}
      scale={[0.04, 0.02, 0.05]}
      position={props.position ? props.position : [0, 0, 0]}
    >
      {/* @ts-ignore */}
      <planeBufferGeometry attach="geometry" args={[500, 500]} scale={0.08} />
      <meshLambertMaterial
        attach="material"
        map={texture}
        depthWrite={false}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
}
