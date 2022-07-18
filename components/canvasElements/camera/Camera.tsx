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
      ref.current.position.z = props.axes.current.camZ;
    }
  });
  console.log(ref.current);
  return <PerspectiveCamera makeDefault ref={ref} position={[0, 0, 0]} />;
}
