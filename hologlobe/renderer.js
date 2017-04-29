'use strict';

const width = 400;
const height = 300;

const socket = io();

//New scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.5, 1000);

//New Renderer
const renderers = [
  new THREE.WebGLRenderer({ alpha: true, canvas: document.getElementById('top') }),
  new THREE.WebGLRenderer({ alpha: true, canvas: document.getElementById('bottom') }),
  new THREE.WebGLRenderer({ alpha: true, canvas: document.getElementById('right') }),
  new THREE.WebGLRenderer({ alpha: true, canvas: document.getElementById('left') }),
];

const cameras = [
  new THREE.PerspectiveCamera(75, width / height, 0.5, 1000),
  new THREE.PerspectiveCamera(75, width / height, 0.5, 1000),
  new THREE.PerspectiveCamera(75, width / height, 0.5, 1000),
  new THREE.PerspectiveCamera(75, width / height, 0.5, 1000),
];

const cameraDistance = 18;

cameras[0].position.z -= cameraDistance;
cameras[1].position.z += cameraDistance;
cameras[2].position.x -= cameraDistance;
cameras[3].position.x += cameraDistance;

//Add lighting
scene.add(new THREE.AmbientLight(0x333333));

const sun = new THREE.PointLight(0xFFFFFF, 1, 100);
sun.position.x = 12;
sun.position.y = 10;
sun.position.z = 10;
scene.add(sun);

const planet = new THREE.Group();

cameras.forEach((camera) => {
  camera.lookAt(planet.position);
});

{
  const geometry = new THREE.Geometry();

  for ( let i = 0; i < 1000; i ++ ) {
    const vertex = new THREE.Vector3();
    const coords = sphereToCortesian(10, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    vertex.x = coords.x;
    vertex.y = coords.y;
    vertex.z = coords.z;

    geometry.vertices.push( vertex );
  }

  const sprite = new THREE.TextureLoader().load( "textures/spark1.png" );
  const material = new THREE.PointsMaterial({
    size: 10,
    map: sprite,
    sizeAttenuation: false,
    blending: THREE.AdditiveBlending,
    color: 0x0080FF,
    transparent: true,
    opacity: 0.3,
  });

  const particles = new THREE.Points( geometry, material );
  // planet.add(particles);
}

{
  //Create a sphere to make visualization easier.
  const geometry = new THREE.SphereGeometry(10, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    wireframe: false,
    map: THREE.ImageUtils.loadTexture('textures/earthmap1k.jpg'),
    bumpMap: THREE.ImageUtils.loadTexture('textures/earthbump1k.jpg'),
    bumpScale: 0.5,
    specularMap: THREE.ImageUtils.loadTexture('textures/earthspec1k.jpg'),
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.rotation.y += -1.57;
  planet.add(sphere);
}

{
  $.getJSON("./sample_data.json", function(data) {
    console.log(data.lat.length, data.lon.length);
    renderData(data);
    const canvas = document.getElementById('test');
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    // const texture = THREE.ImageUtils.loadTexture('textures/earthspec1k.jpg');
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.3,
    });
    const geometry = new THREE.SphereGeometry(10.3, 32, 32);
    const mesh = new THREE.Mesh(geometry, material);
    planet.add(mesh);
  });
}

//Draw the GeoJSON
const test_json = $.getJSON("test_geojson/countries_states.geojson", function(data) {
  drawThreeGeo(data, 10, 'sphere', {
    color: 0x80FF80,
    transparent: true,
    opacity: 0.5,
  }, planet)
});

//Set the camera position
camera.position.z = 20;

//Enable controls
// const controls = new THREE.TrackballControls(camera);

// const composer = new THREE.EffectComposer( renderer );
// composer.addPass( new THREE.RenderPass( scene, camera ) );

const glitchPass = new THREE.GlitchPass();
glitchPass.renderToScreen = true;

// composer.addPass( glitchPass );

scene.add(planet);

//Render the image
function render() {
  // controls.update();
  // composer.render();
  // renderer.render(scene, camera);
  renderers.forEach((renderer, index) => renderer.render(scene, cameras[index]));
  requestAnimationFrame(render);
  // planet.rotation.y += 0.03;
}

socket.on('add action', function(msg) {
  planet.rotation.y += 0.1;
});


render();