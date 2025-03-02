import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export class Scene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;

  constructor(container: HTMLElement) {
    this.container = container;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.composer = new EffectComposer(this.renderer);

    this.init();
    this.animate();
    this.addObjects();
    this.initPostProcessing();
  }

  private init(): void {
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    // this.renderer.setSize(
    //   this.container.clientWidth,
    //   this.container.clientHeight
    // );
    this.composer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  private addObjects(): void {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    this.scene.add(mesh);
  }

  private animate(): void {
    // this.renderer.render(this.scene, this.camera);
    this.composer.render();

    requestAnimationFrame(this.animate.bind(this));
  }

  private onWindowResize(): void {
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    // this.renderer.setSize(
    //   this.container.clientWidth,
    //   this.container.clientHeight
    // );
    this.composer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  }

  private initPostProcessing(): void {
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const glitchPass = new GlitchPass();
    this.composer.addPass(glitchPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }
}
