(function(){
    // Three.js vars 
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 400);
    var renderer = new THREE.WebGLRenderer();
    // setup
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);
    // position camera 
    camera.position.y = 15;
    camera.position.z = 25;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var lines = [];
    var slideBackLines = [];
    var nLines = 203;

    function makeLines() {
        var geometry, material, line;

        for (var i = 0; i < nLines; i++) {
            geometry = new THREE.Geometry();
            for (var j = 0; j < Audio.frequencyBuckets; j++) {
                geometry.vertices.push(new THREE.Vector3(j/10 - 25, 0, -410));
            }
            geometry.verticesNeedUpdate = true;
            material = new THREE.LineBasicMaterial({color: 0x00ff00});
            line = new THREE.Line(geometry, material);
            lines.push(line);
            scene.add(line);    
        }
        
    }

    function updateLines() {
        if (lines.length === 0) return;
        var line = lines.shift();
        for (var i = 0; i < Audio.frequencyBuckets; i++) {
            // line.material.color.setHex(0xff0000);
            line.geometry.vertices[i].y = Audio.data[i]/20;
            line.geometry.vertices[i].z = 0;
            line.geometry.verticesNeedUpdate = true;
        }    

        if (slideBackLines.length > 0 && slideBackLines[slideBackLines.length - 1].geometry.vertices[0].z < -400) { 
            lines.push(slideBackLines.pop());
        }

        for (var i = 0; i < slideBackLines.length; i++) {
            for (var j = 0; j < Audio.frequencyBuckets; j++) {
                slideBackLines[i].geometry.vertices[j].z -= 2;
                slideBackLines[i].geometry.verticesNeedUpdate = true;

            }    
        }
        slideBackLines.unshift(line);
    }


    function render() {
        requestAnimationFrame(render);
        Audio.updateData();
        updateLines();
        renderer.render(scene, camera);
        
    }

    var initAnimation = function() {
        console.log('init animation called');
        makeLines();
        render();    
    }
    

    angular.module('Graphics').factory('Graphics', [function() {
        return { init: initAnimation };
    }]);

}());