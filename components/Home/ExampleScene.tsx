import React, { useRef } from "react";
import {
  Float,
  Circle,
  MeshReflectorMaterial,
  Icosahedron,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useStore from "../singleComponents/Hooks/useStore";
import { useTimeline } from "../singleComponents/Hooks/useTimeLine";
import Fog from "../canvasElements/fog/Fog";
import Camera from "../canvasElements/camera/Camera";
import { PointLight } from "three";

export default function ExampleScene() {
  let meshRef = useRef<THREE.Mesh>();
  const pointRef = useRef<PointLight>(null);
  const { viewport, mouse } = useThree();

  //Importing global scroll function
  const scroll = useStore((state) => state.scroll);

  const GPUTier = useStore((state) => state.GPUTier);

  //Keyframes for scroll based animations
  const keyframes = {
    camZ: [
      { time: 0, val: 0, easing: "easeInSine" },
      { time: 500, val: -28, easing: "easeInSine" },
      { time: 1000, val: -56, easing: "easeInSine" },
    ],
    fogOpacity: [
      { time: 0, val: 0.01, easing: "easeInSine" },
      { time: 1000, val: 1, easing: "easeInSine" },
    ],
  };

  const remapKeyframes = {
    frame: [
      { time: 0, val: 0 },
      { time: 1000, val: 1000, easing: "linear" },
    ],
  };

  const [timeline, axes] = useTimeline(keyframes);
  const [timeRemap, timeAxe] = useTimeline(remapKeyframes);

  useFrame(() => {
    if (meshRef.current !== undefined) {
      meshRef.current.rotateY((mouse.x * viewport.width) / 1500);
      meshRef.current.rotateZ((mouse.y * viewport.height) / 1500);
    }
    if (pointRef.current !== null) {
      //@ts-ignore
      pointRef.current.position.z = axes.current.camZ - 10;
    }

    // scrubbing through the keyframes using the interpolated scroll value
    if (scroll?.animation.changed) {
      const y = scroll.get()[0];
      // @ts-ignore
      timeRemap.seek(timeRemap.duration * y);
      // @ts-ignore
      timeline.seek(timeAxe.current.frame);
      // @ts-ignore
      // meshRef.current?.rotateY(axes.current.rotation / 1500);
    }
  });
  return (
    <>
      <Circle
        args={[1000, 36, 36]}
        rotation-x={-Math.PI / 2}
        position={[1, -10, -48]}
      >
        <MeshReflectorMaterial
          resolution={1024}
          blur={[400, 50]}
          mirror={2}
          mixBlur={0.75}
          mixStrength={10}
          transparent
          opacity={0.5}
          color="beige"
          metalness={4}
          roughness={1}
        />
      </Circle>
      <Fog axes={axes} />
      <Camera axes={axes} />

      {/* <Float floatIntensity={3}>
        <Icosahedron
          args={[1.5]}
          castShadow={true}
          ref={meshRef}
          onClick={() => {
            console.log(mouse);
          }}
        >
          <MeshReflectorMaterial
            resolution={1024}
            blur={[400, 50]}
            mirror={0}
            mixBlur={0.75}
            mixStrength={10}
            transparent
            opacity={1}
            color="orange"
            metalness={2}
            roughness={1}
          />
        </Icosahedron>
      </Float> */}

      <pointLight
        position={[10, 10, 10]}
        power={1800}
        color="beige"
        ref={pointRef}
      />
    </>
  );
}
