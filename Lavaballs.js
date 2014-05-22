/**
 * Creates a new set of balls.
 * @param {type} pointField - a 3-dimensional array of vector/value pair objects.
 * @returns {Lavaballs} the newly-created instance of this object.
 */
Lavaballs = function(pointField) {
    this.pointField = pointField;
};

Lavaballs.prototype = (function() {
    /* Creates a geometry according to the current location of this object's balls.
    It's essentially an implementation of this algorithm: http://en.wikipedia.org/wiki/Marching_cubes */
    function buildGeometry(threshold) {
        var vertices = new Array(12);
        var geometry = new THREE.Geometry();
        var vertexIndex = 0;
        for(var x = 0; x < this.pointField.length - 1; x++) {
            for(var y = 0; y < this.pointField[0].length - 1; y++) {
                for(var z = 0; z < this.pointField[0][0].length - 1; z++) {
                    // Gets the vertices of the cube adjacent to the current point.
                    var point0 = this.pointField[ x ][ y ][ z ],
                        point1 = this.pointField[x+1][ y ][ z ],
                        point2 = this.pointField[ x ][y+1][ z ],
                        point3 = this.pointField[x+1][y+1][ z ],
                        point4 = this.pointField[ x ][ y ][z+1],
                        point5 = this.pointField[x+1][ y ][z+1],
                        point6 = this.pointField[ x ][y+1][z+1],
                        point7 = this.pointField[x+1][y+1][z+1];
                    // If any of the points' values are under the threshold, mark them to be displayed.
                    var cubeIndex = 0;
                    if(point0.value < threshold) cubeIndex |= 1;
                    if(point1.value < threshold) cubeIndex |= 2;
                    if(point3.value < threshold) cubeIndex |= 4;
                    if(point2.value < threshold) cubeIndex |= 8;
                    if(point4.value < threshold) cubeIndex |= 16;
                    if(point5.value < threshold) cubeIndex |= 32;
                    if(point7.value < threshold) cubeIndex |= 64;
                    if(point6.value < threshold) cubeIndex |= 128;
                    // Use that value to look up the type of configuration to render.
                    var bits = lookup.edge[cubeIndex];
                    
                    if(!bits) continue;
                    // Create the actual vertices to be used for rendering the cube.
                    var mean = 0.5;
                    if(bits & 1) {
                        mean = (threshold - point0.value) / (point1.value - point0.value);
                        vertices[0] = point0.vector.clone().lerp(point1.vector, mean);
                    }
                    if(bits & 2) {
                        mean = (threshold - point1.value) / (point3.value - point1.value);
                        vertices[1] = point1.vector.clone().lerp(point3.vector, mean);
                    }
                    if(bits & 4) {
                        mean = (threshold - point2.value) / (point3.value - point2.value);
                        vertices[2] = point2.vector.clone().lerp(point3.vector, mean);
                    }
                    if(bits & 8) {
                        mean = (threshold - point0.value) / (point2.value - point0.value);
                        vertices[3] = point0.vector.clone().lerp(point2.vector, mean);
                    }
                    if(bits & 16) {
                        mean = (threshold - point4.value) / (point5.value - point4.value);
                        vertices[4] = point4.vector.clone().lerp(point5.vector, mean);
                    }
                    if(bits & 32) {
                        mean = (threshold - point5.value) / (point7.value - point5.value);
                        vertices[5] = point5.vector.clone().lerp(point7.vector, mean);
                    }
                    if(bits & 64) {
                        mean = (threshold - point6.value) / (point7.value - point6.value);
                        vertices[6] = point6.vector.clone().lerp(point7.vector, mean);
                    }
                    if(bits & 128) {
                        mean = (threshold - point4.value) / (point6.value - point4.value);
                        vertices[7] = point4.vector.clone().lerp(point6.vector, mean);
                    }
                    if(bits & 256) {
                        mean = (threshold - point0.value) / (point4.value - point0.value);
                        vertices[8] = point0.vector.clone().lerp(point4.vector, mean);
                    }
                    if(bits & 512) {
                        mean = (threshold - point1.value) / (point5.value - point1.value);
                        vertices[9] = point1.vector.clone().lerp(point5.vector, mean);
                    }
                    if(bits & 1024) {
                        mean = (threshold - point3.value) / (point7.value - point3.value);
                        vertices[10] = point3.vector.clone().lerp(point7.vector, mean);
                    }
                    if(bits & 2048) {
                        mean = (threshold - point2.value) / (point6.value - point2.value);
                        vertices[11] = point2.vector.clone().lerp(point6.vector, mean);
                    }
                    cubeIndex <<= 4;
                    for(var i = 0; lookup.triangle[cubeIndex + i] != -1; i += 3, vertexIndex += 3) {
                        // Add vertices to geometry, create a face for them, tell the renderer which way is "out".
                        geometry.vertices.push(vertices[lookup.triangle[cubeIndex + i]]);
                        geometry.vertices.push(vertices[lookup.triangle[cubeIndex + i + 1]]);
                        geometry.vertices.push(vertices[lookup.triangle[cubeIndex + i + 2]]);
                        geometry.faces.push(new THREE.Face3(vertexIndex, vertexIndex + 1, vertexIndex + 2));
                        geometry.faceVertexUvs[0].push([
                            new THREE.Vector2(0, 0), 
                            new THREE.Vector2(0, 1), 
                            new THREE.Vector2(1, 1)
                        ]);
                    }
                }
            }
        }
        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        return geometry;
    }
    var material = new THREE.MeshLambertMaterial({color: 0xde3400});
    return {
        ballData: [],
        pointField: [],
        update: function(dt, speed) {
            speed = speed || 1;
            // First, update the values of the point field.
            var ballBaseSize = (2000 + demo.width + demo.height);
            for(var x = 0; x < this.pointField.length; x++) {
                for(var y = 0; y < this.pointField[0].length; y++) {
                    for(var z = 0; z < this.pointField[0][0].length; z++) {
                        this.pointField[x][y][z].value = 0;
                        for(var i = 0; i < this.ballData.length; i++) {
                            var d2 = this.ballData[i].center.distanceToSquared(this.pointField[x][y][z].vector);
                            this.pointField[x][y][z].value += Math.exp(-(d2 / ballBaseSize / this.ballData[i].strength));
                        }
                    }
                }
            }
            // Next, adjust the positions of the balls.
            var removalList = [];
            for(var i = 0; i < this.ballData.length; i++) {
                this.ballData[i].center.y += Math.min(dt, 500) * this.ballData[i].speed / speed;
                if(this.ballData[i].center.y > demo.height * 1.5) {
                    removalList.push(i);
                }
            }
            for(var i = 0; i < removalList.length; i++) {
                this.removeLavaball(removalList[i]);
            }
        },
        getMesh: function(isoLevel) {
            return new THREE.Mesh(buildGeometry(isoLevel), material);
        },
        setMaterial: function(newMaterial) {
            material = newMaterial;
        },
        /// speed can be based off of strength (larger bubble, slower bubble)
        addLavaball: function(strength, center) {
            center = center || new THREE.Vector3(
                THREE.Math.randInt(-demo.width / 4, demo.width / 4),
                -demo.height / 1.5,
                THREE.Math.randInt(-50, 50)
            );
            /* As a guideline, 2x the strength:
               - 8x the weight (volume of a sphere)
               - 0.25x the speed (archimedes principle)
               and then a bit of randomness to make things interesting. */
            strength = strength || Math.pow(Math.E, Math.random());
            return this.ballData.push({
               center: center,
               strength: strength,
               speed: 1 / Math.pow((1 + Math.random()) * strength, 2)
            });
        },
        removeLavaball: function(index) {
            return this.ballData.splice(index, 1).pop();
        }
    };
}());
