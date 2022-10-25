<template>
  <nav>
    <router-link to="/Effect_GlitchPass">Effect_GlitchPass</router-link>
    <router-link to="/Effect_OutlinePass">Effect_OutlinePass</router-link>
  </nav>
  <router-view />
</template>

<style lang="scss">
body {
  margin: 0;
}
#app {
  width: 100vw;
  height: 100vh;
}
nav {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9999;
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
