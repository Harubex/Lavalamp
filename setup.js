var materials = { // A list of materials that can be used for the demo.
	Basic: new THREE.MeshBasicMaterial(),
	Lambert: new THREE.MeshLambertMaterial(),
	Normal: new THREE.MeshNormalMaterial(),
	Phong: new THREE.MeshPhongMaterial(),
	Wireframe: new THREE.MeshBasicMaterial({ wireframe: true })
};

$(document).bind("contextmenu", function(e) {
	$("#menu").show();
	e.preventDefault();
});

/**
 * Creates a new scene and initializes all the other values necessary for this demo.
 * @param {HTMLCanvasElement} canvas - the canvas that the scene will be rendered on.
 *   A new canvas will be created if one is not provided.
 * @returns {object} an object that holds the properties that will be used for the demo.
 */
function setupScene(canvas) {
	canvas = canvas || (function() {
		var cnv = document.createElement("canvas");
		document.body.appendChild(cnv);
		return cnv;
	}());
	var demo = {
		scene: new THREE.Scene(),
		width: $(canvas).width(),
		height: $(canvas).height(),
		mouse: { x: 0, y: 0 }
	};
	demo.renderer = setupRenderer(canvas, demo.width, demo.height);
	demo.camera = setupCamera(demo.width, demo.height);
	addLights(demo.scene, demo.width, demo.height);
	return demo;
}

/**
 * Creates a new renderer to render the scene with.
 * @param {HTMLCanvasElement} cnv - the canvas that the scene will be rendered on.
 * @param {int} cnvWidth - width of canvas.
 * @param {int} cnvHeight - height of canvas.
 * @returns {THREE.WebGLRenderer|THREE.CanvasRenderer} the created renderer.
 *   Which type is returned depends on the browser being used.
 */
function setupRenderer(cnv, cnvWidth, cnvHeight) {
	// renderer settings, defaulted to low-performance settings
	var renderer, renderParams = {
		canvas: cnv,
		alpha: true,
		antialias: false,
		precision: "lowp"
	};
	try {
		if (window.WebGLRenderingContext && renderParams.canvas.getContext("webgl")) {
			// hooah, turn up the settings and lets do this
			renderParams.antialias = true;
			renderParams.precision = "highp";
			renderer = new THREE.WebGLRenderer(renderParams);
		} else {
			// if webgl is not supported, use the slow canvas version
			renderer = new THREE.CanvasRenderer(renderParams);
		}
	} catch (e) {
		// we'll end up here if the browser supports webgl, but cant use it for whatever reason
		renderer = new THREE.CanvasRenderer(renderParams);
	}
	renderer.setSize(cnvWidth, cnvHeight);
	return renderer;
}

/**
 * Creates a default camera to use with the newly-setup scene.
 * @param {int} cnvWidth - width of canvas.
 * @param {int} cnvHeight - height of canvas.
 * @returns {THREE.PerspectiveCamera} The camera to view the scene with.
 */
function setupCamera(cnvWidth, cnvHeight) {
	var camera = new THREE.PerspectiveCamera(
        45, // field of view
        cnvWidth / cnvHeight, // aspect ratio
        .1, 1000 // near and far clipping plane
    );
	camera.position = new THREE.Vector3(0, 0, 500);
	return camera;
}

/**
 * Adds lights to the given scene.
 * @param {THREE.Scene} scene - the Scene object that the lights will be added to.
 * @param {int} cnvWidth - width of canvas.
 * @param {int} cnvHeight - height of canvas.
 */
function addLights(scene, cnvWidth, cnvHeight) {
	var zero = new THREE.Vector3();
	var keyLight = new THREE.DirectionalLight(0xFFFFFF, 2);
	keyLight.position.set(-cnvWidth / 4, cnvHeight / 4, 100);
	keyLight.lookAt(zero);
	var fillLight = new THREE.DirectionalLight(0xFFFFFF, 1);
	fillLight.position.set(cnvWidth / 4, -cnvHeight / 4, 100);
	fillLight.lookAt(zero);
	var backLight = new THREE.DirectionalLight(0xFFFFFF, 1);
	backLight.position.set(-cnvWidth / 2, 0, -100);
	backLight.lookAt(zero);
	var backgroundLight = new THREE.DirectionalLight(0xFFFFFF, 1);
	backLight.position.set(cnvWidth / 2, 0, -500);
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

/**
 * Adds UI elements (sliders) to the screen and gives them their intended functionality.
 * @param {Lavalamp} lamp - the Lavalamp instance that will be manipulated.
 */
function addUIElements(lamp) {
	var infoPane = $("#infoPane");

	$(".speed").hover(function() {
		infoPane.html(descriptions.speed.join("<br><br>"));
	});
	$("#speedSlider").slider({
		min: 0.5,
		max: 20,
		step: 0.5,
		value: 5,
		change: function(e, ui) {
			lamp.setSpeed(ui.value);
		}
	});

	$(".rate").hover(function() {
		infoPane.html(descriptions.rate.join("<br><br>"));
	});
	$("#rateSlider").slider({
		min: 0.5,
		max: 20,
		step: 0.5,
		value: 5,
		change: function(e, ui) {
			lamp.setSpawnRate(ui.value);
		}
	});

	$(".size").hover(function() {
		infoPane.html(descriptions.size.join("<br><br>"));
	});
	$("#sizeSlider").slider({
		range: true,
		min: 0.1,
		max: 10,
		values: [1, 4],
		slide: function(e, ui) {
			lamp.setSizeRange(ui.values[0], ui.values[1]);
		}
	});

	$(".threshold").hover(function() {
		infoPane.html(descriptions.threshold.join("<br><br>"));
	});
	$("#thresholdSlider").slider({
		min: 0.1,
		max: 0.9,
		step: 0.01,
		value: 0.5,
		change: function(e, ui) {
			lamp.setThreshold(1 - ui.value);
		}
	});
	$(".resolution").hover(function() {
		infoPane.html(descriptions.resolution.join("<br><br>"));
	});
	$("#resolutionSlider").slider({
		min: 10,
		max: 50,
		value: 20,
		step: 1,
		change: function(e, ui) {
			lamp.resetPointField(new THREE.Vector3(
                ui.value, ui.value, ui.value)
            );
		}
	});
	$(".material").hover(function() {
		infoPane.html(descriptions.materials.join("<br><br>"));
	});
}

/**
 * Adds event handlers for mouse movement and material selection.
 * @param {Lavalamp} lamp - the Lavalamp instance that is currently being displayed.
 * @param {type} properties - the object returned from the setupScene method above
 */
function addEventHandlers(lamp, properties) {
	// Sets mouse move event for moving around the user ball.
	var projector = new THREE.Projector();
	var vector = new THREE.Vector3();
	$(document).bind("mousemove", function(e) {
		vector.x = (e.clientX / window.innerWidth) * 2 - 1;
		vector.y = -(e.clientY / window.innerHeight) * 2 + 1;
		vector.z = 0.5;
		// Convert screen space into world space.
		projector.unprojectVector(vector, properties.camera);
		var dir = vector.sub(properties.camera.position).normalize();
		var distance = -properties.camera.position.z / dir.z;
		var pos = properties.camera.position.clone().add(dir.multiplyScalar(distance));

		if (!properties.mouse) {
			properties.mouse = { x: pos.x, y: pos.y };
		} else {
			properties.mouse.x = pos.x;
			properties.mouse.y = pos.y;
		}
	});
	// Sets materials to set lava to for each option.
	$("#materialSelection").change(function() {
		var mat = materials[$(this).val()];
		if (mat.hasOwnProperty("color")) {
			mat.color = new THREE.Color(THREE.Math.randInt(0x111111, 0xFFFFFF));
		}
		lamp.setBallMaterial(mat);
	});
}

/**
 * Loads glsl shaders from the shader.xml file located in this repo and 
 * adds them to the material options list. Currently unused.
 */
function getShaders() {
	var shaders = {};
	$.ajax({
		url: "shaders.xml",
		contentType: "text/xml",
		dataType: "xml",
		success: function(xml) {
			if (!xml.firstChild) {
				return;
			}
			var shadersXml = xml.firstChild.children || [];
			for (var i = 0; i < shadersXml.length; i++) {
				var shaderName = shadersXml[i].attributes.name.value || "No name " + i;
				var vertexShader, fragmentShader;
				if (shadersXml[i].children.length != 2) {
					alert("Malformed shader xml: " + shaderName);
					continue;
				}
				for (var j = 0; j < 2; j++) {
					var shaderType = shadersXml[i].children[j].tagName,
                        shaderContent = shadersXml[i].children[j].textContent;
					if (shaderType == "vertex") {
						vertexShader = shaderContent;
					} else if (shaderType == "fragment") {
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
			buildOptionsList();
		},
		error: function(e) {
			alert("Error occurred getting shaders: " + e);
		}
	});

	function buildOptionsList() {
		var listHtml = "";
		$.each(shaders, function(name, shader) {
			listHtml += "<option value='" + name + "'>" + name + "</option>";
			materials[name] = new THREE.ShaderMaterial({
				vertexShader: shader.vertex,
				fragmentShader: shader.fragment
			});
		});
		$("#shaderList").html(listHtml);
	}
}