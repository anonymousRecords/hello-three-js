import "./style.css";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

/**
 * 1. 장면 생성 및 배경색 설정
 * Scene : https://threejs.org/docs/#api/en/scenes/Scene
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

/**
 * 2. 카메라 생성
 * Camera : https://threejs.org/docs/#api/en/cameras/Camera
 * PerspectiveCamera : https://threejs.org/docs/#api/ko/cameras/PerspectiveCamera
 *
 * Three.PerspectiveCamera(fov 카메라 절두체 수직 시야, aspect 카메라 절두체 종횡비, near 카메라 절두체 근평면, far 카메라 절두체 원평면)
 */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

/**
 * 3. 렌더러 생성
 * WebGLRenderer : https://threejs.org/docs/#api/en/renderers/WebGLRenderer
 */
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(renderer.domElement);

/**
 * 4. 객체 생성
 * BoxGeometry : https://threejs.org/docs/#api/en/geometries/BoxGeometry
 * MeshPhongMaterial : https://threejs.org/docs/#api/en/materials/MeshPhongMaterial
 * Mesh : https://threejs.org/docs/#api/en/objects/Mesh
 */

// 큐브 생성
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// 원 생성
const circleGeometry = new THREE.CircleGeometry(0.5, 32);
const circleMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.set(2, 0, 0);
scene.add(circle);

/**
 * 5. 조명
 * PointLight : https://threejs.org/docs/#api/en/lights/PointLight
 */
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

camera.position.z = 10; // 카메라 위치 조정

/**
 * 6. 텍스트 생성
 * FontLoader : https://threejs.org/docs/#api/en/loaders/FontLoader
 * TextGeometry : https://threejs.org/docs/#api/en/geometries/TextGeometry
 */
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

/**
 * 7. 애니메이션
 * requestAnimationFrame : https://developer.mozilla.org/ko/docs/Web/API/Window/requestAnimationFrame
 */
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

/**
 * 8. 반응형 처리
 */
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
