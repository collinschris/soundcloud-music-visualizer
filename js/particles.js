var initAnimation = null;

(function(){
    // Three.js vars 
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    var renderer = new THREE.WebGLRenderer();
    // setup
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera.position.z = 20;

    var lines = [];

    function makeLines() {
        var geometry, material, line;

        for (var i = 0; i < Audio.frequencyBuckets; i++) {
            // line 
            geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(i/8 - 30, 0, 0),
                new THREE.Vector3(i/8 - 30, 1, 0)
            );
            geometry.verticesNeedUpdate = true;
            material = new THREE.LineBasicMaterial({color: 0x00ff00});
            line = new THREE.Line(geometry, material);
            lines.push(line);
            scene.add(line);
        }
    }

    function updateLines() {
        for (var i = 0; i < Audio.frequencyBuckets; i++) {
            lines[i].geometry.vertices[1].y = Audio.data[i]/20;
            lines[i].geometry.verticesNeedUpdate = true;
        }
    }


    function render() {
        requestAnimationFrame(render);
        Audio.updateData();
        updateLines();
        renderer.render(scene, camera);
        
    }

    initAnimation = function() {
        console.log('init animation called');
        makeLines();
        render();    
    }
    

}());