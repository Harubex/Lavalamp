// The shaders built into Three.js.
var presetShaders = {
    Basic: {
        description: "A basic material that doesn't care about lighting. Useful for seeing what 2D metaballs look like.",
        shader: new THREE.MeshBasicMaterial()
    },
    Lambert: {
        description: "A material for diffuse (non-shiny) surfaces.",
        shader: new THREE.MeshLambertMaterial()
    },
    Normal: {
        description: "A material that maps the faces' normal vectors to RGB colors.",
        shader: new THREE.MeshNormalMaterial()
    },
    Phong: {
        description: "A material for shiny surfaces. This one kinda creeps me out a bit.",
        shader: new THREE.MeshPhongMaterial()
    },
    Wireframe: {
        description: "A material that simply draws lines between adjacent vertices.",
        shader: new THREE.MeshBasicMaterial({ wireframe: true })
    }
};

// Contains vertex and fragment shaders for custom materials.
var customShaders = {
    Fireworks: {
        description: "Because baby you're a fiiiiiiirewoooooork, come on let your oh god make it stop.",
        shader: new THREE.ShaderMaterial({
            uniforms: {
                time: {
                    type: "f",
                    value: 1.0
                },
                resolution: {
                    type: "v2",
                    value: new THREE.Vector2()
                },
                cloudTex: {
                    type: "t", value: (function () {
                        var tex = THREE.ImageUtils.loadTexture("textures/cloud.png");
                        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                        return tex;
                    })()
                },
                lavaTex: {
                    type: "t", value: (function () {
                        var tex = THREE.ImageUtils.loadTexture("textures/lavatile.jpg");
                        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                        return tex;
                    })()
                }
            },
            vertexShader: [
                "const vec2 uvScale = vec2(3., 1.);",
                "varying vec2 vUv;",

                "void main() {",
                "    vUv = uvScale * uv;",
                "    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);",
                "}",
            ].join("\n"),
            fragmentShader: [
                "uniform float time;",
                "uniform vec2 resolution;",
                "uniform sampler2D cloudTex;",
                "uniform sampler2D lavaTex;",
                "varying vec2 vUv;",

                "void main() {",
                "    float sinTime = sin(time), cosTime = cos(time);",
                "    vec2 position = -1. + 2. * vUv;",
                "    vec4 noise = texture2D(cloudTex, vUv);",
                "    vec2 T1 = vUv + vec2(1.5, -1.5) * time * .2;",
                "    vec2 T2 = vUv + vec2(-.5, 2.) * time * .1;",

                "    T1.x += noise.x * 2.;",
                "    T1.y += noise.y * 2.;",
                "    T2.x -= noise.y * .2;",
                "    T2.y += noise.z * .2;",

                "    float ptAlpha = texture2D(cloudTex, T1 * 2.).a;",

                "    vec4 color = texture2D(lavaTex, T2 * 2.);",
                "    vec4 temp = color * (vec4(ptAlpha) * 2.) + (color * color - 0.1);",

                "    if (temp.r > 1.) {",
                "        temp.bg += clamp(temp.r - 2., 0., 100.);",
                "    }",
                "    if (temp.g > 1.) {",
                "        temp.rb += temp.g - 1.;",
                "    }",
                "    if (temp.b > 1.) {",
                "        temp.rg += temp.b - 1.;",
                "    }",

                "    gl_FragColor = vec4(abs(cosTime) * temp.z, abs(sinTime) * temp.z, temp.z, temp.w);",
                "}"
            ].join("\n")
        })
    }
}
