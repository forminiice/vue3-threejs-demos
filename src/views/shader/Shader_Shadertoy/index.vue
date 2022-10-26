<template>
  <div ref="webglEl" class="webgl"></div>
</template>

<script setup>
import { ref } from "vue";

// 手动转换
// import { useEffectGlitchPass } from "./hooks/useShadertoy1";
// 使用 three-shadertoy-material npm包 直接使用shadertoy中的着色器生成材质
import { useEffectGlitchPass } from "./hooks/useShadertoy2";

const webglEl = ref();

useEffectGlitchPass(webglEl);
</script>

<style lang="scss" scoped>
.webgl {
  width: 100%;
  height: 100%;
}
</style>
