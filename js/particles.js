(function(){
    // Three.js vars 
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(1000, window.innerWidth / window.innerHeight, 1, 1000);
    var renderer = new THREE.WebGLRenderer();
    // setup
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera.position.z = 20;

    var particles = [];

    function makeParticles() {
        var geometry, material, particle;

        for (var zpos= -1000; zpos < 1000; zpos += 20) {
            // particle 
            geometry = new THREE.SphereGeometry(5, 32, 32);
            material = new THREE.MeshBasicMaterial({color: 0xffffff});
            particle = new THREE.Mesh( geometry, material );
            // give it a random x and y position between -500 and 500
            particle.position.x = Math.random() * 1000 - 500;
            particle.position.y = Math.random() * 1000 - 500;

            particle.position.z = zpos;

            particles.push(particle);
            scene.add(particle);
        }
    }

    function updateParticles() {
        for (var i = 0; i < particles.length; i++) {
            if (particles[i].position.z > 1000) {
                particles[i].position.z -= 2000;
            } else {
                particles[i].position.z += 10;
            }
        }
    }


    function render() {
        requestAnimationFrame(render);
        updateParticles();
        // cube.rotation.x += 0.1;
        // cube.rotation.y += 0.1;
        renderer.render(scene, camera);
    }
    makeParticles();
    render();

}());