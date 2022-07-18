import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

export default function Camera() {
  const ref = useRef(null);
  useFrame(() => {});
  return <PerspectiveCamera makeDefault ref={ref} />;
}
