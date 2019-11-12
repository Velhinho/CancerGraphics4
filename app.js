var cameras = [];
var current_camera = 0;
var renderer;
var scene;

var geometry;
var material;
var chessboard;
var dice;
var ball;

function init() {
    'use strict';

    scene = new THREE.Scene();

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
    cameras[0].position.x = 30;
    cameras[0].position.y = 10;
    cameras[0].position.z = 0;
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

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(directionalLightHelper)

    var pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(2, 10, 2);
    scene.add(pointLight);

    var sphereSize = 1;
    var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    scene.add(pointLightHelper);    
}

function createMeshes() {
    'use strict';

    createGeometries();
    createMaterial();
    createBall();
    createDice();
    createChessboard();
}

function createGeometries() {
    'use strict';
    
    geometry = {
        ball: new THREE.SphereBufferGeometry(2, 32, 32),
        dice: new THREE.BoxBufferGeometry(5, 5, 5),
        chessboard: new THREE.BoxBufferGeometry(15, 1, 15)
    }
}

function createMaterial() {
    'use strict';
    
    var ball_texture = createTexture("textures/Lenna.png", false);
    var dice_textures = [];

    for(let i = 1; i <= 6; i++) {
        let texture = createTexture("textures/die-" + i + ".png", false);
        dice_textures.push(texture);
    }

    material = {
        basic: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
        ball: ball_texture,
        dice: dice_textures,
        chessboard: new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    }
}

function createTexture(texture_path, bump_map) {
    'use strict';

    // create a texture loader.
    var textureLoader = new THREE.TextureLoader();

    // Load a texture. See the note in chapter 4 on working locally, or the page
    // https://threejs.org/docs/#manual/introduction/How-to-run-things-locally
    // if you run into problems here
    var texture = textureLoader.load(texture_path);

    // set the "color space" of the texture
    texture.encoding = THREE.sRGBEncoding;

    // reduce blurring at glancing angles
    texture.anisotropy = 16;

    if(bump_map) {
        var material_texture = new THREE.MeshStandardMaterial({
            bumpMap: texture,
        });
    }
    else {
        var material_texture = new THREE.MeshStandardMaterial({
            map: texture,
        });
    }

    return material_texture;
}

function createBall() {
    'use strict';

    ball = new THREE.Mesh(geometry.ball, material.ball);
    ball.position.set(5, 2.5, 5);
    scene.add(ball);
}

function createDice() {
    'use strict';

    dice = new THREE.Mesh(geometry.dice, material.dice);
    dice.position.set(0, 5, 0);
    dice.rotation.set(Math.PI / 4, Math.PI / 4, 0);
    scene.add(dice);
}

function createChessboard() {
    'use strict';

    chessboard = new THREE.Mesh(geometry.chessboard, material.chessboard);
    scene.add(chessboard);
}

function createRenderer() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function update() {
    'use strict';

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

