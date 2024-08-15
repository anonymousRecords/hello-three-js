import "./style.css";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(renderer.domElement);

// 큐브 생성
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 원 생성
const circleGeometry = new THREE.CircleGeometry(0.5, 32);
const circleMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.set(2, 0, 0);
scene.add(circle);

// 조명 추가
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

camera.position.z = 10; // 카메라 위치 조정

// 텍스트 추가
const loader = new FontLoader();
loader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  (font) => {
    const textGeometry = new TextGeometry("Hello Three.js", {
      font: font,
      size: 0.5,
      depth: 0.1,
      curveSegments: 12,
      bevelEnabled: false,
    });
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-2, 1, 0);
    scene.add(textMesh);
  }
);

function animate() {
  requestAnimationFrame(animate);

  // 큐브 회전
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // 원 움직임
  circle.position.y = Math.sin(Date.now() * 0.001) * 1;

  renderer.render(scene, camera);
}

animate();

console.log("Script finished");

// 윈도우 리사이즈 이벤트 처리
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
