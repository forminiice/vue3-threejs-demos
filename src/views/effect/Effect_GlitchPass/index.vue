<template>
  <div ref="webglEl" class="webgl"></div>
</template>

<script setup>
import { ref } from "vue";

import { useEffectGlitchPass } from "./hooks/useEffectGlitchPass";

const webglEl = ref();

useEffectGlitchPass(webglEl);
</script>

<style lang="scss" scoped>
.webgl {
  width: 100%;
  height: 100%;
}
</style>
