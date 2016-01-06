(function(){
    'use strict';

    angular.module('GraphicsHelper').factory('GraphicsHelper', [function() {
        // helper methods for graphics service 
        var GraphicsHelper = {};

        GraphicsHelper.dotProduct = function(vecA, vecB) {
            return vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z;
        };
  
        GraphicsHelper.distance = function(vecA, vecB) {
            var dx = vecA.x - vecB.x;
            var dy = vecA.y - vecB.y;
            var dz = vecA.z - vecB.z;
            return Math.sqrt(dx*dx + dy*dy + dz*dz);
        };
  
        GraphicsHelper.calculateAxisAngle = function(start, end) {
            // subtract to get directional vector
            // use unit vector [1, 0, 0] for axis rotation
            var directionVector = new THREE.Vector3();
            directionVector.subVectors(end, start).normalize();
            var angle = Math.acos(GraphicsHelper.dotProduct(directionVector, new THREE.Vector3(1, 0, 0)));
            var axis = new THREE.Vector3();
            axis.crossVectors(new THREE.Vector3(1, 0, 0), directionVector).normalize();
            return {axis: axis, angle: angle};
        };
  
        GraphicsHelper.calculateScale = function(currentSize, targetSize) {
            return targetSize/currentSize;
        };

        GraphicsHelper.setRadius = function(sphere, radiusSize) {
            var scale = GraphicsHelper.calculateScale(sphere.geometry.parameters.radius, radiusSize);
            sphere.geometry.scale(scale, scale, scale);
            sphere.geometry.parameters.radius *= scale;
        };

        GraphicsHelper.createLink = function(line, start, end) {
            // add line from start to end

            // ANGLE
            var axisAngle = GraphicsHelper.calculateAxisAngle(start, end);
            for (var i = 0; i < line.geometry.vertices.length; i++) {
                line.geometry.vertices[i].applyAxisAngle(axisAngle.axis, axisAngle.angle);
            }
            // DISTANCE
            var currDist = GraphicsHelper.distance(line.geometry.vertices[0], line.geometry.vertices[line.geometry.vertices.length - 1]);
            var targetDist = GraphicsHelper.distance(start, end);
            var scale = GraphicsHelper.calculateScale(currDist, targetDist);
            line.geometry.scale(scale, scale, scale);

            // POSITION            
            var currentStart = {};
            currentStart.x = line.geometry.vertices[0].x;
            currentStart.y = line.geometry.vertices[0].y;
            currentStart.z = line.geometry.vertices[0].z;
            for (var i = 0; i < line.geometry.vertices.length; i++) {
                line.geometry.vertices[i].x += start.x - currentStart.x;
                line.geometry.vertices[i].y += start.y - currentStart.y;
                line.geometry.vertices[i].z += start.z - currentStart.z;
            }

        };

        GraphicsHelper.avg = function(arr) {
            var total = 0;
            for (var i = 0; i < arr.length; i++) {
                total += arr[i];
            }
            return total/arr.length;
        };

        GraphicsHelper.clearScene = function(scene) {
            while (scene.children.length > 0) {
                scene.remove(scene.children.pop());
            }
        };

        return GraphicsHelper;
    }]);

}());