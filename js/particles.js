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

    var particles = [];

    function makeParticles() {
        var geometry, material, particle;

        for (var i = 0; i < Audio.frequencyBuckets; i++) {
            // particle 
            geometry = new THREE.SphereGeometry(1, 4, 4);
            material = new THREE.MeshBasicMaterial({color: 0xffffff});
            particle = new THREE.Mesh( geometry, material );
            // give it a random x and y position between -500 and 500
            particle.position.x = i*1 - 700;
            particle.position.y = 100;
            particle.position.z = -400;

            particles.push(particle);
            scene.add(particle);
        }
    }

    function updateParticles() {
        for (var i = 0; i < Audio.frequencyBuckets; i++) {
            particles[i].position.y = Audio.data[i];
        }
    }


    function render() {
        requestAnimationFrame(render);
        Audio.updateData();
        updateParticles();
        renderer.render(scene, camera);
        
    }

    initAnimation = function() {
        console.log('init animation called');
        makeParticles();
        render();    
    }
    

}());