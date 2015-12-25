(function(){
    'use strict';

    angular.module('Graphics').factory('Graphics', ['Audio', function(Audio) {
        const LINE_STYLE = 0;
        var Graphics = {};
        Graphics._height = window.innerHeight;
        Graphics._width = window.innerWidth;
        Graphics.scene = new THREE.Scene();
        Graphics.camera = new THREE.PerspectiveCamera(75, Graphics._width / Graphics._height, 1, 400);
        Graphics.renderer = new THREE.WebGLRenderer();
        Graphics._frameID = -1;
        Graphics._currentStyle = LINE_STYLE;
        Graphics._styles = [];
        // Animation Styles 
        var LineStyle = {};
        LineStyle._lines = [];
        LineStyle._slideBackLines = [];
        LineStyle._nLines = 203;
    
        LineStyle.makeLines = function() {
            var geometry, material, line;

            for (var i = 0; i < LineStyle._nLines; i++) {
                geometry = new THREE.Geometry();
                for (var j = 0; j < Audio.frequencyBuckets; j++) {
                    geometry.vertices.push(new THREE.Vector3((j/8) - 32, 0, -410));
                }
                geometry.verticesNeedUpdate = true;
                material = new THREE.LineBasicMaterial({color: 0x00ff00});
                line = new THREE.Line(geometry, material);
                LineStyle._lines.push(line);
                Graphics.scene.add(line);    
            }
        };

        LineStyle.updateLines = function() {
            if (LineStyle._lines.length === 0) return;
            // TODO: make this more efficient.. remove slideBackLines arr
            var line = LineStyle._lines.shift();
            for (var i = 0; i < Audio.frequencyBuckets; i++) {
                // line.material.color.setHex(0xff0000);
                line.geometry.vertices[i].y = Audio.data[i]/20;
                line.geometry.vertices[i].z = 0;
                line.geometry.verticesNeedUpdate = true;
            }    

            if (LineStyle._slideBackLines.length > 0 && LineStyle._slideBackLines[LineStyle._slideBackLines.length - 1].geometry.vertices[0].z < -400) { 
                LineStyle._lines.push(LineStyle._slideBackLines.pop());
            }

            for (var i = 0; i < LineStyle._slideBackLines.length; i++) {
                for (var j = 0; j < Audio.frequencyBuckets; j++) {
                    LineStyle._slideBackLines[i].geometry.vertices[j].z -= 2;
                    LineStyle._slideBackLines[i].geometry.verticesNeedUpdate = true;

                }    
            }
            LineStyle._slideBackLines.unshift(line);
        };
        
        LineStyle.render = function() {
            Graphics._frameID = requestAnimationFrame(LineStyle.render);
            Audio.updateData();
            LineStyle.updateLines();
            Graphics.renderer.render(Graphics.scene, Graphics.camera);
        };

        LineStyle.init = function() {
            LineStyle.makeLines();
            LineStyle.render();
        };

        Graphics._styles[LINE_STYLE] = LineStyle;


        // Graphics

        Graphics.selectStyle = function(styleID) {
            Graphics._currentStyle = styleID;
        };

        Graphics.init = function() {
            // setup
            Graphics.renderer.setSize(Graphics._width, Graphics._height);
            // TODO: don't add if already there
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

        Graphics.startAnimation = function() {
            Graphics._styles[Graphics._currentStyle].init();
        };
        
        Graphics.stopAnimation = function() {
            console.log('canceling animation frame');
            cancelAnimationFrame(Graphics._frameID);
        };

        return Graphics;
    }]);

}());