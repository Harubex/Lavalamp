var $canvas;

window.mobilecheck = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|Tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

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
    var lastTime = new Date();
    function startMenu(e) {
        $("#instructions").hide(); // Hide instruction text once the menu is opened.
        // Check if menu is visible.
        var menuVisible = $menu.is(":visible");
        if ((mobilecheck() || e.which == 3) && !menuVisible) { // 3 is right mouse button.
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
    }
    $document.on("contextmenu", false)
        .mousedown(startMenu).mouseup(function (e) {
            if (new Date().getUTCMilliseconds() - lastTime.getUTCMilliseconds() >= 750) {
                if ($menu.is(":visible")) {
                    $menu.hide();
                } else {
                    startMenu(e);
                }
            }
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

    function adjustPositions(x, y) {
        // Convert screen space into world space.
        var vector = new THREE.Vector3((x / $document.width()) * 2 - 1,
                -(y / $document.height()) * 2 + 1, 0.5);
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
    }

    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        adjustPositions(touch.pageX, touch.pageY);
    }, false);
    $document.bind("mousemove", function (e) {
        adjustPositions(e.clientX, e.clientY);
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
