$( document ).ready(function() {

// global variables
    var renderer;
    var scene;
    var camera;
    var control;
    var stats;
    var modelName;

    $('#submit').click(function (event) {
        $('#canvas-ctrl-container').remove();
        $('body').append('<div id="canvas-ctrl-container"> <div id="ctrl-container"></div> </div>');

        var primitive = $('#primitive').val();
        modelName = primitive;

        init();
        event.preventDefault();

    });

    /**
     * Initializes the scene, camera and objects. Called when the window is
     * loaded by using window.onload (see below)
     */
    function init() {

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        // create a render, sets the background color and the size
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xFFFFFF, 1.0);
        renderer.setSize(1300, 521);
        renderer.shadowMapEnabled = true;

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(20, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = -2;
        plane.position.z = 0;


        // position and point the camera to the center of the scene
        camera.position.x = 3;
        camera.position.y = 3;
        camera.position.z = 3;
        camera.lookAt(scene.position);


        // setup the control object for the control gui
        control = new function () {
            this.rotationSpeed = 0.005;
        };

        // add extras
        addControlGui(control);

        loadModel();


        // add the output of the renderer to the html element
        $(renderer.domElement).appendTo('div#canvas-ctrl-container');

        // call the render function, after the first render, interval is determined
        // by requestAnimationFrame
        render();
    }

    function loadModel() {
        var loader = new THREE.JSONLoader();
        loader.load('../models/' + modelName + '.js',
            function (model) {
                var material = new THREE.MeshNormalMaterial();

                var mesh = new THREE.Mesh(model, material);

                mesh.translateY(-0.1);
                mesh.scale = new THREE.Vector3(5, 5, 5);

                scene.add(mesh);
            });
    }


    function addControlGui(controlObject) {
        var gui = new dat.GUI({ autoPlace: false });
        gui.add(controlObject, 'rotationSpeed', -0.01, 0.01);

        var customContainer = document.getElementById('ctrl-container');
        customContainer.appendChild(gui.domElement);
    }


    /**
     * Called when the scene needs to be rendered. Delegates to requestAnimationFrame
     * for future renders
     */
    function render() {
        // update the camera
        var rotSpeed = control.rotationSpeed;
        camera.position.x = camera.position.x * Math.cos(rotSpeed) + camera.position.z * Math.sin(rotSpeed);
        camera.position.z = camera.position.z * Math.cos(rotSpeed) - camera.position.x * Math.sin(rotSpeed);
        camera.lookAt(scene.position);

        // and render the scene
        renderer.render(scene, camera);

        // render using requestAnimationFrame
        requestAnimationFrame(render);
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

});