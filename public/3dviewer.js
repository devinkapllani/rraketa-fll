let scene, camera, renderer, controls;

function init3DViewer() {
  const container = document.getElementById("model3d");

  // Clear previous canvas
  container.innerHTML = "";

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1c2d);

  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  camera.position.set(0, 0, 6);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Statue-like geometry
  const geometry = new THREE.CylinderGeometry(1, 0.6, 3, 64);
  const material = new THREE.MeshStandardMaterial({
    color: 0xd8c9a3,
    roughness: 0.5,
    metalness: 0.1
  });

  const statue = new THREE.Mesh(geometry, material);
  statue.position.y = -0.5;
  scene.add(statue);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}