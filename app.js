let cameras = [];
let current_camera = 0;
let renderer;
let scene;
let mesh;

function init() {
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8FBCD4);

    createCamera();
    createLights();
    createMeshes();
    createRenderer();

    window.addEventListener('resize', onWindowResize);
}

function createCamera() {
    'use strict';

    cameras[0] = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    cameras[0].position.x = 60;
    cameras[0].position.y = 60;
    cameras[0].position.z = 60;
    cameras[0].lookAt(scene.position);

    cameras[1] = new THREE.OrthographicCamera(window.innerWidth / - 20,
        window.innerWidth / 20,
        window.innerHeight / 20,
        window.innerHeight / - 20,
        1,
        1000);
    cameras[1].position.x = 0;
    cameras[1].position.y = 0;
    cameras[1].position.z = 40;
    cameras[1].lookAt(0, 0, 0);
}

function createLights() {
    'use strict';

    const light = new THREE.DirectionalLight(0xffffff, 3.0);

    light.position.set(10, 10, 10);

    scene.add(light);
}

function createMeshes() {
    'use strict';

    const geometry = new THREE.SphereBufferGeometry(2, 32, 32);

    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load('textures/uv_test_bw.png');

    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 16;

    const material = new THREE.MeshStandardMaterial({
        map: texture,
    });

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

}

function createRenderer() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function update() {
    'use strict';

    mesh.rotation.z += 0.01;
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

}

function animate() {
    'use strict';

    requestAnimationFrame(animate);
    update();
    render();
}
function render() {
    'use strict';

    renderer.render(scene, cameras[0]);

}

function onWindowResize() {
    'use strict';

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        cameras[0].aspect = window.innerWidth / window.innerHeight;
        cameras[0].updateProjectionMatrix();
    }
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        cameras[1].left = window.innerWidth / - 20;
        cameras[1].right = window.innerWidth / 20;
        cameras[1].top = window.innerHeight / 20;
        cameras[1].bottom = window.innerHeight / - 20
        cameras[1].updateProjectionMatrix();
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
}

