import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.y = 30; 

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
scene.background = new THREE.Color('#333333');

let scrollPosY = 0;

function initScene({ root }) {
  if (!root) return;

  // Center the model so it rotates in place
  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);

  scene.add(root);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 3);
  scene.add(hemiLight);

  // Optional: point camera at the model

  const rate = 0.1;
  function animate() {
    requestAnimationFrame(animate);
    const goalPos = Math.PI * scrollPosY;
    root.rotation.y -= (root.rotation.y - goalPos) * rate;
    renderer.render(scene, camera);
  }
  animate();
}

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);
let sceneData = {};

manager.onLoad = () => initScene(sceneData);

loader.load(
  "./late_night_office.glb",
  (gltf) => {
    sceneData.root = gltf.scene;
  },
  undefined,
  (err) => console.error("GLB load failed:", err)
);


window.addEventListener("scroll", () => {
  scrollPosY = (window.scrollY / document.body.clientHeight);
});

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);