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
        SphereStyle.timeFrequencyLines = [];
        SphereStyle.particles = [];

        SphereStyle.init = function() {

            // set up central sphere
            var geometry = new THREE.SphereGeometry( 5, 32, 32 );
            var material = new THREE.MeshPhongMaterial({ color: 0x555555, specular: 0xffffff, shininess: 50 });
            SphereStyle.centralSphere = new THREE.Mesh( geometry, material );

            Graphics.scene.add(SphereStyle.centralSphere);

            // set up light points
            var light;
            SphereStyle.lightSphere = new THREE.SphereGeometry( 0.5, 16, 8 );

            var parent = new THREE.Object3D();
            Graphics.scene.add(parent);

            light = SphereStyle.addLightPoint(0xff0000);
            parent.add(light);
            light.position.x = -15;
            light.position.z = 10;

            var parent = new THREE.Object3D();
            Graphics.scene.add(parent);

            light = SphereStyle.addLightPoint(0x00ff00);
            parent.add(light);
            light.position.y = 15;
            light.position.z = 10;

            var parent = new THREE.Object3D();
            Graphics.scene.add(parent);

            light = SphereStyle.addLightPoint(0x0000ff);
            parent.add(light);
            light.position.y = -15;
            light.position.z = 10;

            var parent = new THREE.Object3D();
            Graphics.scene.add(parent);
            
            light = SphereStyle.addLightPoint(0xffff00);
            parent.add(light);
            light.position.x = 15;
            light.position.z = 10;

            console.log(light);

            // set up sound time lines
            var line;
            for (var i = 0; i < SphereStyle.lights.length; i++) {
                geometry = new THREE.Geometry();
                for (var j = 0; j < Audio.frequencyBuckets; j++) {
                    geometry.vertices.push(new THREE.Vector3(j, 0, 0));
                }
                geometry.verticesNeedUpdate = true;
                material = new THREE.LineBasicMaterial({color: SphereStyle.lights[i].color.getHex()}); 
                line = new THREE.Line(geometry, material);

                SphereStyle.createLink(line, SphereStyle.lights[i].position, new THREE.Vector3(0, 0, 0)); 

                SphereStyle.timeFrequencyLines.push(line);
                Graphics.scene.add(line);
            }

            // set up particles 
            SphereStyle.makeParticles();

            SphereStyle.render();

        };

        SphereStyle.makeParticles = function() {
            var geometry, material, particle, hue;

            for (var i = 0; i < Audio.frequencyBuckets; i++) {
                // particle 
                geometry = new THREE.SphereGeometry(2, 8, 8);
                hue = i/Audio.frequencyBuckets * 360;
                material = new THREE.MeshBasicMaterial({color: new THREE.Color('hsl(' + hue + ', 100%, 50%)')});
                particle = new THREE.Mesh( geometry, material );

                particle.position.x = -20;//Math.random() * 800 - 400;
                particle.position.y = 0;//Math.random() * 800 - 400;

                particle.position.z = -i*2;

                SphereStyle.particles.push(particle);
                Graphics.scene.add(particle);
            }
        };

        SphereStyle.createLink = function(line, start, end) {
            // add line from start to end
            // 1) set angle
                // calculate angle
                // set angle with vertex.applyAxisAngle
            // 2) set length
                // calculate scale
                // use line.scale
            // 3) adjust position 
                // vertex += start - currentStart
            // ANGLE
            var axisAngle = SphereStyle.calculateAxisAngle(start, end);
            for (var i = 0; i < line.geometry.vertices.length; i++) {
                line.geometry.vertices[i].applyAxisAngle(axisAngle.axis, axisAngle.angle);
            }
            // DISTANCE
            var currDist = SphereStyle.distance(line.geometry.vertices[0], line.geometry.vertices[line.geometry.vertices.length - 1]);
            var targetDist = SphereStyle.distance(start, end);
            var scale = SphereStyle.calculateScale(currDist, targetDist);
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

        SphereStyle.distance = function(vecA, vecB) {
            var vec = {};
            vec.x = vecA.x - vecB.x;
            vec.y = vecA.y - vecB.y;
            vec.z = vecA.z - vecB.z;
            return Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z);
        };

        SphereStyle.dotProduct = function(vecA, vecB) {
            return vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z;
        };

        SphereStyle.calculateAxisAngle = function(start, end) {
            // subtract to get directional vector
            // use unit vector [1, 0, 0]
            var directionVector = new THREE.Vector3();
            directionVector.subVectors(end, start).normalize();
            var angle = Math.acos(SphereStyle.dotProduct(directionVector, new THREE.Vector3(1, 0, 0)));
            var axis = new THREE.Vector3();
            axis.crossVectors(new THREE.Vector3(1, 0, 0), directionVector).normalize();
            return {axis: axis, angle: angle};

        };

        SphereStyle.addLightPoint = function(hexColor) {
            var light = new THREE.PointLight(hexColor, 2, 50); // color, intensity, distance 
            var mesh = new THREE.Mesh(SphereStyle.lightSphere, new THREE.MeshBasicMaterial({ color: hexColor })); 
            // mesh.position.y = 5;
            light.add(mesh);
            // Graphics.scene.add(light);
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

        SphereStyle.updateParticles = function() {
            for (var i = 0; i < SphereStyle.particles.length; i++) {
                SphereStyle.particles[i].position.z += 1;
                SphereStyle.particles[i].position.x = Audio.data[i]/10 - 20;
                if (SphereStyle.particles[i].position.z > 75) {
                    SphereStyle.particles[i].position.z = -500;
                }
            }
        };

        SphereStyle.updateAnimation = function() {

            // UPDATE CENTRAL SPHERE
            var total = 0;
            for (var i = 0; i < Audio.frequencyBuckets; i++) {
                total += Audio.data[i];
            }
            var avg = total/Audio.frequencyBuckets + 1;
            // console.log(avg);
            SphereStyle.setRadius(SphereStyle.centralSphere, avg/10.0);
            // SphereStyle.setRadius(SphereStyle.centralSphere, 1);

            // UPDATE ORBITING LIGHTS
            for (var i = 0; i < SphereStyle.timeFrequencyLines.length; i++) {
                for (var j = 0; j < Audio.frequencyBuckets; j++) {
                    SphereStyle.timeFrequencyLines[i].geometry.vertices[j].x = (j/10) - 35;
                    SphereStyle.timeFrequencyLines[i].geometry.vertices[j].y = (Audio.timeData[j]/256.0)*10;
                    SphereStyle.timeFrequencyLines[i].geometry.vertices[j].z = 0;
                }
                var lightPosition = new THREE.Vector3();
                lightPosition.setFromMatrixPosition(SphereStyle.lights[i].matrixWorld);
                SphereStyle.createLink(SphereStyle.timeFrequencyLines[i], lightPosition, new THREE.Vector3(0, 0, 0));    
                SphereStyle.timeFrequencyLines[i].geometry.verticesNeedUpdate = true;

                SphereStyle.lights[i].parent.rotation.z += 0.01;
                SphereStyle.lights[i].parent.rotation.x += 0.001;
                SphereStyle.lights[i].parent.rotation.y -= 0.001;
            }

            SphereStyle.updateParticles();
            
        };

        SphereStyle.render = function() {
            Graphics._frameID = requestAnimationFrame(SphereStyle.render);
            Audio.updateData();
            Audio.updateTimeData();
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
            Graphics.camera.position.y = 0;
            Graphics.camera.position.z = 30;
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