'use strict';

const width = 400;
const height = 300;

const socket = io();

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

const renderers = [
  new THREE.WebGLRenderer({ alpha: true, canvas: document.getElementById('bottom') }),
  new THREE.WebGLRenderer({ alpha: true, canvas: document.getElementById('right') }),
  new THREE.WebGLRenderer({ alpha: true, canvas: document.getElementById('left') }),
];

const cameraDistance = 18;
const cameras = [
  new THREE.PerspectiveCamera(75, width / height, 0.5, 1000),
  new THREE.PerspectiveCamera(75, width / height, 0.5, 1000),
  new THREE.PerspectiveCamera(75, width / height, 0.5, 1000),
];

cameras[0].position.z += cameraDistance;
cameras[1].position.x -= cameraDistance;
cameras[2].position.x += cameraDistance;

const sun = new THREE.PointLight(0xFFFFFF, 1, 100);
sun.position.x = 12;
sun.position.y = 10;
sun.position.z = 10;
scene.add(sun);
scene.add(new THREE.AmbientLight(0x333333));

const planet = new THREE.Group();

cameras.forEach((camera) => {
  camera.lookAt(planet.position);
});

{
  const geometry = new THREE.SphereGeometry(10, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    wireframe: false,
    map: textureLoader.load('textures/earthmap1k.jpg'),
    bumpMap: textureLoader.load('textures/earthbump1k.jpg'),
    bumpScale: 0.5,
    specularMap: textureLoader.load('textures/earthspec1k.jpg'),
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.rotation.y += -1.57;
  planet.add(sphere);
}

const heatmaps = [];
let heatmapMaterial;
let heatmapIndex;

$.getJSON("./temperature.json?=" + Math.random(), function(data) {
  const texture = renderData(data, 250, 320);
  heatmaps.push(texture);
  heatmapIndex = 0;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.3,
  });
  heatmapMaterial = material;
  const geometry = new THREE.SphereGeometry(10.3, 32, 32);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.y += -1.57;  
  planet.add(mesh);
});

$.getJSON("./pressure.json?=" + Math.random(), function(data) {
  const texture = renderData(data, 101000, 102000);
  heatmaps.push(texture);
});

$.getJSON("test_geojson/custom.geo.json?q=" + Math.random(), function(data) {
  drawThreeGeo(data, 10, 'sphere', {
    color: 0x80FF80,
    transparent: true,
    opacity: 0.5,
  }, planet)
});

scene.add(planet);

const composers = renderers.map((renderer, index) => {
  const composer = new THREE.EffectComposer( renderer );
  composer.addPass( new THREE.RenderPass( scene, cameras[index]) );
  composer.addPass( new THREE.GlitchPass() );
  return composer;
});

function glitch(delay) {
  composers.forEach((composer) => {
    const glitchPass = composer.passes[1];

    if (!glitchPass.goWild) {
      glitchPass.renderToScreen = true;
      glitchPass.goWild = true;
      glitchPass.goSmooth = false;

      setTimeout(() => {
        glitchPass.goWild = false;
        glitchPass.goSmooth = true;
      }, delay);
    }
  });
}

let planetRotationY = 0;
let planetRotationX = 0;

//Render the image
function render() {
  planet.rotation.y += planetRotationY;
  planet.rotation.x += planetRotationX;
  composers.forEach((composer) => composer.render());
  requestAnimationFrame(render);
}

render();
glitch(3000);

socket.on('rotate_more', function(msg) {
  planetRotationY += 0.01;
});

socket.on('rotate_less', function(msg) {
  planetRotationY -= 0.01;
});

socket.on('rotate_up', function(msg) {
  planetRotationX += 0.01;
});

socket.on('rotate_down', function(msg) {
  planetRotationX -= 0.01;
});

socket.on('switch_heatmap', function(msg) {
  if (heatmaps.length) {
    heatmapIndex++;

    if (heatmapIndex >= heatmaps.length) {
      heatmapIndex = 0;
    }
  }

  heatmapMaterial.map = heatmaps[heatmapIndex];
});

socket.on('glitch_it', () => glitch(500));

socket.on('stop_rotation', function(msg) {
  if (planetRotationX || planetRotationY) {
    planetRotationY = 0;
    planetRotationX = 0;
  } else {
    planet.rotation.x = 0;
    planet.rotation.y = 0;
  }
});
