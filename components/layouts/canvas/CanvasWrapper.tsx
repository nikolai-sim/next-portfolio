import React, {
  Dispatch,
  Ref,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { Canvas, RootState, useFrame } from "@react-three/fiber";
import ErrorBoundary from "../../singleComponents/ErrorBoundary/ErrorBoundary";
import useStore from "../../singleComponents/Hooks/useStore";
import ExampleScene from "../../Home/ExampleScene";
import { motion, useAnimationControls } from "framer-motion";

function getMousePos(e: React.MouseEvent<Element, MouseEvent>) {
  return { x: e.clientX, y: e.clientY };
}

export default function CanvasWrapper(props: {
  fwdRef: RefObject<HTMLDivElement | null>;
  canvasLoaded: boolean;
  setCanvasLoaded: Dispatch<SetStateAction<boolean>>;
}) {
  const GPUTier = useStore((state) => state.GPUTier);
  const mouse = useRef({ x: 0, y: 0 });
  const controls = useAnimationControls();

  const onCanvasCreated = (state: RootState) => {
    state.gl.physicallyCorrectLights = true;
    if (state.events.connect) {
      state.events.connect(props.fwdRef.current);
    }
    props.setCanvasLoaded(true);
  };

  useEffect(() => {
    if (props.canvasLoaded) {
      controls.start({ opacity: 1, transition: { duration: 3 } });
    }
  });
  return (
    <motion.div
      className="canvas_wrapper"
      initial={{ opacity: 0 }}
      animate={controls}
    >
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
    </motion.div>
  );
}
