import { onMounted } from "vue";

import * as THREE from "three";

import { ThreeBase } from "@/utls/ThreeBase";

import ShaderToyMaterial from "three-shadertoy-material";

export const useEffectGlitchPass = (element) => {
  onMounted(() => {
    const threeBase = new ThreeBase(element.value);
    threeBase.camera.position.set(500, 500, 500);
    threeBase.renderer.setClearColor("#ccc");

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

  // 使用 three-shadertoy-material 包 直接使用shadertoy中的着色器代码创建材质
  const loadShaderDemo = (threeBase) => {
    const shadertoy = new ShaderToyMaterial(`
      void mainImage( out vec4 O,  vec2 U ){
        U = 2.* sin (25.*U/iResolution.x);  
        O = .5 + .5* sin( U.x+U.y + vec4(0,2.4,-2.4,0) +iTime);
      }
    `);
    shadertoy.side = THREE.DoubleSide;
    // const planeGeo = new THREE.PlaneGeometry(100, 100);
    const planeGeo = new THREE.BoxGeometry(100, 100, 100);
    const plane = new THREE.Mesh(planeGeo, shadertoy);

    threeBase.scene.add(plane);
  };
};
