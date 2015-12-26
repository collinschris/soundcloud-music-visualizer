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
        // Line
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


        // Sphere Style
        const SPHERE_STYLE = 1;
        var SphereStyle = {};
        SphereStyle.centralSphere;
        SphereStyle.lights = [];
        SphereStyle.lightSphere;

        SphereStyle.init = function() {

            var geometry = new THREE.SphereGeometry( 5, 32, 32 );
            var material = new THREE.MeshPhongMaterial({ color: 0x555555, specular: 0xffffff, shininess: 50 });
            SphereStyle.centralSphere = new THREE.Mesh( geometry, material );

            Graphics.scene.add(SphereStyle.centralSphere);

            // set up light points
            var light;
            SphereStyle.lightSphere = new THREE.SphereGeometry( 0.5, 16, 8 );

            light = SphereStyle.addLightPoint(0xff0000);
            light.position.x = -10;
            light.position.z = 10;

            light = SphereStyle.addLightPoint(0x00ff00);
            light.position.y = 10;
            light.position.z = 10;

            light = SphereStyle.addLightPoint(0x0000ff);
            light.position.y = -10;
            light.position.z = 10;

            light = SphereStyle.addLightPoint(0xffff00);
            light.position.x = 10;
            light.position.z = 10;

            SphereStyle.render();

        };

        SphereStyle.addLightPoint = function(hexColor) {
            var light = new THREE.PointLight(hexColor, 2, 50); // color, intensity, distance 
            light.add(new THREE.Mesh(SphereStyle.lightSphere, new THREE.MeshBasicMaterial({ color: hexColor })));
            Graphics.scene.add(light);
            SphereStyle.lights.push(light);
            return light;
        };

        SphereStyle.calculateScale = function(currentSize, targetSize) {
            return targetSize/currentSize;
        };

        SphereStyle.setRadius = function(sphere, radiusSize) {
            var scale = SphereStyle.calculateScale(sphere.geometry.parameters.radius, radiusSize);
            sphere.geometry.scale(scale, scale, scale);
            sphere.geometry.parameters.radius *= scale;
        };

        SphereStyle.updateAnimation = function() {
            var total = 0;
            for (var i = 0; i < Audio.frequencyBuckets; i++) {
                total += Audio.data[i];
            }
            var avg = total/Audio.frequencyBuckets + 1;
            console.log(avg);
            SphereStyle.setRadius(SphereStyle.centralSphere, avg/10.0);
        };

        SphereStyle.render = function() {
            Graphics._frameID = requestAnimationFrame(SphereStyle.render);
            Audio.updateData();
            SphereStyle.updateAnimation();
            Graphics.renderer.render(Graphics.scene, Graphics.camera);
        };

        Graphics._styles[SPHERE_STYLE] = SphereStyle;


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