var cameras = [];
var current_camera = 0;
var renderer;
var scene;
var clock = new THREE.Clock();
var delta = 0;
var is_scene_paused = 0;
var pause_image;
var acceleration = 0;
var increase_speed = 0.5;
var speed_up = 0;
var speed_up_toggler = 1;

var light_flags = [false, false];
var lights = [];
var current_material = "standard";
var wireframe = false;

var geometry;
var material;
var chessboard;
var dice;
var ball;
var pivot;
var pivot_dice;

function init() {
    'use strict';

    create_scene();
}

function create_scene(){
    'use strict';
    scene = new THREE.Scene();
    

    delta = clock.getDelta();
    createCamera();
    createLights();
    createMeshes();
    createRenderer();
    console.log(scene.position);

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keydown", onKeyDown);
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
    cameras[0].position.z = 0;
    cameras[0].lookAt(scene.position);

    cameras[1] = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    cameras[1].position.x = 60;
    cameras[1].position.y = 10;
    cameras[1].position.z = 0;
    cameras[1].lookAt(100,10,0);
}



function createLights() {
    'use strict';

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    lights.push(directionalLight);

    /*
    var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(directionalLightHelper)
    */

    var pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(2, 10, 2);
    scene.add(pointLight);
    lights.push(pointLight);

    /*
    var sphereSize = 1;
    var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    scene.add(pointLightHelper);
    */    
}

function createMeshes() {
    'use strict';

    createGeometries();
    createMaterial();
    createBall();
    createDice();
    createChessboard();
    create_pause_image();
    create_pivot();
}

function create_pivot(){
    pivot = new THREE.Object3D();
    pivot_dice = new THREE.Object3D();
    pivot_dice.position.set(0,0,0);
    pivot.position.set(0, 0, 0);
    pivot_dice.add(dice);
    pivot.add(ball);
    scene.add(pivot_dice);
    scene.add(pivot);
}

function createGeometries() {
    'use strict';
    
    geometry = {
        ball: new THREE.SphereBufferGeometry(2, 32, 32),
        dice: new THREE.BoxBufferGeometry(5, 5, 5),
        chessboard: new THREE.BoxBufferGeometry(25, 1, 25)
    }
}

function create_pause_image() {
    var pause_graphics = createTexture("textures/Pause.png", false);
    var geo = new THREE.BoxGeometry(15,15,15);

    console.log("Here");

    pause_image = new THREE.Mesh(geo, pause_graphics);
    pause_image.message = pause_graphics;
    pause_image.position.set(100,10,0);
    scene.add(pause_image);
}

function createMaterial() {
    'use strict';
    
    var ball_texture = createTexture("textures/Lenna.png", false);
    var chessboard_texture = createTexture(
        "textures/chessboard_bumpmap2.jpg",
        true
        );
    
    var dice_textures = [];

    for(let i = 1; i <= 6; i++) {
        let texture = createTexture("textures/die-" + i + ".png", false);
        dice_textures.push(texture);
    }

    material = {
        basic: new THREE.MeshBasicMaterial({ color: 0xffffff }),
        ball: ball_texture,
        dice: dice_textures,
        chessboard: chessboard_texture
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
            color: 0x4d2c15,
            metalness: 0.0
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
    ball.acc = 0;
    ball.attrition = 0;
    ball.w = 0;
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
    if(is_scene_paused == 0){
        delta = clock.getDelta();
    }
    rotate_cube();
    anda_bolinha();
}

function animate() {
    'use strict';

    requestAnimationFrame(animate);
    update();
    render();
}
function render() {
    'use strict';

    renderer.render(scene, cameras[current_camera]);
}

function onWindowResize() {
    'use strict';

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        cameras[0].aspect = window.innerWidth / window.innerHeight;
        cameras[0].updateProjectionMatrix();
    }
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        cameras[1].aspect = window.innerWidth / window.innerHeight;
        cameras[1].updateProjectionMatrix();
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
    'use strict';

    if (event.key == "d") {
        console.log("D");
        light_flags[0] = true;
    }

    if (event.key == "p") {
        console.log("P");
        light_flags[1] = true;
    }

    if (event.key == "w") {
        changeWireframe();
    }
    
    if (event.key == "l") {
        console.log("L");
        changeTextures();   
    }
    
    if (event.key == "b") {
        if(speed_up != 1){
            speed_up = 1;
        }
        else if(speed_up == 1){
            speed_up = -1;
        }
        //speed_up = speed_up_toggler;
        //speed_up_toggler *= -1;
    }
    
    if (event.key == "r") {
        if(is_scene_paused == 1){
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }
            create_scene();
        }
    }

    if (event.key == "s") {
        pause_unpause_scene();
    }

    changeLight();
}

function pause_unpause_scene(){

    if (is_scene_paused == 0){
        is_scene_paused = 1;
        delta = 0;
        rotate_cube();
        current_camera = 1;
        
    }
    else{
        delta = clock.getDelta();
        is_scene_paused = 0;
        current_camera = 0;
    }
}

function changeLight() {
    'use strict';

    for(var i = 0; i < lights.length; i++) {
        if(light_flags[i]) {
            light_flags[i] = false;

            if(lights[i].intensity == 0) {
               lights[i].intensity = 1; 
            }
            else {
                lights[i].intensity = 0;
            }
        }
    }
}

function changeTextures() {
    'use strict';

    if(wireframe) {
        return;
    }

    if(current_material == "standard") {
        current_material = "basic";
        chessboard.material = material.basic;
        ball.material = material.basic;
        dice.material = material.basic;
    }
    else {
        current_material = "standard";
        chessboard.material = material.chessboard;
        ball.material = material.ball;
        dice.material = material.dice;
    }
}

function changeWireframe() {
    'use strict';

    if(wireframe) {
        wireframe = false;
        ball.material.wireframe = wireframe;
        chessboard.material.wireframe = wireframe;
        dice.material.wireframe = wireframe;
        dice.material = material.dice;
    }
    else {
        wireframe = true;
        ball.material.wireframe = wireframe;
        chessboard.material.wireframe = wireframe;
        dice.material = material.basic;
        dice.material.wireframe = wireframe;
    }
}

function rotate_cube(){
    /*var pivot = new THREE.Object3D();
    pivot.add(dice);
    scene.add(pivot);*/
    pivot_dice.rotation.y += Math.PI / 10 * delta;
    //dice.rotation.y += Math.PI / 10 * delta;
        //dice.geometry.center();
        //dice.geometry.translate(Math.PI / 100 * delta, 0, Math.PI / 100 * delta);
    //console.log(delta);
}

function anda_bolinha(){
    if (speed_up == 1 && ball.acc < 300){
        pivot.rotation.y += Math.PI / 100 * delta * ball.acc;
        ball.acc += 0.2 * speed_up;
        console.log("OLA");
    }
    else if (speed_up == 1 && ball.acc >= 30){
        pivot.rotation.y += Math.PI / 100 * delta * ball.acc;
    }
    else if (speed_up == -1 && ball.acc <= 0){
        pivot.rotation.y += 0;
    }
    else if (speed_up == -1 && ball.acc > 0){
        pivot.rotation.y += Math.PI / 100 * delta * ball.acc;
        ball.acc += 0.2 * speed_up;
    }
    // console.log(ball.acc);
    // console.log(speed_up);
}
