import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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
 * 4. OrbitControls 생성
 * OrbitControls : https://threejs.org/docs/#examples/ko/controls/OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

/**
 * 5. 객체 생성
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
 * 6. 조명
 * PointLight : https://threejs.org/docs/#api/en/lights/PointLight
 */
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 0, 10);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 0.5);
spotLight.position.set(-5, 5, 5);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.1;
scene.add(spotLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

camera.position.z = 10;

/**
 * 7. 텍스트 생성
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
 * 8. 애니메이션
 * requestAnimationFrame : https://developer.mozilla.org/ko/docs/Web/API/Window/requestAnimationFrame
 */
function animate() {
  requestAnimationFrame(animate);

  // 큐브 회전
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // 원 움직임
  circle.position.y = Math.sin(Date.now() * 0.001) * 1;

  // 포인트 라이트 움직임
  const time = Date.now() * 0.001;
  pointLight.position.x = Math.sin(time) * 3;
  pointLight.position.z = Math.cos(time) * 3;

  controls.update(); // OrbitControls 업데이트
  renderer.render(scene, camera);
}

animate();

/**
 * 8. 반응형 처리
 */
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
