var pointField = [], lavaballs;

function Lavalamp(size) {
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
    lavaballs = new Lavaballs(pointField);
    this.startFlowing();
};
var f = true;
Lavalamp.prototype = (function() {
    // variables controlling state and speed of lamp
    var flowing, speed = 0.5;
    var isoLevel = 0.5;
    // utility variables
    var requestId, lastFrame;
    var balls;
    var ball;
    function update(dt) {
        if(f) {
            ball = lavaballs.addLavaball(new THREE.Vector3(10, -50, 0), 2);
           // lavaballs.addLavaball(new THREE.Vector3(-20, 50, 0), 1);
           //lavaballs.addLavaball(new THREE.Vector3(-20, -100, 0), 1);
            balls = lavaballs.getMesh(0.5);
            demo.scene.add(balls);
            //lavaballs.addLavaball(new THREE.Vector3(100, -50, 0), 5);
            f = false;
        }
        lavaballs.update(dt);
        for(var i = 0; i < lavaballs.lavaballs.length; i++) {
           // lavaballs.lavaballs[i].center.y += (dt || 0) / 50;
        }
    }
    function render() {
        requestId = requestAnimationFrame(render);
        if(flowing) {
            demo.scene.remove(balls);
            balls = lavaballs.getMesh(0.5);
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
            speed = Math.max(Math.min(flowSpeed, 0), 1);
        }
    };
}());
