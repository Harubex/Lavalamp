function getShaders() {
    var shaders = {};
    $.ajax({
        url: "shaders.xml",
        contentType: "text/xml",
        dataType: "xml",
        success: function(xml) {
            if(!xml.firstChild) {
                return;
            }
            var shadersXml = xml.firstChild.children || [];
            for(var i = 0; i < shadersXml.length; i++) {
                var shaderName = shadersXml[i].attributes.name.value || "No name " + i;
                var vertexShader, fragmentShader;
                if(shadersXml[i].children.length != 2) {
                    alert("Malformed shader xml: " + shaderName);
                    continue;
                }
                for(var j = 0; j < 2; j++) {
                    var shaderType = shadersXml[i].children[j].tagName,
                        shaderContent = shadersXml[i].children[j].textContent;
                    if(shaderType == "vertex") {
                        vertexShader = shaderContent;
                    } else if(shaderType == "fragment") {
                        fragmentShader = shaderContent;
                    } else {
                        alert("Unrecognized shader type: " + shaderType);
                    }
                }
                shaders[shaderName] = {
                    vertex: vertexShader,
                    fragment: fragmentShader
                };
            }
        },
        error: function(e) {
            alert("Error occurred getting shaders: " + a);
        }
    });
    return shaders;
}

function setupScene(canvas) {
    canvas = canvas || (function() {
        var cnv = document.createElement("canvas");
        document.body.appendChild(cnv);
        return cnv;
    }());
    var sceneWidth = $(canvas).width(), 
        sceneHeight = $(canvas).height();
    var scene = new THREE.Scene();
    var renderer = setupRenderer(canvas, sceneWidth, sceneHeight);
    var camera = setupCamera(sceneWidth, sceneHeight);
    addLights(scene, sceneWidth, sceneHeight);
    return {
        scene: scene,
        camera: camera,
        renderer: renderer,
        width: sceneWidth,
        height: sceneHeight
    };
}

function setupRenderer(cnv, cnvWidth, cnvHeight) {
    // renderer settings, defaulted to low-performance settings
    var renderer, renderParams = {
        canvas: cnv,
        alpha: true,
        antialias: false,
        precision: "lowp"
    };
    try {
        if(window.WebGLRenderingContext && renderParams.canvas.getContext("webgl")) {
            // hooah, turn up the settings and lets do this shit
            renderParams.antialias = true;
            renderParams.precision = "highp";
            renderer = new THREE.WebGLRenderer(renderParams);
        } else {
            // if webgl is not supported, use the slow canvas version
            renderer = new THREE.CanvasRenderer(renderParams);
        }
    } catch(e) {
        // we'll end up here if the browser supports webgl, but cant use it for whatever reason
        renderer = new THREE.CanvasRenderer(renderParams);
    }
    renderer.setSize(cnvWidth, cnvHeight);
    return renderer;
}

function setupCamera(cnvWidth, cnvHeight) {
    var camera = new THREE.PerspectiveCamera(45, // field of view
        cnvWidth / cnvHeight, // aspect ratio
        .1, 1000 // near and far clipping plane
    );
    camera.position = new THREE.Vector3(0, 0, 500);
    return camera;
}

function addLights(scene, cnvWidth, cnvHeight) {
    var zero = new THREE.Vector3();
    var keyLight = new THREE.DirectionalLight(0xFFFFFF, 2);
    keyLight.position.set(-cnvWidth/4, cnvHeight/4, 100);
    keyLight.lookAt(zero);
    var fillLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    fillLight.position.set(cnvWidth/4, -cnvHeight/4, 100);
    fillLight.lookAt(zero);
    var backLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    backLight.position.set(-cnvWidth/2, 0, -100);
    backLight.lookAt(zero);
    var backgroundLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    backLight.position.set(cnvWidth/2, 0, -500);
    var lightingPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(cnvWidth, cnvHeight), 
        new THREE.MeshLambertMaterial({
            color: 0x000000,
            side: THREE.DoubleSide
        })
    );
    lightingPlane.position.set(0, 0, -500);
    backgroundLight.lookAt(lightingPlane.position);
    scene.add(lightingPlane);
    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);
    scene.add(backgroundLight);
}
