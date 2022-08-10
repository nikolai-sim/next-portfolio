import React, { useRef } from "react";
import {
  Float,
  Circle,
  MeshReflectorMaterial,
  Icosahedron,
  OrbitControls,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useStore from "../singleComponents/Hooks/useStore";
import { useTimeline } from "../singleComponents/Hooks/useTimeLine";
import Fog from "../canvasElements/fog/Fog";
import { PointLight } from "three";
import Jordans from "../canvasElements/models/Jordan";
import { Gallery } from "../canvasElements/models/Gallery";
import Post from "../canvasElements/post/Post";
import ShaderBg from "../canvasElements/shaderBg/ShaderBg";
import { Camera } from "../canvasElements/camera/Camera";
import { Floating } from "../canvasElements/models/Floating";
import { Boids } from "../canvasElements/boids/Boids";

export default function ExampleScene() {
  let meshRef = useRef<THREE.Mesh>();
  const pointRef = useRef<PointLight>(null);
  const { viewport, mouse } = useThree();

  //Importing global scroll function
  const scroll = useStore((state) => state.scroll);

  const GPUTier = useStore((state) => state.GPUTier);

  //Keyframes for scroll based animations
  const keyframes = {
    camAxes: [
      { time: 0, val: 0, easing: "easeInSine" },
      { time: 1000, val: 1, easing: "easeInSine" },
    ],
    fogOpacity: [
      { time: 0, val: 0.01, easing: "easeInSine" },
      { time: 1000, val: 1, easing: "easeInSine" },
    ],

    camPosition: [
      {
        time: 0,
        val: {
          position: { x: 3.52, y: 0.94, z: 0.32 },
          rotation: { x: 0.47, y: 1.52, z: -0.47 },
        },
      },

      {
        time: 1000,
        val: {
          position: { x: 0.11, y: 0.94, z: 0.32 },
          rotation: { x: 3.09, y: 0.01, z: -3.14 },
        },
      },
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

  useFrame(({ camera }) => {
    // console.log(camera.position, camera.rotation);
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
    }
  });
  return (
    <>
      {/* <Gallery /> */}
      <Floating axes={axes} />
      <Post />
      {/* <ambientLight intensity={100000} /> */}
      {/* <Camera axes={axes} /> */}
      <ShaderBg />
      {/* <Boids /> */}
      {/* <OrbitControls /> */}
      {/* <Fog axes={axes} /> */}

      {/* <Jordans /> */}
    </>
  );
}
