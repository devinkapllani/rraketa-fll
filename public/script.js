/* ================= GALAXY ================= */

const canvas = document.getElementById("galaxy");

if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let stars = [];

  for (let i = 0; i < 400; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 0.5
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.y += star.speed;
      if (star.y > canvas.height) star.y = 0;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ================= ARTIFACT DATA ================= */

const artifacts = [
  {
    title: "Ceramic Artifact",
    desc: "Ancient ceramic ritual vessel discovered in Albania.",
    age: "1200 Years",
    original: "images/art1.png",
    reconstructed: "images/reconstructed1.jpeg"
  },
  {
    title: "Clay Fragment",
    desc: "Historical clay structure fragment.",
    age: "1500 Years",
    original: "images/art2.jpeg",
    reconstructed: "images/reconstructed2.jpeg"
  },
  {
    title: "Roman Statue",
    desc: "Marble statue fragment from Roman period.",
    age: "1800 Years",
    original: "images/art3.jpeg",
    reconstructed: "images/reconstructed3.jpeg"
  },
  {
    title: "Metal Jug",
    desc: "Ancient metal storage container.",
    age: "1400 Years",
    original: "images/art4.jpeg",
    reconstructed: "images/reconstructed4.jpeg"
  },
  {
    title: "Stone Head",
    desc: "Carved stone sculpture fragment.",
    age: "2200 Years",
    original: "images/art5.jpeg",
    reconstructed: "images/reconstructed5.jpeg"
  },
  {
    title: "Ceramic Bowl",
    desc: "Decorative medieval ceramic bowl.",
    age: "1000 Years",
    original: "images/art6.jpeg",
    reconstructed: "images/reconstructed6.jpeg"
  },
  {
    title: "Ancient Mask",
    desc: "Ceremonial ritual mask.",
    age: "2000 Years",
    original: "images/art7.jpeg",
    reconstructed: "images/reconstructed7.jpeg"
  },
  {
    title: "Bronze Object",
    desc: "Decorative bronze artifact.",
    age: "1700 Years",
    original: "images/art8.jpeg",
    reconstructed: "images/reconstructed8.jpeg"
  }
];

/* ================= GALLERY ================= */

document.addEventListener("DOMContentLoaded", function () {

  const gallery = document.getElementById("artifactGallery");
  if (!gallery) return;

  artifacts.forEach((artifact, i) => {

    const card = document.createElement("div");
    card.className = "artifact-card";

    card.innerHTML = `
      <img src="${artifact.original}">
      <div class="artifact-overlay">
        <h3>${artifact.title}</h3>
        <p>${artifact.age}</p>
      </div>
    `;

    card.onclick = () => openModal(i);
    gallery.appendChild(card);
  });

});

/* ================= MODAL ================= */

function openModal(index) {

  const artifact = artifacts[index];

  document.getElementById("modalImage").src = artifact.original;
  document.getElementById("reconstructedImage").src = artifact.reconstructed;
  document.getElementById("modalTitle").innerText = artifact.title;
  document.getElementById("modalDesc").innerText = artifact.desc;
  document.getElementById("modalAge").innerText =
    "Estimated Age: " + artifact.age;

  document.getElementById("artifactModal").style.display = "flex";
}

function closeModal(){
  document.getElementById("artifactModal").style.display="none";
}

/* ================= REAL 3D GENERATION ================= */

function generate3DAI() {

  const container = document.getElementById("model3d");
  container.innerHTML = "";

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1c2d);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 6);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lighting
  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(5, 5, 5);
  scene.add(light1);

  const light2 = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light2);

  // Vase shape using LatheGeometry
  const points = [];
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(1.2, 0));
  points.push(new THREE.Vector2(1.3, 1));
  points.push(new THREE.Vector2(1, 2));
  points.push(new THREE.Vector2(0.6, 3));
  points.push(new THREE.Vector2(0.8, 3.5));
  points.push(new THREE.Vector2(0.6, 4));
  points.push(new THREE.Vector2(0, 4));

  const geometry = new THREE.LatheGeometry(points, 64);

  const material = new THREE.MeshStandardMaterial({
    color: 0xc2a87a,
    roughness: 0.8,
    metalness: 0.1
  });

  const vase = new THREE.Mesh(geometry, material);
  scene.add(vase);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}