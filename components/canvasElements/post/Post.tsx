import React from "react";
import {
  EffectComposer,
  Bloom,
  HueSaturation,
  BrightnessContrast,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useControls } from "leva";

export default function Post() {
  const options = useControls("post", {
    hue: { min: -6, max: 6, value: 0, step: 0.1 },
    saturation: { min: -1, max: 1, value: 0, step: 0.05 },
    brightness: { min: -1, max: 1, value: 0, step: 0.05 },
    contrast: { min: -1, max: 1, value: 0, step: 0.05 },
  });
  return (
    <EffectComposer stencilBuffer>
      {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}
      <HueSaturation
        blendFunction={BlendFunction.NORMAL} // blend mode
        hue={options.hue} // hue in radians
        saturation={options.saturation} // saturation in radians
      />
      <BrightnessContrast
        brightness={options.brightness} // brightness. min: -1, max: 1
        contrast={options.contrast} // contrast: min -1, max: 1
      />
      <Noise
        premultiply // enables or disables noise premultiplication
        blendFunction={BlendFunction.SCREEN} // blend mode
      />
    </EffectComposer>
  );
}
