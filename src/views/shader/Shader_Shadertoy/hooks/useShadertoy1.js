import { onMounted } from "vue";

import * as THREE from "three";

import { ThreeBase } from "@/utls/ThreeBase";

export const useEffectGlitchPass = (element) => {
  onMounted(() => {
    const threeBase = new ThreeBase(element.value);
    threeBase.camera.position.set(500, 500, 500);

    loadLight(threeBase);
    loadTools(threeBase);

    loadShaderDemo(threeBase);
  });

  const loadLight = (threeBase) => {
    threeBase.scene.add(new THREE.AmbientLight(0xffffff));
  };

  const loadTools = (threeBase) => {
    threeBase.addAxesHelper(10000);
    threeBase.addStats();
  };

  // 手动将shadertoy中的着色器代码转换为threejs可识别的代码
  const loadShaderDemo = (threeBase) => {
    const vertexShader = `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const fragmentShader = `
      varying vec2 vUv;
      uniform float iTime;
      uniform vec3 iResolution;
      void main(){
        vec3 col = 0.5 + 0.5*cos(iTime+vUv.xyx+vec3(0,2,4));
        gl_FragColor = vec4(col,1.0);
      }
    `;
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(40, 40, 1) },
    };
    const shadertoy = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: 2,
    });
    const planeGeo = new THREE.PlaneGeometry(100, 100);
    const plane = new THREE.Mesh(planeGeo, shadertoy);

    threeBase.scene.add(plane);

    setInterval(() => {
      uniforms.iTime.value += 0.1;
    }, 20);
  };
};
