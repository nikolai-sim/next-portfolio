import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
    Object_3: THREE.Mesh;
  };
  materials: {
    pegolo_edited_model: THREE.MeshStandardMaterial;
  };
};

export default function Jordans({ ...props }: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF(
    "/glb/airJordan/scene.gltf"
  ) as GLTFResult;

  const { mouse, viewport, gl } = useThree();

  useFrame(() => {
    if (group.current) {
      // console.log("shoe");
      group.current.rotateY(-0.01);
    }
  });

  const material = new THREE.PointsMaterial({
    color: "white",
    size: 0.002,
  });
  const meshOne = new THREE.Points(nodes.Object_2.geometry, material);
  const meshTwo = new THREE.Points(nodes.Object_3.geometry, material);
  return (
    <group {...props} dispose={null} scale={0.005} position={[0, 0, 0]}>
      <group rotation={[3.14, 0, 0]} ref={group}>
        {/* <mesh
          geometry={nodes.Object_2.geometry}
          material={materials.pegolo_edited_model}
        />
        <mesh
          geometry={nodes.Object_3.geometry}
          material={materials.pegolo_edited_model}
        /> */}
        <primitive object={meshOne} />
        <primitive object={meshTwo} />
      </group>
      <pointLight position={[-1110, 10, 10]} power={1800} color="beige" />
    </group>
  );
}

useGLTF.preload("/scene.gltf");
