import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import vertexShader from './shader/vertex.glsl';
import fragmentShader from './shader/fragment.glsl';
import testTexture from '../../img/texture.jpg';
import gui from 'lil-gui';
import gsap from 'gsap';
import ASScroll from '@ashthornton/asscroll';

export default class webgl {
  constructor(options) {
    this.container = options;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera( 30, this.width / this.height, 10, 1000 );
    this.camera.position.z = 600;

    this.camera.fov = 2 * Math.atan( (this.height / 2) / 600 ) * 180 / Math.PI;


    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer( {
      antialias: true,
      alpha: true,
    } );

    this.renderer.setSize( this.width, this.height );

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild( this.renderer.domElement );
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.materials = [];

    // asscroll
    this.asscroll = new ASScroll();
    this.asscroll.enable({
      horizontalScroll: true,
    });

    this.time = 0;
    this.setupSettings();
    this.addObjects();
    this.render();
    this.setupResize();
  }

  setupSettings() {
    this.settings = {
      progress: 0,
    }
    this.gui = new gui();
    this.gui.add(this.settings,'progress', 0, 1, 0.001 );
  }

  addObjects() {
    this.geometry = new THREE.PlaneGeometry( 1, 1, 100, 100);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {value: 1.0},
        uProgress: {value: 0},
        uTexture: {value: null},
        uTextureSize: {value: new THREE.Vector2(100, 100)},
        uCorners: {value: new THREE.Vector4(0, 0, 0, 0)},
        uResolution: { value: new THREE.Vector2(this.width,this.height) },
        uQuadSize: { value: new THREE.Vector2(300, 300) }
      },
      vertexShader,
      fragmentShader,
      // side: DoubleSide,
      // wireframe: true
    });

    this.tl = gsap.timeline()
        .to(this.material.uniforms.uCorners.value, {
          x: 1,
          duration: 1,
        })
        .to(this.material.uniforms.uCorners.value, {
          y: 1,
          duration: 1,
        }, 0.1)
        .to(this.material.uniforms.uCorners.value, {
          z: 1,
          duration: 1,
        }, 0.2)
        .to(this.material.uniforms.uCorners.value, {
          w: 1,
          duration: 1,
        }, 0.3)

    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.scale.set(300, 300, 1)
    this.mesh.position.x = 300;
    // this.scene.add( this.mesh );


    this.images = [...document.querySelectorAll('.js-image')];
    this.imageStore = this.images.map(img => {
      let bounds = img.getBoundingClientRect();
      let m = this.material.clone();
      this.materials.push(m);
      let texture = new THREE.Texture(img);
      texture.needsUpdate = true;

      m.uniforms.uTexture.value = texture;

      let mesh = new THREE.Mesh(this.geometry, m);
      this.scene.add(mesh);
      mesh.scale.set(bounds.width, bounds.height, 1);
      console.log(m);

      return {
        img: img,
        mesh: mesh,
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        left: bounds.left,
      }
    });

  }

  setPosition() {
    this.imageStore.forEach(o => {
      o.mesh.position.x = o.left - this.width / 2 + o.width / 2;
      o.mesh.position.y = -o.top + this.height / 2 - o.height / 2;
    })
  }

  render() {
    this.time += 0.05;
    this.material.uniforms.uTime.value = this.time;
    // this.material.uniforms.uProgress.value = this.settings.progress;
    this.setPosition();
    this.tl.progress(this.settings.progress);
    this.renderer.render( this.scene, this.camera );
    // this.mesh.rotation.x += this.time / 2000;
    // this.mesh.rotation.y += this.time / 2000;

    this.controls.update();

    requestAnimationFrame(this.render.bind(this))

  }

  setupResize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize( this.width, this.height );
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }
}



