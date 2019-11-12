var cameras;
var camera_num = 1;
var scene, renderer
var lights;
var lamps = [];
var counter = 0;

var light_flag = [false, false, false, false, false];
var basic_flag = false;
var shadow_flag = false;
var shadow_state = "phong";

var isPhong = true;

var walls;
var floor;
var icosahedron;
var pedestal;
var masterpiece;
var clock = new THREE.Clock();

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    createScene();
    createStationaryCameras();
    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    window.addEventListener("keyup", onKeyUp);
}

function update(delta) {
    'use strict';

}

function check_lights() {
    for(var i = 0; i < 5; i++) {
        if(light_flag[i]) {
            light_flag[i] = false;
            if(lights[i].intensity > 0) {
                lights[i].intensity = 0;
            }
            else {
                lights[i].intensity = 1;
            }
        }
    }
}

function check_material() {
    if(basic_flag) {
        basic_flag = false;

        if(pedestal.material.isMeshBasicMaterial) {
            var current_material = pedestal.data["current_material"];
            pedestal.material = pedestal.data[current_material];
            icosahedron.material = icosahedron.data[current_material];
            floor.material = floor.data[current_material];

            var wallmeshes = walls.children;
            for (var mesh of wallmeshes) {
                mesh.material = mesh.data[current_material];
            }
            var artmeshes = masterpiece.children;
            for (var mesh of artmeshes) {
                mesh.material = mesh.data[current_material];
            }
        }
        else {
            console.log("basic");
            pedestal.material = pedestal.data["basic_material"];
            icosahedron.material = icosahedron.data["basic_material"];
            floor.material = floor.data["basic_material"];

            var wallmeshes = walls.children;
            for (var mesh of wallmeshes) {
                mesh.material = mesh.data["basic_material"];
            }
            var artmeshes = masterpiece.children;
            for (var mesh of artmeshes) {
                mesh.material = mesh.data["basic_material"];
            }
        }
        return;
    }
    if(shadow_flag) {
        shadow_flag = false;

        if(pedestal.material.isMeshPhongMaterial) {
            console.log("lambert");
            
            pedestal.data["current_material"] = "lambert_material";
            pedestal.material = pedestal.data["lambert_material"];
            icosahedron.material = icosahedron.data["lambert_material"];
            floor.material = floor.data["lambert_material"];

            var wallmeshes = walls.children;
            for (var mesh of wallmeshes) {
                mesh.material = mesh.data["lambert_material"];
            }
            var artmeshes = masterpiece.children;
            for (var mesh of artmeshes) {
                mesh.material = mesh.data["lambert_material"];
            }
        }
        else if(pedestal.material.isMeshLambertMaterial) {
            console.log("phong");

            pedestal.data["current_material"] = "phong_material";
            pedestal.material = pedestal.data["phong_material"];
            icosahedron.material = icosahedron.data["phong_material"];
            floor.material = floor.data["phong_material"];

            var wallmeshes = walls.children;
            for (var mesh of wallmeshes) {
                mesh.material = mesh.data["phong_material"];
            }
            var artmeshes = masterpiece.children;
            for (var mesh of artmeshes) {
                mesh.material = mesh.data["phong_material"];
            }
        }
    }
}

function animate() {
    'use strict';

    var delta = clock.getDelta();
    update(delta);
    render();
    requestAnimationFrame(animate);
}

function render() {
    'use strict';
    
    renderer.render(scene, cameras[camera_num])
}

function onResize() {
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

function createScene() {
    'use strict';
    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(10));

    create_floor();
    create_walls();
    create_masterpiece();
    create_pedestal();
    createLights();
    createCenas();
}

function createStationaryCameras() {
    'use strict';
    cameras = [];
    
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
    
    lights = [];

    // Directional Lights
    lights[0] = new THREE.DirectionalLight(0xffffff, 0.5);
    lights[0].position.set(0, 10, 0);
    scene.add(lights[0]);

    //Spotlights
    for(var i = 1; i <= 4; i++) {
        var spotLight = new THREE.SpotLight(0xffffff);

        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;

        if(i == 1){
            spotLight.position.set(-8, 10, 0);
            spotLight.target.position.set(30,0,0);
        }
        if (i == 2) {
            spotLight.target.position.set(0, 0, 0);
        }
        if (i == 3) {
            spotLight.target.position.set(0, 0, 0);
        }
        if (i == 4) {
            spotLight.target.position.set(-30, 0, 0);
        }

        scene.add(spotLight,spotLight.target);
        lights[i] = spotLight;
        var spotLightHelper = new THREE.SpotLightHelper(spotLight);
        scene.add(spotLightHelper);
    }
}

function createCenas(){
    'use strict';

    create_lamp(-8, 10, 20, Math.PI / 3, Math.PI / 6,1);
    create_lamp(-3, 10, 20, Math.PI / 3, Math.PI / 8,2);
    create_lamp(3, 10, 20, Math.PI / 3, Math.PI / -8,3);
    create_lamp(8, 10, 20, Math.PI / 3, Math.PI / -6,4);

    //lamps.position.set(0,0,0);
    //scene.add(lamps);

}

function create_lamp(x,y,z,rot_x,rot_z, light_index){
    'use strict';
    var target_object = new THREE.Object3D();

    var cone_geo = new THREE.ConeGeometry(2,5,32);
    var sphere_geo = new THREE.SphereGeometry(1,32,32);
    var cone_material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    var sphere_material = new THREE.MeshBasicMaterial({ color: 0x696969 });
    var cone = new THREE.Mesh(cone_geo,cone_material);
    var sphere = new THREE.Mesh(sphere_geo,sphere_material);
    sphere.position.set(x,y,z);
    sphere.add(cone);
    sphere.rotation.x = rot_x;
    sphere.rotation.z = rot_z;
    sphere.light = lights[light_index];
    console.log(sphere.light.target.position);
    sphere.is_on = light_flag[light_index];

    sphere.switch = function(){
        'use strict';
        this.is_on = !this.is_on;
        //light_flag[light_index] = !light_flag[light_index];

        if(this.is_on){
            this.material.color.setHex(0xAB6E06);
        }
        else{
            this.material.color.setHex(0x696969);
        }
    };
    lamps[counter++] = sphere;
    scene.add(sphere);
}

function onKeyDown(event) {
    'use strict';
    if(event.key == "1") {
        // var wallmeshes = walls.children;
        // for(var mesh of wallmeshes) {
        //     mesh.material = mesh.data.basic_material;
        // }
        light_flag[1] = true; 
        lamps[0].switch();
        check_lights();
    }
    if(event.key == "2") {
        light_flag[2] = true; 
        lamps[1].switch();
        check_lights();
    }
    if(event.key == "3") {
        light_flag[3] = true;   
        lamps[2].switch();
        check_lights();      
    }
    if(event.key == "4") {
        light_flag[4] = true;
        lamps[3].switch();
        check_lights();
    }
    if(event.key == "5") {
        camera_num = 0;
    }
    if(event.key == "6") {
        camera_num = 1;
    }
    if(event.key == "q") {
        light_flag[0] = true; 
        check_lights();
    }
    if(event.key == "w") {
        basic_flag = true;
        check_material();
    }
    if (event.key == "e") {
        shadow_flag = true;
        check_material();
    }
}

function onKeyUp(event){
    'use strict';

}

function create_floor() {
    var phong_material = new THREE.MeshPhongMaterial({ color: 0x292929, wireframe: false });
    var lambert_material = new THREE.MeshLambertMaterial({ color: 0x292929, wireframe: false });
    var basic_material = new THREE.MeshBasicMaterial({ color: 0x292929, wireframe: false });

    var geometry = new THREE.BoxGeometry(40, 2, 40);
    floor = new THREE.Mesh(geometry, phong_material);
    floor.data = {
        "phong_material": phong_material,
        "lambert_material": lambert_material,
        "basic_material": basic_material
    };

    floor.position.set(0, -20, 18);
    scene.add(floor);
}

function create_walls() {
    'use strict';

    walls = new THREE.Object3D();

    create_wall_unit(-20, 10, 18, 0);
    create_wall_unit(0, 10, -2, Math.PI/2);

    scene.add(walls);
}

function create_wall_unit(x, y, z, pos) {
    'use strict';

    var phong_material = new THREE.MeshPhongMaterial({ color: 0x292929, wireframe: false});
    var lambert_material = new THREE.MeshLambertMaterial({ color: 0x292929, wireframe: false });
    var basic_material = new THREE.MeshBasicMaterial({ color: 0x292929, wireframe: false });

    var geometry = new THREE.BoxGeometry(2, 40, 40);
    var mesh = new THREE.Mesh(geometry, phong_material); 
    mesh.data = {
        "phong_material": phong_material,
        "lambert_material": lambert_material,
        "basic_material": basic_material
    };
    mesh.position.set(x, y-10, z);
    mesh.rotation.y = pos;
    walls.add(mesh);
}


function create_masterpiece() {
    'use strict';
    masterpiece = new THREE.Object3D();
    var x = 0;
    var y = 0;
    var z = 0;
    masterpiece.position.set(x, y, z);

    create_frame(x, y, z);
    create_art(x, y, z + 1);
    scene.add(masterpiece);
}

function create_frame(x, y, z) {
    'use strict';

    var phong_material = new THREE.MeshPhongMaterial({ color: 0x9e7155, wireframe: false});
    var lambert_material = new THREE.MeshLambertMaterial({ color: 0x9e7155, wireframe: false });
    var basic_material = new THREE.MeshBasicMaterial({ color: 0x9e7155, wireframe: false });

    var geometry = new THREE.BoxGeometry(22, 34, 2);
    var frame_mesh = new THREE.Mesh(geometry, phong_material);
    frame_mesh.data = {
        "phong_material": phong_material,
        "lambert_material": lambert_material,
        "basic_material": basic_material
    };
    frame_mesh.position.set(x, y, z);
    masterpiece.add(frame_mesh);
}

function create_art(x, y, z) {
    'use strict';

    var phong_material = new THREE.MeshPhongMaterial({ color: 0x000000, wireframe: false});
    var lambert_material = new THREE.MeshLambertMaterial({ color: 0x000000, wireframe: false });
    var basic_material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false });

    var w = 21;
    var h = 33;
    var d = 1;
    var geometry = new THREE.BoxGeometry(w, h, d);
    var background_mesh = new THREE.Mesh(geometry, phong_material);
    background_mesh.data = {
        "phong_material": phong_material,
        "lambert_material": lambert_material,
        "basic_material": basic_material
    };
    background_mesh.position.set(x, y, z);
    masterpiece.add(background_mesh);
    create_circles(x, y, z + 1, w, h);
}

function create_circles(x, y, z, w, h) {
    'use strict';

    var xmin = x - w / 2;
    var xmax = x + w / 2;
    var ymin = y - h / 2;
    var ymax = y + h / 2;
    var radius = 0.5;
    var gap = 4;
    var i;
    var j;
    for(i = xmin + gap; i < xmax - gap; i += gap) {
        for(j = ymin + gap; j < ymax - gap; j += gap) {
            var phong_material = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false});
            var lambert_material = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false });
            var basic_material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });

            var geometry = new THREE.CylinderGeometry(radius, radius, 1);
            var circle_mesh = new THREE.Mesh(geometry, phong_material);
            circle_mesh.data = {
                "phong_material": phong_material,
                "lambert_material": lambert_material,
                "basic_material": basic_material
            };
            circle_mesh.position.set(i, j, z);
            circle_mesh.rotation.x = Math.PI / 2
            masterpiece.add(circle_mesh);

            var phong_material = new THREE.MeshPhongMaterial({ color: 0xc7c7c7, wireframe: false});
            var lambert_material = new THREE.MeshLambertMaterial({ color: 0xc7c7c7, wireframe: false });
            var basic_material = new THREE.MeshBasicMaterial({ color: 0xc7c7c7, wireframe: false });

            var geometry = new THREE.BoxGeometry(0.5, gap, 1);
            var line_mesh = new THREE.Mesh(geometry, phong_material);
            line_mesh.data = {
                "phong_material": phong_material,
                "lambert_material": lambert_material,
                "basic_material": basic_material
            };

            var phong_material = new THREE.MeshPhongMaterial({ color: 0xc7c7c7, wireframe: false});
            var lambert_material = new THREE.MeshLambertMaterial({ color: 0xc7c7c7, wireframe: false });
            var basic_material = new THREE.MeshBasicMaterial({ color: 0xc7c7c7, wireframe: false });

            var geometry = new THREE.BoxGeometry(0.5, gap, 1);
            var aux_mesh = new THREE.Mesh(geometry, phong_material);
            aux_mesh.data = {
                "phong_material": phong_material,
                "lambert_material": lambert_material,
                "basic_material": basic_material
            };
            line_mesh.position.set(i, j, z - 1);
            aux_mesh.position.set(i, j, z - 1);
            aux_mesh.rotation.z = Math.PI / 2;
            masterpiece.add(aux_mesh);
            masterpiece.add(line_mesh);
        }
    }


}

function create_pedestal() {
    'use strict';

    var geometry = new THREE.BoxGeometry(2, 20, 2);
    var phong_material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    var lambert_material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var basic_material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    pedestal = new THREE.Mesh(geometry, phong_material);
    pedestal.data = {
        "current_material": "phong_material",
        "phong_material": phong_material,
        "lambert_material": lambert_material,
        "basic_material": basic_material
    };
    pedestal.position.set(-5, -5, 10);

    create_icosaedro(0, 11, 0);
    pedestal.add(icosahedron);
    scene.add(pedestal);
}

function create_icosaedro(x, y, z) {
    'use strict';

    const phi = (1 + Math.sqrt(5)) / 2;
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(-1 * Math.random(), phi, 0),
        new THREE.Vector3(1, phi, 0),
        new THREE.Vector3(-1, -phi, 0),
        new THREE.Vector3(1, -phi, 0),
        new THREE.Vector3(0, -1, phi),
        new THREE.Vector3(0, 1 * Math.random(), phi),
        new THREE.Vector3(0, -1, -phi),
        new THREE.Vector3(0, 1, -phi),
        new THREE.Vector3(phi, 0, -1),
        new THREE.Vector3(phi, 0, 1 * Math.random()),
        new THREE.Vector3(-phi, 0, -1),
        new THREE.Vector3(-phi, 0, 1)
    )
    geometry.faces.push(
        new THREE.Face3(0, 11, 5),
        new THREE.Face3(1, 5, 9),
        new THREE.Face3(3, 9, 4),
        new THREE.Face3(4, 9, 5),
        new THREE.Face3(0, 5, 1),
        new THREE.Face3(5, 11, 4),
        new THREE.Face3(3, 4, 2),
        new THREE.Face3(2, 4, 11),
        new THREE.Face3(0, 1, 7),
        new THREE.Face3(11, 10, 2),
        new THREE.Face3(3, 2, 6),
        new THREE.Face3(6, 2, 10),
        new THREE.Face3(0, 7, 10),
        new THREE.Face3(10, 7, 6),
        new THREE.Face3(3, 6, 8),
        new THREE.Face3(8, 6, 7),
        new THREE.Face3(0, 10, 11),
        new THREE.Face3(7, 1, 8),
        new THREE.Face3(3, 8, 9),
        new THREE.Face3(9, 8, 1)
    )
    geometry.computeVertexNormals();
    var phong_material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    var lambert_material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var basic_material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    icosahedron = new THREE.Mesh(geometry, phong_material);
    icosahedron.data = {
        "phong_material": phong_material,
        "lambert_material": lambert_material,
        "basic_material": basic_material
    };
    icosahedron.position.set(x, y, z);
    scene.add(icosahedron);
}

