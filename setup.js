var $canvas;

/**
 * Creates a new scene and initializes all the other values necessary for this demo.
 * @param {HTMLCanvasElement} canvas - the canvas that the scene will be rendered on.
 *   A new canvas will be created if one is not provided.
 * @returns {object} an object that holds the properties that will be used for the demo.
 */
function setupScene(id) {
	$canvas = $(id || (function () {
		var cnv = document.createElement("canvas");
		document.body.appendChild(cnv);
		return cnv;
	})());
	var demo = {
		scene: new THREE.Scene(),
		width: $canvas.width(),
		height: $canvas.height(),
		mouse: { x: 0, y: 0 }
	};
	demo.renderer = setupRenderer();
	demo.camera = setupCamera();
	addLights(demo.scene);
	return demo;
}

// Initializes functionality for the settings menu.
function setupMenu(id, matId) {
    var $menu = $(id), $document = $(document);
    $document.on("contextmenu", false).mousedown(function (e) {
        $("#instructions").hide(); // Hide instruction text once the menu is opened.
        // Check if menu is visible.
        var menuVisible = $menu.is(":visible");
        if (e.which == 3 && !menuVisible) { // 3 is right mouse button.
            // Close previously open menu option, position the menu, and show it.
            $menu.accordion("option", "active", false).css({
                top: Math.min($document.height() - $menu.height() - 10, e.originalEvent.clientY),
                left: Math.min($document.width() - $menu.width() - 10, e.originalEvent.clientX)
            }).show();
        } else if (!$(e.target).closest(id).length) {
            if (menuVisible) {
                $menu.hide();
            }
        }
        return false;
    });

    // Settings tooltips.
    $document.tooltip({
        show: {
            delay: 500
        },
        hide: false,
        position: {
            my: "center bottom-20",
            at: "center top",
        }
    });

    var menuOptions = {
        active: false,
        animate: "easeOutExpo",
        header: "li.option",
        collapsible: true,
        icons: false,
        event: "mouseover",
        heightStyle: "fill"
    };

    // Main settings menu.
    $menu.accordion(menuOptions);

    // Materials sub-menu.
    menuOptions.header = "li.group";
    $(matId).accordion(menuOptions);
}

// Creates a new renderer to render the scene with.
function setupRenderer() {
	// Renderer settings - defaulted to low-performance settings.
	var renderer, renderParams = {
		canvas: $canvas.get(0),
		alpha: true,
		antialias: false,
		precision: "lowp"
	};
	try {
		if (window.WebGLRenderingContext && renderParams.canvas.getContext("webgl")) {
			// Hooah, turn up the settings and let's do this.
			renderParams.antialias = true;
			renderParams.precision = "highp";
			renderer = new THREE.WebGLRenderer(renderParams);
		} else {
			// If WebGL is not supported, use the slow canvas version.
			renderer = new THREE.CanvasRenderer(renderParams);
		}
	} catch (e) {
	    // We'll end up here if the browser supports WebGL, but can't use it for whatever reason.
		renderer = new THREE.CanvasRenderer(renderParams);
	}
	renderer.setSize($canvas.width(), $canvas.height());
	return renderer;
}

// Creates a default camera to use with the newly-setup scene.
function setupCamera() {
	var camera = new THREE.PerspectiveCamera(
        45, // Field of view.
        $canvas.width() / $canvas.height(), // Aspect ratio.
        .1, 1000 // Near and far clipping plane.
    );
	camera.position = new THREE.Vector3(0, 0, 500);
	return camera;
}

// Adds lights to the given scene.
function addLights(scene) {
    var w = $canvas.width(), h = $canvas.height();

    // Create a solid plane for light to bounce off of.
    var lightingPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshLambertMaterial({
            color: 0x000000,
            side: THREE.DoubleSide
        })
    );
    lightingPlane.position.set(0, 0, -500);
    scene.add(lightingPlane);

    // Key light.
    addLight(2, new THREE.Vector3(-w / 4, h / 4, 400));
    // Fill light.
    addLight(1, new THREE.Vector3(w / 4, -h / 2, 100));
    // Back light.
    addLight(1, new THREE.Vector3(w / 2, 0, -500), lightingPlane.position);

	function addLight(lightStrength, lightPosition, lookPosition) {
	    var light = new THREE.DirectionalLight(0xFFFFFF, lightStrength);
	    light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
	    light.lookAt(lookPosition || new THREE.Vector3());
	    scene.add(light);
	}
}

// Adds UI elements (sliders) to the screen and specifies their ranges.
function addUIElements(lamp) {
    var sliderActions = {
        "speedSlider": function (ui) {
            lamp.setSpeed(ui.value);
        },
        "rateSlider": function (ui) {
            lamp.setSpawnRate(ui.value);
        },
        "sizeSlider": function (ui) {
            lamp.setSizeRange(ui.values[0], ui.values[1]);
        },
        "thresholdSlider": function (ui) {
            lamp.setThreshold(1 - ui.value);
        },
        "resolutionSlider": function (ui) {
            lamp.resetPointField(new THREE.Vector3(ui.value, ui.value, ui.value));
        }
    };
    for (var id in sliderActions) {
        var $e = $("#" + id), ranged = !!$e.attr("data-value-low");
        $e.slider({
            min: parseFloat($e.attr("data-min")),
            max: parseFloat($e.attr("data-max")),
            step: parseFloat($e.attr("data-step")),
            value: parseFloat($e.attr("data-value")),
            range: ranged,
            values: ranged ? [parseFloat($e.attr("data-value-low")), parseFloat($e.attr("data-value-high"))] : null,
            change: function (e, ui) {
                sliderActions[$(this).attr("id")](ui);
            }
        });
    }
}

// Adds event handlers for mouse movement and material selection.
function addEventHandlers(lamp, properties) {
	// Sets mouse move event for moving around the user ball.
    var projector = new THREE.Projector();
    var $document = $(document);
	$document.draggable();
	$document.bind("mousemove", function (e) {
        // Convert screen space into world space.
        var vector = new THREE.Vector3((e.clientX / $document.width()) * 2 - 1,
                -(e.clientY / $document.height()) * 2 + 1, 0.5);
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

	// Add preset materials to list.
    var $presetList = $("#preset_materials");
    for (var name in presetShaders) {
        $presetList.append($("<div>" + name + "</div>").attr({
            "id": name,
            "title": presetShaders[name].description
        }).addClass("material option").click(function () {
            var obj = presetShaders[$(this).attr("id")];
            if (obj.shader.hasOwnProperty("color")) {
                // Assign a random color to the material.
                obj.shader.color = new THREE.Color(THREE.Math.randInt(0x111111, 0xFFFFFF));
            }
            lamp.setBallMaterial(obj.shader);
        }));
    }

    // Add custom materials to list.
    var $customList = $("#custom_materials");
    for (var name in customShaders) {
        $customList.append($("<div>" + name + "</div>").attr({
            "id": name,
            "title": customShaders[name].description
        }).addClass("material option").click(function () {
            lamp.setBallMaterial(customShaders[$(this).attr("id")].shader);
        }));
    }
}
