<template>
  <nav>
    <router-link
      v-for="(route, index) in routers"
      :key="index"
      :to="route.path"
    >
      {{ route.name }}
    </router-link>
  </nav>
  <router-view />
</template>

<script setup>
import { useRouter } from "vue-router";

const Router = useRouter();
const routers = Router.options.routes.filter((route) => {
  if (route.name !== "home") {
    return route;
  }
});
</script>

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
    display: block;
    font-weight: bold;
    color: #fff;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
