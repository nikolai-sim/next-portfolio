import React, { useRef } from "react";
import {
  Float,
  Circle,
  MeshReflectorMaterial,
  Icosahedron,
  Mask,
  useMask,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useStore from "../singleComponents/Hooks/useStore";
import { useTimeline } from "../singleComponents/Hooks/useTimeLine";
import RobotModel from "../canvasElements/blenderImports/RobotExpressive";
import Kae from "../canvasElements/blenderImports/Kae_v07";
import Moon from "../canvasElements/blenderImports/Amphibians_monn_v2";
import { useControls } from "leva";

function MaskedContent() {
  const stencil = useMask(1, false);
  return (
    <group>
      <Circle
        args={[12.75, 36, 36]}
        rotation-x={-Math.PI / 2}
        position={[1, -2.1, 0]}
      >
        <MeshReflectorMaterial
          resolution={1024}
          blur={[400, 50]}
          mirror={2}
          mixBlur={0.75}
          mixStrength={10}
          transparent
          opacity={0.5}
          color="#555"
          metalness={4}
          roughness={1}
          {...stencil}
        />
      </Circle>
      <Float floatIntensity={3}>
        <Icosahedron args={[1.5]} castShadow={true} position={[-6, 0, -3]}>
          <MeshReflectorMaterial
            resolution={1024}
            blur={[400, 50]}
            mirror={0}
            mixBlur={0.75}
            mixStrength={10}
            transparent
            opacity={1}
            color="beige"
            metalness={2}
            roughness={1}
            // {...stencil}
          />
        </Icosahedron>
      </Float>
      <Float floatIntensity={3}>
        <Icosahedron args={[1.5]} castShadow={true} position={[6, 0, -3]}>
          <MeshReflectorMaterial
            resolution={1024}
            blur={[400, 50]}
            mirror={0}
            mixBlur={0.75}
            mixStrength={10}
            transparent
            opacity={1}
            color="beige"
            metalness={2}
            roughness={1}
            // {...stencil}
          />
        </Icosahedron>
      </Float>
      <Circle position={[0, 0, -100]} scale={1000}>
        <MeshReflectorMaterial
          resolution={1024}
          blur={[400, 50]}
          mirror={0}
          mixBlur={0.75}
          mixStrength={10}
          transparent
          opacity={1}
          color="beige"
          metalness={1}
          roughness={1}
          {...stencil}
        />
      </Circle>
    </group>
  );
}

export default function ExampleScene() {
  let meshRef = useRef<THREE.Mesh>();
  const { viewport, mouse } = useThree();

  //Importing global scroll function
  const scroll = useStore((state) => state.scroll);

  const GPUTier = useStore((state) => state.GPUTier);

  //Keyframes for scroll based animations
  const keyframes = {
    rotation: [
      { time: 0, val: 0 },
      { time: 500, val: -100, easing: "easeInSine" },
      { time: 1000, val: 100, easing: "easeInSine" },
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
    // if (meshRef.current !== undefined) {
    //   meshRef.current.rotateY((mouse.x * viewport.width) / 1500);
    //   meshRef.current.rotateZ((mouse.y * viewport.height) / 1500);
    // }

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

  const options = useControls({
    stencilSize: { min: 0, max: 15, value: 9 },
    kae: false,
    robot: true,
    moon: false,
  });
  return (
    <>
      {/* <Circle
        args={[12.75, 36, 36]}
        rotation-x={-Math.PI / 2}
        position={[1, -1.7, 0]}
      >
        <MeshReflectorMaterial
          resolution={1024}
          blur={[400, 50]}
          mirror={2}
          mixBlur={0.75}
          mixStrength={10}
          transparent
          opacity={0.5}
          color="#555"
          metalness={4}
          roughness={1}
        />
      </Circle> */}

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
      <Mask id={1} colorWrite={false} depthWrite={false}>
        {(spread) => (
          <>
            <planeGeometry
              args={[options.stencilSize, options.stencilSize, 128, 128]}
            >
              <meshStandardMaterial {...spread} />
            </planeGeometry>
          </>
        )}
      </Mask>
      <MaskedContent />
      {options.robot && <RobotModel />}
      {options.kae && <Kae />}
      {options.moon && <Moon />}
      <pointLight position={[10, 10, 10]} power={800} />
    </>
  );
}
