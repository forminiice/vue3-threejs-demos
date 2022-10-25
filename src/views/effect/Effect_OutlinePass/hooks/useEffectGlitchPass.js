import { onMounted } from "vue";

import * as THREE from "three";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";

import { ThreeBase } from "@/utls/ThreeBase";

export const useEffectGlitchPass = (element) => {
  onMounted(() => {
    const threeBase = new ThreeBase(element.value);

    loadLight(threeBase);
    const { outlinePass } = loadEffect(threeBase);
    loadGirl(threeBase, outlinePass);
    loadTools(threeBase);
  });

  const loadLight = (threeBase) => {
    threeBase.scene.add(new THREE.AmbientLight(0xffffff));
  };

  const loadEffect = (threeBase) => {
    const outlinePass = new OutlinePass(
      new THREE.Vector2(
        threeBase.sizes.viewport.width,
        threeBase.sizes.viewport.height
      ),
      threeBase.scene,
      threeBase.camera
    );
    outlinePass.edgeGlow = 2;
    outlinePass.visibleEdgeColor = new THREE.Color(0xffd247);
    outlinePass.hiddenEdgeColor = new THREE.Color(0x000000);
    outlinePass.pulsePeriod = 0;
    threeBase.composer.addPass(outlinePass);

    // 使用 GammaCorrectionShader 自定义着色器 将 GlitchPass 导致的色差纠正
    threeBase.composer.addPass(new ShaderPass(GammaCorrectionShader));

    return { outlinePass };
  };

  const loadTools = (threeBase) => {
    threeBase.addAxesHelper(10000);
    threeBase.addStats();
  };

  const loadGirl = async (threeBase, outlinePass) => {
    // 加载模型
    const url = `/models/just_a_girl/scene.gltf`;
    const { scene } = await threeBase.loadGLTF(url, (progress) => {
      console.log("progress", progress);
    });
    outlinePass.selectedObjects = [scene];
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
