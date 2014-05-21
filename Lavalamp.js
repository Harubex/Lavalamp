var pointField = [], lavaballs;

function Lavalamp(size) {
    this.resetPointField(size);
    lavaballs = new Lavaballs(pointField);
    this.startFlowing();
};
var f = true;
Lavalamp.prototype = (function() {
    // variables controlling state and speed of lamp
    var flowing, speed = 1, rate = 1;
    var threshold = 0.5;
    // utility variables
    var requestId, lastFrame;
    var balls;
    var ball;
    var cooldown = 500;
    function update(dt) {
        if(f) {
            ball = lavaballs.addLavaball(2, new THREE.Vector3(0, 0, 0));
            balls = lavaballs.getMesh(threshold);
            demo.scene.add(balls);
            //lavaballs.addLavaball(new THREE.Vector3(100, -50, 0), 5);
            f = false;
        }
        lavaballs.ballData[0].center = new THREE.Vector3(demo.mouse.x, demo.mouse.y, 0);
        lavaballs.update(dt, speed);
        if(!cooldown && !THREE.Math.randInt(0, 100)) { // 1% chance per frame of creating a ball
            var len = lavaballs.addLavaball();
            // bigger balls, longer cooldown
            cooldown = Math.max(cooldown, lavaballs.ballData[len - 1].strength * 500);
        } else if(cooldown) {
            cooldown = Math.max(cooldown - dt, 0);
        }
    }
    function render() {
        requestId = requestAnimationFrame(render);
        if(flowing) {
            demo.scene.remove(balls);
            balls = lavaballs.getMesh(threshold);
            demo.scene.add(balls);
            update(arguments[0] - lastFrame);
        }
        lastFrame = arguments[0];
        demo.renderer.render(demo.scene, demo.camera);
    }
    // public member definitions
    return {
        startFlowing: function() {
            flowing = true;
            render();
        },
        stopFlowing: function() {
            flowing = false;
            cancelAnimationFrame(requestId);
        },
        setSpeed: function(flowSpeed) {
            speed = Math.abs(flowSpeed);
        },
        setThreshold: function(value) {
            threshold = value;
        },
        resetPointField: function(size) {
            for(var x = 0; x < size.x; x++) {
                pointField[x] = [];
                for(var y = 0; y < size.y; y++) {
                    pointField[x][y] = [];
                    for(var z = 0; z < size.z; z++) {
                        pointField[x][y][z] = {
                            value: 0,
                            vector: new THREE.Vector3(
                                -demo.width / 2 + demo.width  * x / (size.x - 1),
                                -demo.width / 2 + demo.height * y / (size.y - 1),
                                -demo.width / 2 + demo.width  * z / (size.z - 1)
                            )
                        };
                    }
                }
            }
        }
    };
}());
