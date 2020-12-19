import React, { Component } from "react";

import { fragment } from "./shaders/fragment";
import { vertex } from "./shaders/vertex";

import t from "./img/img4.jpg";
import t1 from "./img/img3.jpg";

import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { gsap } from "gsap";

class Backdrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      paused: true,
      isRunning: false,

      data: {
        distortion: 0.0,
        bloomStrength: 0.0,
      },
    };
  }



  componentDidMount() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container = this.mount;

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      5000
    );

    this.camera.position.set(0, 0, 1000);
    this.scene = new THREE.Scene();
    //this.textures = [new THREE.TextureLoader().load(t)];
    //this.renderer.physicallyCorrectLights = true;
    this.renderer.setClearColor(0x000000, 1);
    //this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;
    this.mount.appendChild(this.renderer.domElement);
    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.addPost();
    this.addMesh();
    this.settings();
    this.resize();

    this.init();

    this.mount.addEventListener("click", () => {
    
      gsap.to(this.material.uniforms.distortion, {
        duration: 2,
        value: 2,
        ease: "power2.inOut",
      });

      gsap.to(this.material.uniforms.progress, {
        duration: 0.5,
        value: 1,
        delay: 1.5,
      });
      gsap.to(this.bloomPass, {
        duration: 2,
        strength: 6,
        ease: "power2.in",
      });

      gsap.to(this.material.uniforms.distortion, {
        duration: 2,
        value: 0,
        delay: 2,
        ease: "power2.inOut",
      });
      gsap.to(this.bloomPass, {
        duration: 2,
        strength: 0,
        delay: 2,
        ease: "power2.out",
       
     
      });
    });
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
      distortion: 0,
    };
  }

  addPost() {
    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );

    this.bloomPass.threshold = this.state.data.bloomThreshold;
    this.bloomPass.strength = this.state.data.bloomStrength;
    this.bloomPass.radius = this.state.data.bloomRadius;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);
  }

  addMesh() {
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
         extensions: {
        derivatives: "#extension GL_OES_standard_derivatives: enable",
      }, 
      uniforms: {
        time: { type: "f", value: 0 },

        distortion: { type: "f", value: 0.0 },
        t: { type: "t", value: new THREE.TextureLoader().load(t) },
        t1: { type: "t", value: new THREE.TextureLoader().load(t1) },
        resolution: { type: "v4", value: new THREE.Vector4() },
        progress: { type: "f", value: 0 },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      side: THREE.DoubleSide,
    });

   

    this.geometry = new THREE.PlaneBufferGeometry(1920, 1280, 960, 640);

    this.plane = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  stop = () => {
    this.setState({
      paused: true,
    });
  };

  play = () => {
    this.setState({
      paused: false,
    });
  };

  setupResize = () => {
    this.mount.addEventListener("resize", this.resize);
  };

  handleUpdate = (newData) =>
    this.setState((prevState) => ({
      data: { ...prevState.data, ...newData },
    }));

  resize() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.composer.setSize(width, height);

    this.camera.updateProjectionMatrix();
  }

  init() {
    let _time = this.state.time;
    _time += 0.05;
    this.setState({
      time: _time,
    });

    this.material.uniforms.time.value = this.state.time;
    //this.material.uniforms.distortion.value = this.state.data.distortion;
    //this.bloomPass.strength = this.state.data.bloomStrength;
    this.requestID = requestAnimationFrame(this.init.bind(this));
    //this.renderer.render(this.scene, this.camera);
    this.composer.render();
  }

  componentWillUnmount() {
    //this.mount.removeEventListener("resize", this.resize);

    this.stop();
    //this.loader = null;
    this.scene = null;
    this.camera = null;
    //this.controls.dispose();
    cancelAnimationFrame(this.requestID);
    this.mount.removeChild(this.renderer.domElement);
  }

  render() {


    return (
      <>
       
        <div id="container" ref={(ref) => (this.mount = ref)} />
      </>
    );
  }
}

export default Backdrop;
