$( document ).ready(function() {

    $('#submit').click(function (event) {
        $('#canvas-ctrl-container').remove();
        $('body').append('<div id="canvas-ctrl-container"> <div id="ctrl-container"></div> </div>');

        var primitive = $('#primitive').val();

        if (primitive != "") {
            modelName = primitive;
            var error = false;

            var property, property1, property2;

            switch (true) {
                case modelName == 'cone':
                    var width = parseInt($('#cone-radius').val()),
                        height = parseInt($('#cone-height').val()),
                        radialSegment = parseInt($('#cone-radialsegment').val());
                    if (  !width || !height || !radialSegment) {
                        alert("Please provide the cone's width, height, and radial segment");
                        error = true;
                        break;
                    }

                    if ((width < 10 || width > 40) || (height < 10 || height > 50) || (radialSegment < 10 || radialSegment > 32)) {
                        alert("Cone's properties must be between these values:\nwidth: 10 - 40\nheight: 10 - 50\nradial segment: 10 - 32");
                        error = true;
                        break;
                    }

                    property = width;
                    property1 = height;
                    property2 = radialSegment;
                    break;
                case modelName == 'cube':
                    var width = parseInt($('#cube-width').val()),
                        height = parseInt($('#cube-height').val()),
                        depth = parseInt($('#cube-depth').val());
                    if (  !width || !height || !depth ) {
                        alert("Please provide the cube's width, height, and depth");
                        error = true;
                        break;
                    }

                    if ((width < 10 || width > 50) || (height < 10 || height > 50) || (radialSegment < 10 || radialSegment > 50)) {
                        alert("Cube's width, height, and radial property must be between 10 - 50");
                        error = true;
                        break;
                    }

                    property = width;
                    property1 = height;
                    property2 = depth;
                    break;
                case modelName == 'sphere':
                    var radius = parseInt($('#sphere-radius').val()),
                        widthSegment = parseInt($('#sphere-widthSegments').val()),
                        heightSegment = parseInt($('#sphere-heightSegments').val());
                    if (  !radius || !widthSegment|| !heightSegment ) {
                        alert("Please provide the cone's radius, width segment, height segment");
                        error = true;
                        break;
                    }

                    if ((width < 10 || width > 50) || (height < 10 || height > 50) || (radialSegment < 10 || radialSegment > 50)) {
                        alert("Sphere's width, height, and radial property must be between 10 - 50");
                        error = true;
                        break;
                    }

                    property = radius;
                    property1 = widthSegment;
                    property2 = heightSegment;
                    break;
            }

            if (error) {
                event.preventDefault();

                return;
            } else {
                $("#helpText").show();

                // initialize the view
                init(modelName, property, property1, property2);
                event.preventDefault();
            }

        } else {
            return;
        }

    });

    $('#primitive').change(function (event) {
        var primitives = ['cone', 'cube', 'sphere'];
        var primitiveSelected = $(this).val();

        console.log('primitive selected');
        $('#' + primitiveSelected).show();

        primitives.forEach(function (primitive) {
            if (primitiveSelected != primitive) {
                $('#' + primitive).hide();
            }
        });
    });


// global variables
    var renderer;
    var scene;
    var camera;

    var control;

    function init(geometry, property, property1, property2) {

        scene = new THREE.Scene();

        camera = new THREE.OrthographicCamera();

        camera.left = window.innerWidth / -2;
        camera.right = window.innerWidth / 2;
        camera.top = window.innerHeight / 2;
        camera.bottom = window.innerHeight / -2;
        camera.near = 0.1;
        camera.far = 1500;

        camera.updateProjectionMatrix();

        // create a render, sets the background color and the size
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xffffff, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);


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

        control = new function () {
            this.left = camera.left;
            this.right = camera.right;
            this.top = camera.top;
            this.bottom = camera.bottom;
            this.far = camera.far;
            this.near = camera.near;

            this.updateCamera = function () {
                camera.left = control.left;
                camera.right = control.right;
                camera.top = control.top;
                camera.bottom = control.bottom;
                camera.far = control.far;
                camera.near = control.near;

                camera.updateProjectionMatrix();
            };
        };

        addControls(control);

        for (var x = 0; x < 4; x++) {
            for (var y = 0; y < 4; y++) {
                addGeometry(x, y, geometry, property, property1, property2);
            }
        }

        // add the output of the renderer to the html element
        $(renderer.domElement).appendTo('div#canvas-ctrl-container');


        // call the render function
        render();
    }

    function addGeometry(x, y, geometry, property, property1, property2) {
        // create a cube and add to scene
        var thisGeometry = null;

        switch (true) {
            case geometry == 'cone':
                thisGeometry = new THREE.ConeGeometry( property, property1, property2 );
                break;
            case geometry == 'cube':
                thisGeometry = new THREE.BoxGeometry(property, property1, property2);
                break;
            case geometry == 'sphere':
                thisGeometry = new THREE.SphereGeometry(property, property1, property2);
                break;
        }

        var material = new THREE.MeshLambertMaterial();
        material.color = new THREE.Color(0xffffff * Math.random());
        material.transparent = true;
        var geo = new THREE.Mesh(thisGeometry, material);
        geo.name = geometry;
        geo.position.x = 60 * x - 50;
        geo.position.y = 0;
        geo.position.z = 60 * y - 50;
        scene.add(geo);

    }

    function addControls(controlObject) {
        var gui = new dat.GUI({autoplace: false, width: 500});
        gui.addFolder('Use controls below to adjust orthographic properties');
        gui.add(controlObject, 'left', -1000, 0).name('Left').onChange(controlObject.updateCamera);
        gui.add(controlObject, 'right', 0, 1000).name('Right').onChange(controlObject.updateCamera);
        gui.add(controlObject, 'top', 0, 1000).name('Top').onChange(controlObject.updateCamera);
        gui.add(controlObject, 'bottom', -1000, 0).name('Bottom').onChange(controlObject.updateCamera);
        gui.add(controlObject, 'far', 100, 2000).name('Far').onChange(controlObject.updateCamera);
        gui.add(controlObject, 'near', 0, 200).name('Near').onChange(controlObject.updateCamera);

        var customContainer = document.getElementById('ctrl-container');
        customContainer.appendChild(gui.domElement);

    }

    function render() {
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

});