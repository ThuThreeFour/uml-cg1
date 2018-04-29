$(document).ready(function () {

    $('#submit').click(function (event) {
        $('#canvas-ctrl-container').remove();
        $('div.dg').remove();
        $('body').append('<div id="canvas-ctrl-container"> <div id="ctrl-container"></div> </div>');

        var checkBoxes = ['earthmap4k', 'fair_clouds_4k', 'earthbump4k', 'moonbump4k'],
            checked = [],
            count = $( "input:checked" ).length;

        checkBoxes.forEach(function (texture) {
            if ($('#' + texture + ":checked").val()) checked.push(texture);
        });

        if (count == 2) {
            modelName = 'sphere';
            property = 200;
            property1 = 200;
            property2 = 200;

            if (checked[0] == 'fair_clouds_4k') {
                checked[0] = checked[1];
                checked[1] = 'fair_clouds_4k';
            }
            // initialize the view
            init(modelName, checked[0], checked[1], property, property1, property2);

            event.preventDefault();

        } else {
            alert('You must choose 2 textures, no more, no less.');
            event.preventDefault();
            return;
        }

    });

// global variables
    var renderer;
    var scene;
    var stats;
    var camera;
    var cameraControl;

    var control;

    function init(geometry, texture1, texture2, property, property1, property2) {

        scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        // create a render, sets the background color and the size
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x000000, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;


        // position and point the camera to the center of the scene
        camera.position.x = -500;
        camera.position.y = 200;
        camera.position.z = 300;
        camera.lookAt(scene.position);

        var directionalLight = new THREE.DirectionalLight();
        scene.add(directionalLight);
        directionalLight.position.set(-500, 200, 300);

        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);

        // add controls
        cameraControl = new THREE.OrbitControls(camera);

        control = new function () {
            this.rotationSpeed = 0.001;
        };

        addControls(control);

        addGeometry(2, 2, texture1, texture2, property, property1, property2);

        // draw cloud bumps
        var cloudGeometry = new THREE.SphereGeometry(property + .25, property1, property2);
        var cloudMaterial = createCloudMaterial('fair_clouds_4k');
        var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloudMesh.name = 'cloudsBump';
        cloudMesh.position.x = 60 * 1 - 50;
        cloudMesh.position.y = 0;
        cloudMesh.position.z = 60 * 1 - 50;
        scene.add(cloudMesh);

        // add the output of the renderer to the html element
        $(renderer.domElement).appendTo('div#canvas-ctrl-container');


        // call the render function
        render();
    }

    function createEarthMaterial(texture) {
        // 4096 is the maximum width for maps
        if (texture == 'fair_clouds_4k') {
            texture += '.png';
        } else {
            texture += '.jpg';
        }
        var earthTexture = THREE.ImageUtils.loadTexture("./textures/planets/" + texture);

        var earthMaterial = new THREE.MeshBasicMaterial();
        earthMaterial.map = earthTexture;

        return earthMaterial;
    }

    function createCloudMaterial(texture) {
        if (texture == 'fair_clouds_4k') {
            texture += '.png';
        } else {
            texture += '.jpg';
        }

        var cloudTexture = THREE.ImageUtils.loadTexture("./textures/planets/"+ texture);

        var cloudMaterial = new THREE.MeshBasicMaterial();
        cloudMaterial.map = cloudTexture;
        cloudMaterial.transparent = true;


        return cloudMaterial;
    }

    function addGeometry(x, y, texture1, texture2, property, property1, property2) {
        // create a cube and add to scene
        var thisGeometry = new THREE.BoxGeometry(property, property1, property2);
        // create a cloudGeometry, slighly bigger than the original sphere
        var cloudGeometry = new THREE.SphereGeometry(property + .25, property1, property2);

        // draw 1st texture
        var sphereMaterial = createEarthMaterial(texture1);
        var earthMesh = new THREE.Mesh(thisGeometry, sphereMaterial);
        earthMesh.name = 'earth';
        earthMesh.position.x = 60 * x - 50;
        earthMesh.position.y = 0;
        earthMesh.position.z = 60 * y - 50;
        scene.add(earthMesh);

        // draw 2nd texture
        var cloudMaterial = createCloudMaterial(texture2);
        var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloudMesh.name = 'clouds';
        cloudMesh.position.x = 60 * x - 50;
        cloudMesh.position.y = 0;
        cloudMesh.position.z = 60 * y - 50;
        scene.add(cloudMesh);

    }

    function addControls(controlObject) {
        var gui = new dat.GUI({autoplace: false, width: 500});

        gui.add(controlObject, 'rotationSpeed', -0.01, 0.01);
    }

    function render() {

        // update the camera
        cameraControl.update();

        scene.getObjectByName('earth').rotation.y += control.rotationSpeed;
        scene.getObjectByName('clouds').rotation.y += control.rotationSpeed * 1.1;
        scene.getObjectByName('cloudsBump').rotation.y += control.rotationSpeed * 2.1;


        // and render the scene
        renderer.render(scene, camera);

        // render using requestAnimationFrame
        requestAnimationFrame(render);
    }

});