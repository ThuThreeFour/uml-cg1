$(document).ready(function () {
// global variables
    var renderer;
    var scene;
    var camera;
    var isTweening = false;
    var controls;


    var collidableMeshList = [];

    var width = 150;


    this.forward = function () {
        takeStepForward(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 100);
    };
    this.back = function () {
    };
    this.left = function () {
    };
    this.right = function () {
    };


    $('#forward').click(function () {
        takeStepForward(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 100);
    });

    $('#backward').click(function () {
        takeStepBackward(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 100);
    });

    $('#left').click(function () {
        takeStepLeft(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 100);
    });

    $('#right').click(function () {
        takeStepRight(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 100);
    });

    function createCube() {

        var cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        var cubeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, metal: true, shininess: 10});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.name = 'cube';
        cube.position = new THREE.Vector3(width / 2 - 3, 1, width / 2 - 3);
        scene.add(cube);
        return cube;
    }

    /**
     * Initializes the scene, camera and objects. Called when the window is
     * loaded by using window.onload (see below)
     */
    function init() {



        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new THREE.Scene();


        // generate a maze
        var wallTexture = THREE.ImageUtils.loadTexture("../textures/grass.jpg");
        var maze = new Maze(scene, 15, width, width, wallTexture);
        maze.generate();
        maze.draw();
        var walls = maze.getElements();
        walls.forEach(function (e) {
            collidableMeshList.push(e)
        });


        // add cube
        createCube();


        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        // create a render, sets the background color and the size
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x000000, 1.0);
        renderer.antialias = true;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(width, width, 40, 40);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0x000000});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        planeMaterial.side = THREE.DoubleSide;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
//        plane.position.y = ;

        // add the plane to the scene
        scene.add(plane);

        var startWall = new THREE.BoxGeometry(10, 2, 1);
        var startMesh = new THREE.Mesh(startWall);
        startMesh.position.set(width / 2 - 5, 0, width / 2);
        scene.add(startMesh);
        collidableMeshList.push(startMesh);

        var endWall = new THREE.BoxGeometry(10, 2, 1);
        var endMesh = new THREE.Mesh(endWall);
        endMesh.position.set(-width / 2 + 5, 0, -width / 2);
        scene.add(endMesh);
        collidableMeshList.push(endMesh);

        // position and point the camera to the center of the scene
        camera.position.x = 70;
        camera.position.y = 100;
        camera.position.z = 170;
        camera.lookAt(new THREE.Vector3(10, 0, 35));
        controls = new THREE.TrackballControls(camera);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xff0000);
        spotLight.position.set(-50, 70, -50);
        spotLight.shadowCameraNear = 20;
        spotLight.shadowCameraFar = 50;
        spotLight.castShadow = true;
//        spotLight.angle = 0.3;
        spotLight.intensity = 0.5;
        var target = new THREE.Object3D();
        target.position.set(-60, 0, -60);
        spotLight.target = target;

        // add spotlight for the shadows
        var spotLight2 = new THREE.SpotLight(0x00ff00);
        spotLight2.position.set(50, 70, 50);
//        spotLight2.angle = 0.3;
        spotLight2.shadowCameraNear = 10;
        spotLight2.shadowCameraFar = 50;
        spotLight2.castShadow = true;
        spotLight2.intensity = 0.5;
        var target2 = new THREE.Object3D();
        target2.position.set(60, 0, 60);
        spotLight2.target = target2;
        scene.add(spotLight2);

        var directionalLight = new THREE.DirectionalLight({color: 0xaaaaaa});
        directionalLight.castShadow = true;
        directionalLight.position.set(0, 50, 50);
        directionalLight.intensity = 0.6;
        scene.add(directionalLight);

        scene.add(spotLight);


        $('body').append('<div id="canvas-ctrl-container"> <div id="ctrl-container"></div> </div>');
        // add the output of the renderer to the html element
        $(renderer.domElement).appendTo('div#canvas-ctrl-container');

        // call the render function, after the first render, interval is determined
        // by requestAnimationFrame
        render();
    }


    /**
     * Called when the scene needs to be rendered. Delegates to requestAnimationFrame
     * for future renders
     */
    function render() {

        // and render the scene
        renderer.render(scene, camera);

        TWEEN.update();

        detectCollision();

        controls.update();

        // render using requestAnimationFrame
        requestAnimationFrame(render);
    }

    function detectCollision() {
        // collision detection:
        //   determines if any of the rays from the cube's origin to each vertex
        //		intersects any face of a mesh in the array of target meshes
        //   for increased collision accuracy, add more vertices to the cube;
        //		for example, new THREE.BoxGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
        //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
        var cube = scene.getObjectByName('cube');
        var originPoint = cube.position.clone();


        for (var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++) {
            var localVertex = cube.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(cube.matrix);
            var directionVector = globalVertex.sub(cube.position);

            var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(collidableMeshList);

            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {

                // if we've got a hit, we just stop the current walk and reset to base point
                var tweens = TWEEN.getAll();

                if (tweens.length > 0) {

                    tweens[0].stop();
                    TWEEN.removeAll();
                    isTweening = false;

                    scene.remove(cube);
                    cube = createCube();
                }
            }
        }
    }

    function takeStepRight(cube, start, end, time) {
        var cubeGeometry = cube.geometry;
        var widht = 2;
        if (!isTweening) {
            var tween = new TWEEN.Tween({x: start, cube: cube, previous: 0})
                .to({x: end}, time)
                .easing(TWEEN.Easing.Linear.None)
                .onStart(function () {
                    isTweening = true;
                    cube.position.y += -widht / 2;
                    cube.position.z += -widht / 2;
                    cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, widht / 2, widht / 2));
                })
                .onUpdate(function () {
                    cube.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-(this.x - this.previous)));
                    cube.geometry.verticesNeedUpdate = true;
                    cube.geometry.normalsNeedUpdate = true;
                    this.previous = this.x;
                })
                .onComplete(function () {
                    cube.position.y += widht / 2;
                    cube.position.z += -widht / 2;
                    cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -widht / 2, widht / 2));
                    cube.position.x = Math.round(cube.position.x);
                    cube.position.y = Math.round(cube.position.y);
                    cube.position.z = Math.round(cube.position.z);
                    isTweening = false;
                })
                .start();
        }
    }

    function takeStepLeft(cube, start, end, time) {
        var cubeGeometry = cube.geometry;
        var widht = 2;
        if (!isTweening) {
            var tween = new TWEEN.Tween({x: start, cube: cube, previous: 0})
                .to({x: end}, time)
                .easing(TWEEN.Easing.Linear.None)
                .onStart(function () {
                    isTweening = true;
                    cube.position.y += -widht / 2;
                    cube.position.z += widht / 2;
                    cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, widht / 2, -widht / 2));
                })
                .onUpdate(function () {
                    cube.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(this.x - this.previous));
                    cube.geometry.verticesNeedUpdate = true;
                    cube.geometry.normalsNeedUpdate = true;
                    this.previous = this.x;
                })
                .onComplete(function () {
                    cube.position.y += widht / 2;
                    cube.position.z += widht / 2;
                    cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -widht / 2, -widht / 2));
                    cube.position.x = Math.round(cube.position.x);
                    cube.position.y = Math.round(cube.position.y);
                    cube.position.z = Math.round(cube.position.z);
                    isTweening = false;
                })
                .start();
        }
    }

    function takeStepBackward(cube, start, end, time) {
        var widht = 2;
        var cubeGeometry = cube.geometry;

        if (!isTweening) {
            var tween = new TWEEN.Tween({x: start, cube: cube, previous: 0})
                .to({x: end}, time)
                .easing(TWEEN.Easing.Linear.None)
                .onStart(function () {

                    isTweening = true;
                    cube.position.y += -widht / 2;
                    cube.position.x += widht / 2;
                    cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(-widht / 2, widht / 2, 0));
                })
                .onUpdate(function () {
                    cube.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(-(this.x - this.previous)));
                    cube.geometry.verticesNeedUpdate = true;
                    cube.geometry.normalsNeedUpdate = true;
                    cube.previous = this.x;
                    this.previous = this.x;
                })
                .onComplete(function () {
                    cube.position.y += widht / 2;
                    cube.position.x += widht / 2;

                    cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(-widht / 2, -widht / 2, 0));

                    cube.position.x = Math.round(cube.position.x);
                    cube.position.y = Math.round(cube.position.y);
                    cube.position.z = Math.round(cube.position.z);

                    isTweening = false;
                })
                .start();
        }
    }

    function takeStepForward(cube, start, end, time) {
        var widht = 2;
        var cubeGeometry = cube.geometry;


        if (!isTweening) {
            var tween = new TWEEN.Tween({x: start, cube: cube, previous: 0})
                .to({x: end}, time)
                .easing(TWEEN.Easing.Linear.None)
                .onStart(function () {
                    isTweening = true;
                    cube.position.y += -widht / 2;
                    cube.position.x += -widht / 2;
                    cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(widht / 2, widht / 2, 0));
                })
                .onUpdate(function () {
                    cube.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ((this.x - this.previous)));

                    cube.geometry.verticesNeedUpdate = true;
                    cube.geometry.normalsNeedUpdate = true;

                    cube.previous = this.x;
                    this.previous = this.x;
                })
                .onComplete(function () {
                    cube.position.y += widht / 2;
                    cube.position.x += -widht / 2;
                    cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(widht / 2, -widht / 2, 0));

                    cube.position.x = Math.round(cube.position.x);
                    cube.position.y = Math.round(cube.position.y);
                    cube.position.z = Math.round(cube.position.z);

                    isTweening = false;
                })
                .start();
        }
    }


    /**
     * Function handles the resize event. This make sure the camera and the renderer
     * are updated at the correct moment.
     */
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

// calls the init function when the window is done loading.
    window.onload = init;
// calls the handleResize function when the window is resized
    window.addEventListener('resize', handleResize, false);
});