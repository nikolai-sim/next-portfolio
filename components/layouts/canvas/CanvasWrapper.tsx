import React, { Ref, RefObject, useRef } from "react";
import { Canvas, RootState, useFrame } from "@react-three/fiber";
import ErrorBoundary from "../../singleComponents/ErrorBoundary/ErrorBoundary";
import useStore from "../../singleComponents/Hooks/useStore";
import ExampleScene from "../../Home/ExampleScene";

function getMousePos(e: React.MouseEvent<Element, MouseEvent>) {
  return { x: e.clientX, y: e.clientY };
}

export default function CanvasWrapper(props: {
  fwdRef: RefObject<HTMLDivElement | null>;
}) {
  const GPUTier = useStore((state) => state.GPUTier);
  const mouse = useRef({ x: 0, y: 0 });

  const onCanvasCreated = (state: RootState) => {
    state.gl.physicallyCorrectLights = true;
    if (state.events.connect) {
      state.events.connect(props.fwdRef.current);
    }
  };

  return (
    <div className="canvas_wrapper">
      <ErrorBoundary fallback={<h1>Error</h1>}>
        <Canvas
          onMouseMove={(e) => (mouse.current = getMousePos(e))}
          onCreated={(state) => {
            onCanvasCreated(state);
          }}
        >
          <ExampleScene />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
