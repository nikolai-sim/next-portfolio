import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { AnimeTimelineInstance } from "animejs";

export default function Camera(props: {
  axes:
    | anime.AnimeTimelineInstance
    | React.MutableRefObject<Object | undefined>;
}) {
  const ref = useRef<typeof PerspectiveCamera>(null);
  useFrame(() => {
    if (ref.current) {
      //@ts-ignore
      const cam = props.axes.current;
      //@ts-ignore
      ref.current.position.x = cam.camX;
      //@ts-ignore
      ref.current.position.y = cam.camY;
      //@ts-ignore
      ref.current.position.z = cam.camZ;
      //@ts-ignore
      ref.current.rotation.x = cam.rotX;
      //@ts-ignore
      ref.current.rotation.y = cam.rotY;
      //@ts-ignore
      ref.current.rotation.z = cam.rotZ;
    }
  });
  console.log(ref.current);
  return <PerspectiveCamera makeDefault ref={ref} position={[0, 0, 0]} />;
}
