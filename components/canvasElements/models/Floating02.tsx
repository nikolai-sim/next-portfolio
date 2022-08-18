/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { useGLTF, PerspectiveCamera, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { AnimeTimelineInstance } from "animejs";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
    Object_3: THREE.Mesh;
    BREAD_Mat_0: THREE.Mesh;
    CHEESE_Mat3_0: THREE.Mesh;
    CHEESE_2_Mat1_0: THREE.Mesh;
    PEPPERONI_Mat2_0: THREE.Mesh;
    PEPPERONI_2_Mat2_0: THREE.Mesh;
    PEPPERONI_3_Mat2_0: THREE.Mesh;
    Kae_Body_Low: THREE.SkinnedMesh;
    Object_19: THREE.Mesh;
    Plane: THREE.Mesh;
    spine: THREE.Bone;
  };
  materials: {
    pegolo_edited_model: THREE.MeshStandardMaterial;
    material: THREE.MeshStandardMaterial;
    ["Mat.3"]: THREE.MeshStandardMaterial;
    ["Mat.1"]: THREE.MeshStandardMaterial;
    ["Mat.2"]: THREE.MeshStandardMaterial;
    kae: THREE.MeshStandardMaterial;
    lambert2SG: THREE.MeshStandardMaterial;
  };
};

type ActionName = "CameraAction";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export function FloatingTwo(props: {
  axes: AnimeTimelineInstance | MutableRefObject<Object | undefined>;
}) {
  const group = useRef<THREE.Group>(null);
  const kaeRef = useRef(null);
  const { nodes, materials, animations } = useGLTF(
    "/glb/floating02.glb"
  ) as GLTFResult;
  //   @ts-ignore
  const { actions } = useAnimations<GLTFActions>(animations, group);

  const pixieMaterial = new THREE.ShaderMaterial({
    uniforms: {
      positions: { value: null },
      uTime: { value: 0.0 },
      uFocus: { value: 5.1 },
      uFov: { value: 50.0 },
      uBlur: { value: 30.0 },
      uSize: { value: 10.0 },
      uColor: { value: new THREE.Color("#ffd200") },
      alphaMap: { value: null },
    },
    vertexShader: `
    #pragma glslify: map = require(glsl-map/index.glsl)
  uniform sampler2D positions;
  uniform float uTime;
  uniform float uFocus;
  uniform float uFov;
  uniform float uBlur;
  uniform float uSize;
  varying vec4 vPos;
  varying float vSize;
  void main() { 
    vec4 pos = texture2D(positions, position.xy).xyzw;
    vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    //vPos = abs(uFocus - -mvPosition.z) ;
    vPos = pos;
    
    float fSize = uSize * pos.w;   
    fSize = (fSize / -mvPosition.z);
    vSize = (uSize / -mvPosition.z);
    gl_PointSize = fSize;
  }
    `,
    fragmentShader: `
    #pragma glslify: map = require(glsl-map/index.glsl)
  uniform sampler2D alphaMap;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec4 vPos;
  varying float vSize;
  void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float gradient = map(vSize, 0.0, 50.0, 0.0, 1.0);
    gradient = clamp(gradient, 0.0, 1.0);
    vec2 uv = ( vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
    //if (dot(cxy, cxy) > 1.0) discard;
    float alpha = texture2D( alphaMap, uv ).g;
    if ( alpha < 0.001 ) discard;
    gl_FragColor = vec4(uColor, (alpha * (1.0 - vPos.w /2.0 )) * gradient);
  }
    `,
  });

  useEffect(() => {
    //   @ts-ignore
    actions["CameraAction"].play().paused = true;
  }, [actions]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    //   @ts-ignore
    actions["CameraAction"].time =
      //   @ts-ignore
      actions["CameraAction"].getClip().duration *
      //   @ts-ignore
      props.axes.current.camAxes;
  });

  const material = new THREE.PointsMaterial({
    color: "white",
    size: 0.012,
  });

  const materialTwo = new THREE.PointsMaterial({
    color: "white",
    size: 0.05,
  });

  const materialThree = new THREE.PointsMaterial({
    color: "white",
    size: 0.02,
  });

  const jordansOne = new THREE.Points(nodes.Object_2.geometry, material);
  const jordansTwo = new THREE.Points(nodes.Object_3.geometry, material);

  const kae = new THREE.Points(nodes.Kae_Body_Low.geometry, materialThree);
  const laptop = new THREE.Points(nodes.Object_19.geometry, material);

  const p1 = new THREE.Points(nodes.BREAD_Mat_0.geometry, materialTwo);
  const p2 = new THREE.Points(nodes.PEPPERONI_Mat2_0.geometry, materialTwo);
  const p3 = new THREE.Points(nodes.PEPPERONI_2_Mat2_0.geometry, materialTwo);
  const p4 = new THREE.Points(nodes.PEPPERONI_3_Mat2_0.geometry, materialTwo);
  const p5 = new THREE.Points(nodes.CHEESE_Mat3_0.geometry, materialTwo);
  const p6 = new THREE.Points(nodes.CHEESE_2_Mat1_0.geometry, materialTwo);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="Sketchfab_model"
          position={[-0.67, 5.77, 2.66]}
          rotation={[3.14, 0, 0]}
          scale={0.01}
        >
          <group
            name="pegolo_edited_modelobjcleanermaterialmergergles"
            position={[130, -50, 0]}
          >
            <primitive object={jordansOne} />
            <primitive object={jordansTwo} />
          </group>
        </group>
        <group
          name="Sketchfab_model001"
          position={[3.16, 0.94, -1.87]}
          rotation={[-Math.PI / 2, 0, 2.96]}
          scale={[0.03, 0.03, 0.02]}
        >
          <group
            name="f9ab19da34b44b20a5f4d4f0c10ce874fbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="RootNode">
              <group name="BREAD" position={[4.74, -8.31, 1.4]}>
                <primitive object={p1} />
              </group>
              <group name="CHEESE" position={[4.76, 16.96, 36.16]}>
                <primitive object={p5} />
              </group>
              <group name="CHEESE_2" position={[4.54, -12.23, -11.57]}>
                <primitive object={p6} />
              </group>
              <group name="PEPPERONI" position={[-18.11, 13.96, 11.39]}>
                <primitive object={p2} />
              </group>
              <group name="PEPPERONI_2" position={[18.11, 3.49, -11.64]}>
                <primitive object={p3} />
              </group>
              <group name="PEPPERONI_3" position={[-3.98, -16.96, -36.16]}>
                <primitive object={p4} />
              </group>
            </group>
          </group>
        </group>
        <group>
          <primitive object={kae} ref={kaeRef} />
        </group>

        <group name="Sketchfab_model003" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="LAPTOPobjcleanermaterialmergergles" />
        </group>
        <group name="Sketchfab_model002" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="lapobjcleanermaterialmergergles">
            <primitive
              object={laptop}
              position={[0.81, -2.54, 11.24]}
              rotation={[-0.01, 0.63, 1.33]}
              scale={[0.47, 0.91, 0.53]}
            />
          </group>
        </group>
        <PerspectiveCamera
          name="Camera"
          makeDefault={true}
          far={100}
          near={0.1}
          fov={22.9}
          position={[7.72, 8.08, 2.76]}
          rotation={[1.85, 1.03, -1.89]}
        >
          <pointLight intensity={100} />
        </PerspectiveCamera>
        <mesh
          name="Plane"
          geometry={nodes.Plane.geometry}
          material={nodes.Plane.material}
          position={[14.78, 1.63, -5.81]}
          rotation={[0, -1.57, -1.6]}
          scale={[1.53, 1, 1.14]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/glb/floating02.glb");
