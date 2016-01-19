(function(){
    'use strict';

    angular.module('Graphics').factory('Graphics', ['Audio', 'GraphicsHelper', function(Audio, GH) {
        const LINE_STYLE = 0;
        var Graphics = {};
        Graphics.height = window.innerHeight;
        Graphics.width = window.innerWidth;
        Graphics.scene = new THREE.Scene();
        Graphics.camera = new THREE.PerspectiveCamera(75, Graphics.width / Graphics.height, 1, 400);
        Graphics.renderer = new THREE.WebGLRenderer();
        Graphics.frameID = -1;
        Graphics.currentStyle = LINE_STYLE;
        Graphics.styles = [];
        // Animation Styles 
        // Line
        var LineStyle = {};

        LineStyle.makeLines = function() {
            var geometry, material, line;

            for (var i = 0; i < LineStyle.nLines; i++) {
                geometry = new THREE.Geometry();
                for (var j = 0; j < Audio.frequencyBuckets; j++) {
                    geometry.vertices.push(new THREE.Vector3((j/8) - 32, 0, -410));
                }
                geometry.verticesNeedUpdate = true;
                material = new THREE.LineBasicMaterial({color: 0x00ff00});
                line = new THREE.Line(geometry, material);
                LineStyle.lines.push(line);
                Graphics.scene.add(line);    
            }
        };

        LineStyle.updateLines = function() {
            if (LineStyle.lines.length === 0) return;

            var line = LineStyle.lines.shift();
            for (var i = 0; i < Audio.frequencyBuckets; i++) {
                line.geometry.vertices[i].y = Audio.freqData[i]/20;
                line.geometry.vertices[i].z = 0;
                line.geometry.verticesNeedUpdate = true;
            }   

            for (var i = 0; i < LineStyle.lines.length; i++) {
                for (var j = 0; j < Audio.frequencyBuckets; j++) {
                    LineStyle.lines[i].geometry.vertices[j].z -= 2;
                    LineStyle.lines[i].geometry.verticesNeedUpdate = true;

                }    
            }

            LineStyle.lines.push(line);
        };
        
        LineStyle.render = function() {
            Graphics.frameID = requestAnimationFrame(LineStyle.render);
            Audio.updateFreqData();
            LineStyle.updateLines();
            Graphics.renderer.render(Graphics.scene, Graphics.camera);
        };

        LineStyle.init = function() {
            LineStyle.lines = [];
            LineStyle.nLines = 203;

            // position camera
            Graphics.camera.position.x = 0;
            Graphics.camera.position.y = 15;
            Graphics.camera.position.z = 30;
            Graphics.camera.lookAt(new THREE.Vector3(0, 0, 0));

            LineStyle.makeLines();
            LineStyle.render();
        };

        // add animation style to style array
        Graphics.styles[LINE_STYLE] = LineStyle;


        // Sphere Style
        const SPHERE_STYLE = 1;
        const GROUP_SIZE = 20;
        var SphereStyle = {};
        SphereStyle.isInitialized = false;

        SphereStyle.init = function() {
            if (SphereStyle.isInitialized) return;

            SphereStyle.centralSphere;
            SphereStyle.lights = [];
            SphereStyle.lightSphere;
            SphereStyle.timeFrequencyLines = [];
            SphereStyle.particleGroups = [];

            // position camera 
            Graphics.camera.position.x = 0;
            Graphics.camera.position.y = 0;
            Graphics.camera.position.z = 30;
            Graphics.camera.lookAt(new THREE.Vector3(0, 0, 0));

            // set up central sphere
            var geometry = new THREE.SphereGeometry( 5, 32, 32 );
            var material = new THREE.MeshPhongMaterial({ color: 0x555555, specular: 0xffffff, shininess: 50 });
            SphereStyle.centralSphere = new THREE.Mesh( geometry, material );
            Graphics.scene.add(SphereStyle.centralSphere);

            // set up light points
            var light;
            SphereStyle.lightSphere = new THREE.SphereGeometry( 0.5, 16, 8 );

            // parent allows light to be easily rotated 
            var parent = new THREE.Object3D();
            Graphics.scene.add(parent);
            light = SphereStyle.createLightPoint(0xff0000);
            parent.add(light);
            light.position.x = -15;

            var parent = new THREE.Object3D();
            Graphics.scene.add(parent);
            light = SphereStyle.createLightPoint(0x00ff00);
            parent.add(light);
            light.position.y = 15;

            var parent = new THREE.Object3D();
            Graphics.scene.add(parent);
            light = SphereStyle.createLightPoint(0x0000ff);
            parent.add(light);
            light.position.y = -15;

            var parent = new THREE.Object3D();
            Graphics.scene.add(parent);
            light = SphereStyle.createLightPoint(0xffff00);
            parent.add(light);
            light.position.x = 15;

            var parent = new THREE.Object3D();
            Graphics.scene.add(parent);
            light = SphereStyle.createLightPoint(0xff33cc);
            parent.add(light);
            light.position.z = -15;


            var parent = new THREE.Object3D();
            Graphics.scene.add(parent);
            light = SphereStyle.createLightPoint(0x00ccff);
            parent.add(light);
            light.position.z = 15;

            // set up sound time lines
            SphereStyle.makeSoundLines();

            // set up particles 
            SphereStyle.makeParticleGroups();

            SphereStyle.render();

            SphereStyle.isInitialized = true;

        };

        SphereStyle.makeSoundLines = function() {
            var geometry, material, line;
            for (var i = 0; i < SphereStyle.lights.length; i++) {
                geometry = new THREE.Geometry();
                for (var j = 0; j < Audio.frequencyBuckets; j++) {
                    geometry.vertices.push(new THREE.Vector3(j, 0, 0));
                }
                geometry.verticesNeedUpdate = true;
                material = new THREE.LineBasicMaterial({color: SphereStyle.lights[i].color.getHex()}); 
                line = new THREE.Line(geometry, material);

                GH.createLink(line, SphereStyle.lights[i].position, SphereStyle.centralSphere.position); 

                SphereStyle.timeFrequencyLines.push(line);
                Graphics.scene.add(line);
            }
        };

        SphereStyle.makeParticleGroups = function() {
            var nGroups = Math.floor(Audio.frequencyBuckets/GROUP_SIZE);
            var geometry, material, particle, hue, group;

            for (var i = 0; i < nGroups; i++) {
                group = new THREE.Object3D();
                // random position between -300 and 300
                group.position.x = Math.random() * 600 - 300;
                group.position.y = Math.random() * 600 - 300;
                group.position.z = -i * 20;
                Graphics.scene.add(group);

                for (var j = 0; j < GROUP_SIZE; j++) {
                    // particle 
                    geometry = new THREE.SphereGeometry(2, 8, 8);
                    hue = (i * GROUP_SIZE + j)/Audio.frequencyBuckets * 360;
                    material = new THREE.MeshBasicMaterial({color: new THREE.Color('hsl(' + hue + ', 100%, 50%)')});
                    particle = new THREE.Mesh( geometry, material );

                    particle.position.x = Math.random() * 2 - 1;
                    particle.position.y = Math.random() * 2 - 1;
                    particle.position.z = Math.random() * 2 - 1;
                    particle.position.normalize();

                    group.add(particle);
                }    

                SphereStyle.particleGroups.push(group);
            }

        };

        SphereStyle.createLightPoint = function(hexColor) {
            var light = new THREE.PointLight(hexColor, 2, 50); // color, intensity, distance 
            var mesh = new THREE.Mesh(SphereStyle.lightSphere, new THREE.MeshBasicMaterial({ color: hexColor })); 
            light.add(mesh);
            SphereStyle.lights.push(light);
            return light;
        };

        SphereStyle.updateParticleGroups = function() {
            for (var i = 0; i < SphereStyle.particleGroups.length; i++) {
                // update group parent
                SphereStyle.particleGroups[i].position.z += 1;
                if (SphereStyle.particleGroups[i].position.z > 75) {
                    SphereStyle.particleGroups[i].position.z = -500;
                }
                // update group children
                for (var j = 0; j < GROUP_SIZE; j++) {
                    SphereStyle.particleGroups[i].children[j].position.normalize().multiplyScalar(Audio.freqData[i * GROUP_SIZE + j] + 1);
                }
            }
        };

        SphereStyle.updateOrbitLights = function() {
            for (var i = 0; i < SphereStyle.timeFrequencyLines.length; i++) {
                for (var j = 0; j < Audio.frequencyBuckets; j++) {
                    SphereStyle.timeFrequencyLines[i].geometry.vertices[j].x = (j/10) - 35;
                    SphereStyle.timeFrequencyLines[i].geometry.vertices[j].y = (Audio.timeData[j]/256.0)*10;
                    SphereStyle.timeFrequencyLines[i].geometry.vertices[j].z = 0;
                }
                var lightPosition = new THREE.Vector3();
                lightPosition.setFromMatrixPosition(SphereStyle.lights[i].matrixWorld);
                GH.createLink(SphereStyle.timeFrequencyLines[i], lightPosition, SphereStyle.centralSphere.position);    
                SphereStyle.timeFrequencyLines[i].geometry.verticesNeedUpdate = true;

                SphereStyle.lights[i].parent.rotation.z += 0.01;
                SphereStyle.lights[i].parent.rotation.x += 0.001;
                SphereStyle.lights[i].parent.rotation.y -= 0.001;
            }            
        };

        SphereStyle.updateAnimation = function() {
            // update central sphere radius
            GH.setRadius(SphereStyle.centralSphere, (GH.avg(Audio.freqData) + 1)/10.0);

            // update orbiting lights
            SphereStyle.updateOrbitLights();

            // update background particles
            SphereStyle.updateParticleGroups();
        };

        SphereStyle.render = function() {
            Graphics.frameID = requestAnimationFrame(SphereStyle.render);
            Audio.updateFreqData();
            Audio.updateTimeData();
            SphereStyle.updateAnimation();
            Graphics.renderer.render(Graphics.scene, Graphics.camera);
        };

        // add animation style to style array
        Graphics.styles[SPHERE_STYLE] = SphereStyle;

        // Graphics
        // Main graphics object
        // handles scene, camera, and renderer 
        // animations are done in the style objects
        Graphics.selectStyle = function(styleID) {
            Graphics.currentStyle = styleID;
        };

        Graphics.init = function() {
            // setup size 
            Graphics.renderer.setSize(Graphics.width, Graphics.height);
            // add to DOM
            document.getElementById('canvas-wrapper').appendChild(Graphics.renderer.domElement);
        };

        Graphics.updateCanvasSize = function(width, height) {
            // update size and aspect ratio
            Graphics.width = width;
            Graphics.height = height;
            Graphics.camera.aspect = Graphics.width / Graphics.height;
            Graphics.camera.updateProjectionMatrix();
            Graphics.renderer.setSize(Graphics.width, Graphics.height);
        };

        Graphics.startAnimation = function() {
            Graphics.styles[Graphics.currentStyle].init();
        };
        
        Graphics.stopAnimation = function() {
            cancelAnimationFrame(Graphics.frameID);
            GH.clearScene(Graphics.scene);
            Graphics.styles[SPHERE_STYLE].isInitialized = false;
        };

        return Graphics;
    }]);

}());