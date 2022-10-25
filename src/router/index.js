import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/Effect_GlitchPass",
  },
  {
    path: "/Effect_GlitchPass",
    name: "Effect_GlitchPass",
    component: () => import("@/views/effect/Effect_GlitchPass"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
