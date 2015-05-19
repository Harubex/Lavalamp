var pointField = [], lavaballs;
/**
 * Creates a new Lavalamp object. This takes care of creating and controlling a 
 *   Lavaballs object through the setters that it defines.
 * @param {THREE.Vector3} size - the number of points for each dimension of this object.
 * @returns {Lavalamp} a new object, ready to be started.
 */

function Lavalamp(size) {
	/// <summary>Determines the area of a circle that has the specified radius parameter.</summary>
	/// <param name="radius" type="Number">The radius of the circle.</param>
	/// <returns type="Number">The area.</returns>
	this.resetPointField(size);
	lavaballs = new Lavaballs(pointField);
};

Lavalamp.prototype = (function() {
	var initialized = false;
	// variables controlling state and speed of the lamp and its' balls.
	var flowing, speed = 1, rate = 100, minSize = 1, maxSize = 5, threshold = 0.5;
	// utility variables
	var requestId, lastFrame;
	var lavaballMesh; // The mesh that will be added to the scene.
	var userBall; // The index pointing to a ball that the user can control.
	var zPosition = 0; // The z-position of the user's ball.
	var cooldown = 500; // The minimum time between ball spawns (in ms).
	function update(dt) {
		if (!initialized) {
			// Adds user-controlled ball and creates initial mesh.
			userBall = lavaballs.addLavaball(2, new THREE.Vector3(0, 0, 0)) - 1;
			$(document).bind("wheel", function(e) {
				zPosition += e.originalEvent.deltaY / 5
			});
			lavaballMesh = lavaballs.getMesh(threshold);
			demo.scene.add(lavaballMesh);
			initialized = true;
		}
		// move user's ball and update the balls' positions
		lavaballs.ballData[userBall].center = new THREE.Vector3(demo.mouse.x, demo.mouse.y, zPosition);
		lavaballs.update(dt, speed);
		// creates a new ball, if possible
		if (!cooldown && !THREE.Math.randInt(0, rate)) { // add randomness to ball creation
			var len = lavaballs.addLavaball(THREE.Math.randFloat(minSize, maxSize));
			// bigger balls, longer cooldown
			cooldown = lavaballs.ballData[len - 1].strength * rate;
		} else if (cooldown) {
			cooldown = Math.max(cooldown - dt, 0);
		}
	}
	function render() {
		requestId = requestAnimationFrame(render);
		if (flowing) {
			// removes old mesh and creates a new one with updated positions
			demo.scene.remove(lavaballMesh);
			lavaballMesh = lavaballs.getMesh(threshold);
			demo.scene.add(lavaballMesh);
			update(arguments[0] - lastFrame);
		}
		lastFrame = arguments[0];
		demo.renderer.render(demo.scene, demo.camera);
	}
	// Public member definitions.
	return {
		startFlowing: function() {
			flowing = true;
			render();
		},
		stopFlowing: function() {
			flowing = false;
			cancelAnimationFrame(requestId);
		},
		setBallMaterial: function(material) {
			lavaballs.setMaterial(material);
		},
		setSizeRange: function(min, max) {
			minSize = min;
			maxSize = max;
		},
		setSpawnRate: function(spawnRate) {
			rate = 100 / spawnRate;
		},
		setSpeed: function(flowSpeed) {
			speed = 1 / Math.abs(flowSpeed);
		},
		setThreshold: function(value) {
			threshold = value;
		},
		resetPointField: function(size) {
			for (var x = 0; x < size.x; x++) {
				pointField[x] = [];
				var lerpX = lerp(-demo.width / 2, demo.width / 2, x / size.x);
				for (var y = 0; y < size.y; y++) {
					pointField[x][y] = [];
					var lerpY = lerp(-demo.height / 2, demo.height / 2, y / size.y);
					for (var z = 0; z < size.z; z++) {
						pointField[x][y][z] = {
							value: 0,
							vector: new THREE.Vector3(
                                lerpX,
                                lerpY,
                                lerp(-demo.width / 2, demo.width / 2, z / size.z)
                            )
						};
					}
				}
			}
			function lerp(a, b, t) {
				return (1 - t) * a + t * b;
			}
		}
	};
})();
