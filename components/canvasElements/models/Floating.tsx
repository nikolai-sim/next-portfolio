/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { useRef, useEffect, MutableRefObject } from "react";
import {
  useGLTF,
  PerspectiveCamera,
  useAnimations,
  Plane,
  Float,
} from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { AnimeTimelineInstance } from "animejs";
import { useControls } from "leva";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
    Object_3: THREE.Mesh;
    BREAD_Mat_0: THREE.Mesh;
    CHEESE_Mat3_0: THREE.Mesh;
    CHEESE_2_Mat1_0: THREE.Mesh;
    PEPPERONI_Mat2_0: THREE.Mesh;
    PEPPERONI_2_Mat2_0: THREE.Mesh;
    PEPPERONI_3_Mat2_0: THREE.Mesh;
    Sphere: THREE.Mesh;
    Plane: THREE.Mesh;
  };
  materials: {
    pegolo_edited_model: THREE.MeshStandardMaterial;
    material: THREE.MeshStandardMaterial;
    ["Mat.3"]: THREE.MeshStandardMaterial;
    ["Mat.1"]: THREE.MeshStandardMaterial;
    ["Mat.2"]: THREE.MeshStandardMaterial;
  };
};

type ActionName = "CameraAction";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export function Floating(props: {
  axes: AnimeTimelineInstance | MutableRefObject<Object | undefined>;
}) {
  const group = useRef<THREE.Group>(null);
  const shoeRef = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(
    "/glb/floating.glb"
  ) as GLTFResult;

  const options = useControls({
    crust: "#905c00",
  });

  // @ts-ignore
  const { actions } = useAnimations<GLTFActions>(animations, group);

  console.log(actions);

  useEffect(() => {
    //   @ts-ignore
    actions["CameraAction"].play().paused = true;
  }, [actions]);

  useFrame(() => {
    if (shoeRef.current) {
      //   shoeRef.current.rotateY();
    }
    //   @ts-ignore
    actions["CameraAction"].time =
      //   @ts-ignore
      actions["CameraAction"].getClip().duration *
      //   @ts-ignore
      props.axes.current.camAxes;
  });

  const material = new THREE.PointsMaterial();

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <Float speed={2}>
          <group
            name="Sketchfab_model"
            position={[-0.67, 5.77, 2.66]}
            rotation={[3.14, 0, 0]}
            scale={0.01}
            ref={shoeRef}
          >
            <group name="pegolo_edited_modelobjcleanermaterialmergergles">
              <mesh
                name="Object_2"
                geometry={nodes.Object_2.geometry}
                // material={materials.pegolo_edited_model}
                position={[17.59, -87.3, 60.81]}
                scale={[0.66, 1, 1]}
              />
              <mesh
                name="Object_3"
                geometry={nodes.Object_3.geometry}
                // material={materials.pegolo_edited_model}
                position={[17.59, -87.3, 60.81]}
                scale={[0.66, 1, 1]}
              />
            </group>
          </group>
        </Float>
        <group
          name="Sketchfab_model001"
          position={[3.16, 0.94, -1.87]}
          rotation={[-Math.PI / 2, 0, 2.96]}
          scale={[0.03, 0.03, 0.02]}
        >
          <group
            name="f9ab19da34b44b20a5f4d4f0c10ce874fbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="RootNode">
              <group name="BREAD" position={[4.74, -8.31, 1.4]}>
                <mesh
                  name="BREAD_Mat_0"
                  geometry={nodes.BREAD_Mat_0.geometry}
                  material={materials.material}
                >
                  <meshStandardMaterial color={options.crust} />
                </mesh>
              </group>
              <group name="CHEESE" position={[4.76, 16.96, 36.16]}>
                <mesh
                  name="CHEESE_Mat3_0"
                  geometry={nodes.CHEESE_Mat3_0.geometry}
                  material={materials["Mat.3"]}
                >
                  <meshStandardMaterial color={"yellow"} />
                </mesh>
              </group>
              <group name="CHEESE_2" position={[4.54, -12.23, -11.57]}>
                <mesh
                  name="CHEESE_2_Mat1_0"
                  geometry={nodes.CHEESE_2_Mat1_0.geometry}
                  material={materials["Mat.1"]}
                >
                  <meshStandardMaterial color={"yellow"} />
                </mesh>
              </group>
              <group name="PEPPERONI" position={[-18.11, 13.96, 11.39]}>
                <mesh
                  name="PEPPERONI_Mat2_0"
                  geometry={nodes.PEPPERONI_Mat2_0.geometry}
                  material={materials["Mat.2"]}
                >
                  <meshStandardMaterial color={"brown"} />
                </mesh>
              </group>
              <group name="PEPPERONI_2" position={[18.11, 3.49, -11.64]}>
                <mesh
                  name="PEPPERONI_2_Mat2_0"
                  geometry={nodes.PEPPERONI_2_Mat2_0.geometry}
                  material={materials["Mat.2"]}
                >
                  <meshStandardMaterial color={"brown"} />
                </mesh>
              </group>
              <group name="PEPPERONI_3" position={[-3.98, -16.96, -36.16]}>
                <mesh
                  name="PEPPERONI_3_Mat2_0"
                  geometry={nodes.PEPPERONI_3_Mat2_0.geometry}
                  material={materials["Mat.2"]}
                >
                  <meshStandardMaterial color={"brown"} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
        <PerspectiveCamera
          name="Camera"
          makeDefault={true}
          far={100}
          near={0.1}
          fov={22.9}
          position={[7.72, 8.08, 2.76]}
          rotation={[1.85, 1.03, -1.89]}
        >
          <pointLight intensity={100} />
        </PerspectiveCamera>
        <mesh
          name="Sphere"
          geometry={nodes.Sphere.geometry}
          material={nodes.Sphere.material}
          position={[5.81, 8.82, -6.44]}
        />
        <mesh
          name="Plane"
          geometry={nodes.Plane.geometry}
          material={nodes.Plane.material}
          position={[14.78, 1.63, -5.81]}
          rotation={[0, -1.57, -1.6]}
          scale={[1.53, 1, 1.14]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/glb/floating.glb");
