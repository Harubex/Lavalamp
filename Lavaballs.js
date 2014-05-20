// pointField is 3d array of vector/value pair objects
Lavaballs = function(pointField) {
    this.pointField = pointField;
};

Lavaballs.prototype = (function() {
    function buildGeometry(isoLevel) {
        var vertices = new Array(12);
        var geometry = new THREE.Geometry();
        var vertexIndex = 0;
        for(var x = 0; x < pointField.length - 1; x++) {
            for(var y = 0; y < pointField[0].length - 1; y++) {
                for(var z = 0; z < pointField[0][0].length - 1; z++) {
                    var point0 = pointField[ x ][ y ][ z ],
                        point1 = pointField[x+1][ y ][ z ],
                        point2 = pointField[ x ][y+1][ z ],
                        point3 = pointField[x+1][y+1][ z ],
                        point4 = pointField[ x ][ y ][z+1],
                        point5 = pointField[x+1][ y ][z+1],
                        point6 = pointField[ x ][y+1][z+1],
                        point7 = pointField[x+1][y+1][z+1];
                    
                    var cubeIndex = 0;
                    if(point0.value < isoLevel) cubeIndex |= 1;
                    if(point1.value < isoLevel) cubeIndex |= 2;
                    if(point3.value < isoLevel) cubeIndex |= 4;
                    if(point2.value < isoLevel) cubeIndex |= 8;
                    if(point4.value < isoLevel) cubeIndex |= 16;
                    if(point5.value < isoLevel) cubeIndex |= 32;
                    if(point7.value < isoLevel) cubeIndex |= 64;
                    if(point6.value < isoLevel) cubeIndex |= 128;
                    
                    var bits = lookup.edge[cubeIndex];
                    
                    if(!bits) continue;// else console.log(bits);
                    
                    var mean = 0.5;
                    if(bits & 1) {
                        mean = (isoLevel - point0.value) / (point1.value - point0.value);
                        vertices[0] = point0.vector.clone().lerp(point1.vector, mean);
                    }
                    if(bits & 2) {
                        mean = (isoLevel - point1.value) / (point3.value - point1.value);
                        vertices[1] = point1.vector.clone().lerp(point3.vector, mean);
                    }
                    if(bits & 4) {
                        mean = (isoLevel - point2.value) / (point3.value - point2.value);
                        vertices[2] = point2.vector.clone().lerp(point3.vector, mean);
                    }
                    if(bits & 8) {
                        mean = (isoLevel - point0.value) / (point2.value - point0.value);
                        vertices[3] = point0.vector.clone().lerp(point2.vector, mean);
                    }
                    if(bits & 16) {
                        mean = (isoLevel - point4.value) / (point5.value - point4.value);
                        vertices[4] = point4.vector.clone().lerp(point5.vector, mean);
                    }
                    if(bits & 32) {
                        mean = (isoLevel - point5.value) / (point7.value - point5.value);
                        vertices[5] = point5.vector.clone().lerp(point7.vector, mean);
                    }
                    if(bits & 64) {
                        mean = (isoLevel - point6.value) / (point7.value - point6.value);
                        vertices[6] = point6.vector.clone().lerp(point7.vector, mean);
                    }
                    if(bits & 128) {
                        mean = (isoLevel - point4.value) / (point6.value - point4.value);
                        vertices[7] = point4.vector.clone().lerp(point6.vector, mean);
                    }
                    if(bits & 256) {
                        mean = (isoLevel - point0.value) / (point4.value - point0.value);
                        vertices[8] = point0.vector.clone().lerp(point4.vector, mean);
                    }
                    if(bits & 512) {
                        mean = (isoLevel - point1.value) / (point5.value - point1.value);
                        vertices[9] = point1.vector.clone().lerp(point5.vector, mean);
                    }
                    if(bits & 1024) {
                        mean = (isoLevel - point3.value) / (point7.value - point3.value);
                        vertices[10] = point3.vector.clone().lerp(point7.vector, mean);
                    }
                    if(bits & 2048) {
                        mean = (isoLevel - point2.value) / (point6.value - point2.value);
                        vertices[11] = point2.vector.clone().lerp(point6.vector, mean);
                    }
                    cubeIndex <<= 4;
                    for(var i = 0; lookup.triangle[cubeIndex + i] != -1; i += 3, vertexIndex += 3) {
                        // clones necessary?
                        geometry.vertices.push(vertices[lookup.triangle[cubeIndex + i]].clone());
                        geometry.vertices.push(vertices[lookup.triangle[cubeIndex + i + 1]].clone());
                        geometry.vertices.push(vertices[lookup.triangle[cubeIndex + i + 2]].clone());
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
    var material = new THREE.MeshLambertMaterial({color: 0x00f400});
    return {
        lavaballs: [],
        update: function(dt) {
            for(var x = 0; x < this.pointField.length; x++) {
                for(var y = 0; y < this.pointField[0].length; y++) {
                    for(var z = 0; z < this.pointField[0][0].length; z++) {
                        this.pointField[x][y][z].value = 0;
                        for(var i = 0; i < this.lavaballs.length; i++) { // jesus.
                            var d2 = this.lavaballs[i].center.distanceToSquared(this.pointField[x][y][z].vector);
                            this.pointField[x][y][z].value += Math.exp( - (d2 /1000));
                        }
                    }
                }
            }
        },
        getMesh: function(isoLevel) {
            return new THREE.Mesh(buildGeometry(isoLevel), material);
        },
        /// speed can be based off of strength (larger bubble, slower bubble)
        addLavaball: function(center, strength) {
            /*strength = strength; // strength = 100 x radius
            // assumption: a bubble with a strength of 1 will have a weight of 1, speed of 10
            //  2x the strength, 8x the weight(sphere volume), 0.25x the speed (archimedes)
            this.speed = 10 / (Math.pow(strength, 3) / 2); // not quite right, fix*/
            return this.lavaballs.push({
               center: center,
               strength: strength
            });
        },
        removeLavaball: function(index) {
            return lavaballs.splice(index, 1).pop();
        }
    };
}());
