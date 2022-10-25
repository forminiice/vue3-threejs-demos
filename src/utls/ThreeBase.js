import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { isFunction } from "lodash-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Sizes from "./Size";
export class ThreeBase {
  constructor(element) {
    this.element = element;
    this.scene = this.initScene();
    this.camera = this.initCamera();
    this.CSS2Render = this.initCSS2Render();
    this.renderer = this.initRenderer();
    this.composer = this.initComposer();
    this.control = this.initControl();
    this.sizes = this.initSize();
    this.mixers = [];
    this.clock = new THREE.Clock();
    this.renderMixins = [];
    this.render();
  }
  initScene() {
    const scene = new THREE.Scene();
    return scene;
  }
  initCamera() {
    const fov = 20;
    const aspect = this.element.offsetWidth / this.element.offsetHeight;
    const near = 0.1;
    const far = 100000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10000, 0);
    return camera;
  }
  initCSS2Render() {
    const CSS2Renderer = new CSS2DRenderer();
    CSS2Renderer.setSize(this.element.offsetWidth, this.element.offsetHeight);
    CSS2Renderer.domElement.style.position = "absolute";
    CSS2Renderer.domElement.style.top = "0px";
    this.element.appendChild(CSS2Renderer.domElement);
    return CSS2Renderer;
  }
  initRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor("#000");
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.setSize(this.element.offsetWidth, this.element.offsetHeight);
    renderer.localClippingEnabled = true;
    this.element.appendChild(renderer.domElement);
    return renderer;
  }
  initComposer() {
    const composer = new EffectComposer(this.renderer);
    composer.addPass(new RenderPass(this.scene, this.camera));
    return composer;
  }
  initControl() {
    const control = new OrbitControls(this.camera, this.CSS2Render?.domElement);
    control.target = new THREE.Vector3(0, 0, 0);
    control.update();
    return control;
  }
  initSize() {
    const sizes = new Sizes({ dom: this.element });
    sizes.onResize("resizeRender", () => {
      this.renderer.setSize(
        Number(sizes.viewport.width),
        Number(sizes.viewport.height)
      );
      this.composer.setSize(
        Number(sizes.viewport.width),
        Number(sizes.viewport.height)
      );
      this.CSS2Render.setSize(
        Number(sizes.viewport.width),
        Number(sizes.viewport.height)
      );
      this.camera.aspect =
        Number(sizes.viewport.width) / Number(sizes.viewport.height);
      this.camera.updateProjectionMatrix();
    });
    return sizes;
  }
  addStats() {
    this.stats = new Stats();
    this.element.appendChild(this.stats.dom);
  }
  addAxesHelper(size) {
    const axesHelper = new THREE.AxesHelper(size);
    this.scene.add(axesHelper);
    return axesHelper;
  }
  createGroup() {
    const group = new THREE.Group();
    this.scene.add(group);
    return group;
  }
  loadGLTF(url, onProgress) {
    const loader = new GLTFLoader();
    return new Promise((resolve) => {
      loader.load(
        url,
        (object) => resolve(object),
        (xhr) => onProgress(xhr)
      );
    });
  }
  loadAnimate(mesh, animations, animationName) {
    const mixer = new THREE.AnimationMixer(mesh);
    const clip = THREE.AnimationClip.findByName(animations, animationName);
    if (!clip) return void 0;
    const action = mixer.clipAction(clip);
    action.play();
    this.mixers.push(mixer);
  }
  render() {
    // this.renderer.render(this.scene, this.camera);
    const mixerUpdateDelta = this.clock.getDelta();
    this.mixers.forEach((mixer) => mixer.update(mixerUpdateDelta));
    this.control.update();
    this.composer.render(this.renderer);
    this.renderMixins.forEach((mixin) => isFunction(mixin) && mixin());
    isFunction(this.stats?.update) && this.stats.update();
    requestAnimationFrame(this.render.bind(this));
  }
}
