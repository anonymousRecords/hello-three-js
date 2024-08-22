## 들어가기에 앞서...
이전에 비눗방울 애니메이션을 구현하고 싶었던 적이 있다.
그래서 [gsap](https://gsap.com/)을 사용하여, 나름 둥둥 뜨고 클릭하면 비눗방울이 터뜨려지는 애니메이션 효과를 구현했다.
하지만 내가 원했던 더 실감나는 물에 대한 표현력은 부족하였다.    
그러다가 Project SOK의 'Sunshower' 작품을 보았다. 내가 구현하고 싶었던 것이었고, 기술 스택에 [Three.js](https://threejs.org/)가 있는 것을 알았다. 
그때부터 Three.js를 배워보고 싶다는 마음을 가지게 되었다.
그렇지만 계속 마음에만 품고 시도를 하지 않아서, 좋은 기회에 `three-js 스터디`에 참가하여 Three.js에 입문하게 되었다.
그리고 그 기록은 이 레포지토리에 남기고자 한다.

|내가 구현한 비눗방울|Project SOK|
|---|---|
|<img width="1679" alt="image" src="https://github.com/user-attachments/assets/62b7432b-8b76-452a-91b6-481cd7d02b80">|<img width="1679" alt="image" src="https://github.com/user-attachments/assets/ce03f17a-5fab-40c3-8cc2-b6aa0344019d">|
|https://eo-galaxy.vercel.app/home|https://www.project-sok.com/sunshower|

## 1️⃣ 1회차 : Hello World, Transform, Animation
https://github.com/user-attachments/assets/d7f7c0f1-0bd6-414c-88e1-32c7490c4ff0

<br />

### 웹에서 그래픽은 어쩌다 탄생했을까?
정적 웹에서 동적 웹으로 발전한 과정도 험난했을텐데, 3D 그래픽의 탄생 과정도 궁금해서 찾아보았다
<img width="460" alt="image" src="https://github.com/user-attachments/assets/d3926c24-786c-4d47-ad94-11ad25702bce">

웹 그래픽 발전 역사 중에서 내가 궁금했던 부분들만 간단히 언급해 보려고 한다. 

**(1)**[DHTML(Dynamic HTML)]()은 우리가 사용하고 있는 HTML+CSS+JavaScript 조합과 유사하지만, 엄연히 다른 개념이다. DHTML은 1990년대 후반에 사용된 용어로, 정적인 HTML 페이지를 동적으로 변경할 수 있는 기술의 조합을 의미하는 거여서 현대 우리가 사용하는 조합과는 차이가 있다.      
**(2)** Flash의 정식 명칭은 Adobe Flash로, 2020년 12월 31일부로 지원이 중단되어서 그 흔적이 문서로만 남아있다고 한다.      
**(3)** 그 다음이 SVG인데, 사실 SVG하면 단순한 파일 형식으로만 생각할 수 있겠지만 웹 그래픽 발전 역사에 중요한 역할을 지녔다. XML 기반 벡터 그래픽, 확장성(어떤 크기로 확대해도 품질 손실 x), JavaScript로 조작 가능하여 동적인 그래픽 생성 가능 등으로 웹 그래픽의 새로운 가능성을 열어줬다.       
**(4)** 마지막으로 CSS3와 HTML5는 기존 CSS, HTML에서 다양한 기능들이 추가되어 큰 변화가 생겼다.      

### [WebGL](https://github.com/KhronosGroup/WebGL) vs [Three.js](https://github.com/mrdoob/three.js) vs [react-three-fiber](https://github.com/pmndrs/react-three-fiber)
<img width="975" alt="image" src="https://github.com/user-attachments/assets/ec2f0767-6b65-4dc6-b590-da922ecf0fa0">
GPU(Graphics Processing Unit)는 그래픽 처리에 최적화된 특수한 프로세서다. 전통적으로 웹에서는 CPU를 주로 사용했지만, 복잡한 3D 그래픽 처리에 비효율적이다. 그래서 탄생한 것이 바로 WebGL이다. WebGL은 JavaScript를 사용해 GPU의 기능에 접근할 수 있게 해준다. 이를 통해 브라우저에서 직접 GPU의 병렬 처리 능력을 활용할 수 있어, 복잡한 3D 그래픽도 부드럽고 빠르게 렌더링할 수 있게 된다.
그런데 이런 WebGL에도 어려운 점이 존재하는데, 바로 모든 작업(행렬 계산 등)을 수동으로 처리해야 하며 러닝 커브가 높다는 것이다. 이런 WebGL을 추상화시켜 쉽게 접근할 수 있는 것이 바로 Three.js이다. 그리고 이런 Three.js를 React.js에 사용하기 편하게 만든 것이 바로 react-three-fiber이다.

### 1회차 코드 작성 중 생긴 질문들
**1. 장면, 카메라, 렌더러의 역할이 무엇이지?**

Three.js를 구현할 때 꼭 필요한 3요소로는, 장면, 카메라, 렌더러가 있다.   
이를 영화에 비유해보면, 
- 장면(Scene) <-> 영화 세트장
- 카메라(Camera) <-> 영화 카메라
- 렌더러(Renderer) <-> 편집실

**2. PerspectiveCamera()가 무엇일까?**

```
const camera = new THREE.PerspectiveCamera(
  75,// 시야각 (FOV)
  window.innerWidth / window.innerHeight,// 종횡비
  0.1,// 근평면
  1000// 원평면
);
```
- 75: 시야각(FOV). 카메라가 보는 수직 각도, 값이 클수록 더 넓은 범위를 봄.
- window.innerWidth / window.innerHeight: 종횡비. 화면의 가로/세로 비율
- 0.1: 근평면. 카메라가 볼 수 있는 가장 가까운 거리
- 1000: 원평면. 카메라가 볼 수 있는 가장 먼 거리

**3. geometry에서 큐브와 원의 차이는 무엇일까?**

BoxGeometry()
- 기본 크기(1x1x1)의 큐브를 생성
- 매개변수를 지정하지 않으면 기본값을 사용

CircleGeometry(0.5, 32)
- 0.5는 원의 반지름, 32는 원을 구성하는 삼각형의 수(해상도)

**4. Mesh가 무엇일까?**

**5. postion.set이 무엇일까?**
```
object.position.set(x, y, z);
```
- 3D 공간에서 객체의 위치를 설정
- x는 좌우, y는 상하, z는 앞뒤를 나타냄
- 예시: position.set(2, 0, 0)는 오른쪽으로 2만큼 이동

## 2️⃣ 2회차 : camera, light
https://github.com/user-attachments/assets/da05eb5c-aa1f-46ee-9b25-8be484987946

