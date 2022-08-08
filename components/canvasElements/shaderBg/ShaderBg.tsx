import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

type GLTFResult = GLTF & {
  nodes: {
    mesh_Pond: THREE.Mesh;
  };
  materials: {
    mat_Pond: THREE.MeshStandardMaterial;
  };
};

export default function ShaderBg(props: { stencil?: object }) {
  const group = useRef<THREE.Group>(null);

  const pondRef = useRef<THREE.Mesh>(null);

  const options = useControls("water", {
    depthColor: "#a0b8c4",
    uBigWavesElevation: { min: 0, max: 0.2, value: 0.01, step: 0.005 },
    uBigWavesSpeed: { min: 0, max: 5, value: 0.5, step: 0.05 },
    uSmallWavesElevation: { value: 0.05, min: 0, max: 0.5, step: 0.0005 },
    uSmallWavesFrequency: { value: 0.26, min: 0, max: 5, step: 0.005 },
    uSmallWavesSpeed: { min: 0, max: 5, value: 0.2, step: 0.05 },
    uSmallIterations: { value: 4, min: 0, max: 5, step: 1 },
    uColorOffset: { value: 0.9, min: 0, max: 2 },
    uColorMultiplier: { value: 1.42, min: 0, max: 2 },
    uFreqX: { min: 0, max: 20, step: 0.005, value: 1.5 },
    uFreqY: { min: 0, max: 20, step: 0.005, value: 0 },
  });

  const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: `
    
      uniform float uTime;
      uniform float uBigWavesElevation;
      uniform vec2 uBigWavesFrequency;
      uniform float uBigWavesSpeed;
      uniform float uSmallWavesElevation;
      uniform float uSmallWavesFrequency;
      uniform float uSmallWavesSpeed;
      uniform float uSmallIterations;
      varying float vElevation;
      varying vec2 vUv;
      // Classic Perlin 3D Noise 
      // by Stefan Gustavson
      //
      vec4 permute(vec4 x)
      {
          return mod(((x*34.0)+1.0)*x, 289.0);
      }
      vec4 taylorInvSqrt(vec4 r)
      {
          return 1.79284291400159 - 0.85373472095314 * r;
      }
      vec3 fade(vec3 t)
      {
          return t*t*t*(t*(t*6.0-15.0)+10.0);
      }
      float cnoise(vec3 P)
      {
          vec3 Pi0 = floor(P); // Integer part for indexing
          vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
          Pi0 = mod(Pi0, 289.0);
          Pi1 = mod(Pi1, 289.0);
          vec3 Pf0 = fract(P); // Fractional part for interpolation
          vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;
          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);
          vec4 gx0 = ixy0 / 7.0;
          vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);
          vec4 gx1 = ixy1 / 7.0;
          vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);
          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;
          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);
          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
          return 2.2 * n_xyz;
      }
      void main()
      {
        vUv = uv;
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          // Elevation
          float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                            sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                            uBigWavesElevation;
          for(float i = 1.0; i <= uSmallIterations; i++)
          {
              elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
          }
          
          modelPosition.y += elevation;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;
          vElevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) * sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) ;
      }
    `,
    fragmentShader: `
      uniform vec3 uDepthColor;
      uniform float uColorOffset;
      uniform float uColorMultiplier;
      uniform float uTime;
      uniform vec3 diffuseColor;
      uniform vec2 pattern_scale;
      varying float vElevation;
      varying vec2 vUv;
      vec2 random2( vec2 p ) {
      return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
      }
    vec3 voronoi(vec2 st){
        // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    float m_dist = 1.;  // minimum distance
    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            // Neighbor place in the grid
            vec2 neighbor = vec2(float(x),float(y));
            // Random position from current + neighbor place in the grid
            vec2 point = random2(i_st + neighbor);
			// Animate the point
            point = 0.5 + 0.5*sin(uTime / 3.0 + 6.2831*point);
			// Vector between the pixel and the point
            vec2 diff = neighbor + point - f_st;
            // Distance to the point
            float dist = length(diff);
            // Keep the closer distance
            m_dist = min(m_dist, dist);
        }
    }
    // Draw the min distance (distance field)
    // This color is the cell color
    vec3 color =  vec3(0.0,0.0,0.0);
    color += m_dist;
    #ifdef SHOW_DOTS
    // Draw cell center
    color += 1.-step(.02, m_dist);
    #endif
    
    #ifdef SHOW_GRID
    // Draw grid
    color.r += step(.98, f_st.x) + step(.98, f_st.y);
    #endif
    
    #ifdef SHOW_ISOLINES
    // Show isolines
    color -= step(.7,abs(sin(27.0*m_dist)))*.5;
    #endif
    return color;
}
float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01), _radius+(_radius*0.01), dot(l,l)*4.0);
}
      void main()
      {
          float mixStrength = (vElevation /2.0 + uColorOffset) * uColorMultiplier;
          vec2 st = vUv.xy/pattern_scale;
          vec3 color = vec3(0.0);
          st *= 3.0;      // Scale up the space by 3
          st = fract(st); // Wrap around 1.0
          #ifdef PATTERN_RAMP
          color = vec3(st,0.0);
          #endif
          #ifdef PATTERN_CIRCLE
          color = vec3(circle(st,0.8));
          #endif
          #ifdef PATTERN_VORONOI
          color = voronoi(vUv.xy/pattern_scale * 3.0);
          #endif
          float pct = abs(sin(uTime / 2.0));
          vec3 voroColor = vec3(voronoi(vUv.xy/pattern_scale * 3.0)*diffuseColor);
          vec3 colorFinal = mix(uDepthColor, voroColor, mixStrength);
          
          gl_FragColor = vec4(colorFinal, 1.0);
      }
    `,
    uniforms: {
      uTime: { value: 0 },

      // uniforms for the vertex shader for the waves

      uBigWavesElevation: { value: options.uBigWavesElevation },
      uBigWavesFrequency: { value: new THREE.Vector2(1.5, 0.0) },
      uBigWavesSpeed: { value: options.uBigWavesSpeed },

      uSmallWavesElevation: { value: options.uSmallWavesElevation },
      uSmallWavesFrequency: { value: options.uSmallWavesFrequency },
      uSmallWavesSpeed: { value: options.uSmallWavesSpeed },
      uSmallIterations: { value: options.uSmallIterations },

      // color uniforms for the waves
      uDepthColor: { value: new THREE.Color("507DB8") },
      uColorOffset: { value: options.uColorOffset },
      uColorMultiplier: { value: options.uColorMultiplier },

      // Voronoi noise for the pond glow uniforms
      // Pattern scale is for the size of the cells
      pattern_scale: { value: new THREE.Vector2(0.1, 0.1) },
      diffuseColor: { value: new THREE.Color("grey") },
    },
    side: THREE.DoubleSide,
  });

  const plane = new THREE.SphereBufferGeometry(32, 32, 32);

  const shader = new THREE.Mesh(plane, waterMaterial);
  //   shader.position.set(-5, -0.08, -2);
  shader.rotation.set(3.9, 8, 3.5);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    waterMaterial.uniforms.uTime.value = t / 4;
  });

  useEffect(() => {
    waterMaterial.uniforms.uDepthColor.value = new THREE.Color(
      options.depthColor
    );

    waterMaterial.uniforms.uBigWavesFrequency.value = new THREE.Vector2(
      options.uFreqX,
      options.uFreqY
    );
  }, [options.depthColor, options.uFreqX, options.uFreqY]);

  return (
    <group ref={group} {...props} dispose={null}>
      {/* <mesh
        geometry={nodes.mesh_Pond.geometry}
        material={materials.mat_Pond}
        ref={pondRef}
      >
        <meshStandardMaterial {...materials.mat_Pond} {...props.stencil} />
      </mesh> */}

      <primitive object={shader} />
    </group>
  );
}
