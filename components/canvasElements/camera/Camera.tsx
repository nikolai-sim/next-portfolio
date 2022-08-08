/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { useEffect, useRef, MutableRefObject } from "react";
import { useGLTF, PerspectiveCamera, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { AnimeTimelineInstance } from "animejs";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh;
  };
  materials: {
    FloorBaked: THREE.MeshBasicMaterial;
  };
};

type ActionName = "CameraAction.002";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export function Camera(props: {
  axes: AnimeTimelineInstance | MutableRefObject<Object | undefined>;
}) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(
    "/glb/gallery/camera.glb"
  ) as GLTFResult;
  //   @ts-ignore
  const { actions } = useAnimations<GLTFActions>(animations, group);

  useEffect(() => {
    //   @ts-ignore
    actions["CameraAction.002"].play().paused = true;
  }, [actions]);

  useFrame(() => {
    //   @ts-ignore
    actions["CameraAction.002"].time =
      //   @ts-ignore
      actions["CameraAction.002"].getClip().duration *
      //   @ts-ignore
      props.axes.current.camAxes;
  });
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <PerspectiveCamera
          name="Camera"
          makeDefault={true}
          far={1000}
          near={0.1}
          fov={53.7}
          position={[5.67, 0.86, 0.01]}
          rotation={[2.42, 1.54, -2.41]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/glb/gallery/camera.glb");
