(function(){
    'use strict';

    angular.module('Graphics').factory('Graphics', ['Audio', function(Audio) {
        var Graphics = {};
        Graphics._height = window.innerHeight;
        Graphics._width = window.innerWidth;
        Graphics.scene = new THREE.Scene();
        Graphics.camera = new THREE.PerspectiveCamera(75, Graphics._width / Graphics._height, 1, 400);
        Graphics.renderer = new THREE.WebGLRenderer();
        Graphics._lines = [];
        Graphics._slideBackLines = [];
        Graphics._nLines = 203;
        Graphics._frameID = -1;
        
        Graphics.init = function() {
            // setup
            Graphics.renderer.setSize(Graphics._width, Graphics._height);
            document.getElementById('canvas-wrapper').appendChild(Graphics.renderer.domElement);
            // position camera 
            Graphics.camera.position.y = 15;
            Graphics.camera.position.z = 25;
            Graphics.camera.lookAt(new THREE.Vector3(0, 0, 0));
        };

        Graphics.updateCanvasSize = function(width, height) {
            Graphics._width = width;
            Graphics._height = height;
            Graphics.renderer.setSize(Graphics._width, Graphics._height);
        };
        
        Graphics.makeLines = function() {
            var geometry, material, line;

            for (var i = 0; i < Graphics._nLines; i++) {
                geometry = new THREE.Geometry();
                for (var j = 0; j < Audio.frequencyBuckets; j++) {
                    geometry.vertices.push(new THREE.Vector3((j/8) - 34, 0, -410));
                }
                geometry.verticesNeedUpdate = true;
                material = new THREE.LineBasicMaterial({color: 0x00ff00});
                line = new THREE.Line(geometry, material);
                Graphics._lines.push(line);
                Graphics.scene.add(line);    
            }
        };

        Graphics.updateLines = function() {
            if (Graphics._lines.length === 0) return;
            // TODO: make this more efficient.. remove slideBackLines arr
            var line = Graphics._lines.shift();
            for (var i = 0; i < Audio.frequencyBuckets; i++) {
                // line.material.color.setHex(0xff0000);
                line.geometry.vertices[i].y = Audio.data[i]/20;
                line.geometry.vertices[i].z = 0;
                line.geometry.verticesNeedUpdate = true;
            }    

            if (Graphics._slideBackLines.length > 0 && Graphics._slideBackLines[Graphics._slideBackLines.length - 1].geometry.vertices[0].z < -400) { 
                Graphics._lines.push(Graphics._slideBackLines.pop());
            }

            for (var i = 0; i < Graphics._slideBackLines.length; i++) {
                for (var j = 0; j < Audio.frequencyBuckets; j++) {
                    Graphics._slideBackLines[i].geometry.vertices[j].z -= 2;
                    Graphics._slideBackLines[i].geometry.verticesNeedUpdate = true;

                }    
            }
            Graphics._slideBackLines.unshift(line);
        };
        
        Graphics.render = function() {
            Graphics._frameID = requestAnimationFrame(Graphics.render);
            Audio.updateData();
            Graphics.updateLines();
            Graphics.renderer.render(Graphics.scene, Graphics.camera);
        };

        Graphics.startAnimation = function() {
            Graphics.makeLines();
            Graphics.render();
        };
        
        Graphics.stopAnimation = function() {
            console.log('canceling animation frame');
            cancelAnimationFrame(Graphics._frameID);
        };

        return Graphics;
    }]);

}());