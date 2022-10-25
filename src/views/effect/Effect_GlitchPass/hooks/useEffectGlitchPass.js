import { onMounted } from "vue";

import * as THREE from "three";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";

import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";

import { ThreeBase } from "@/utls/ThreeBase";

export const useEffectGlitchPass = (element) => {
  onMounted(() => {
    const threeBase = new ThreeBase(element.value);

    loadLight(threeBase);
    loadEffect(threeBase);
    loadGirl(threeBase);
    loadTools(threeBase);
  });

  const loadLight = (threeBase) => {
    threeBase.scene.add(new THREE.AmbientLight(0xffffff));
  };

  const loadEffect = (threeBase) => {
    // 加载 错误效果 后期处理
    threeBase.composer.addPass(new GlitchPass());
    // 使用 GammaCorrectionShader 自定义着色器 将 GlitchPass 导致的色差纠正
    threeBase.composer.addPass(new ShaderPass(GammaCorrectionShader));
  };

  const loadTools = (threeBase) => {
    threeBase.addAxesHelper(10000, 10000);
    threeBase.addStats();
  };

  const loadGirl = async (threeBase) => {
    // 加载模型
    const url = `/models/just_a_girl/scene.gltf`;
    const { scene } = await threeBase.loadGLTF(url, (progress) => {
      console.log("progress", progress);
    });
    threeBase.scene.add(scene);
    // 相机位置调整
    threeBase.camera.position.set(
      149.46083262763383,
      90.30787534810239,
      298.83719464695196
    );
    // 设置焦点位置
    threeBase.control.target.set(
      1.0796834824407244,
      50.7078568830951,
      -15.863785685809768
    );
  };
};
