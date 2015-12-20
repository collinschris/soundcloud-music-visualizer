var Audio = {};

(function(){

    Audio.setup = false;
    Audio.updateData = null;
    Audio.frequencyBuckets = 512;
    Audio.data = new Uint8Array(Audio.frequencyBuckets); // same as freqBuckets

    var ctx; //audio context 
    var buf; //audio buffer 
    var fft; //fft audio node 
     
    //init the sound system 
    function init() { 
        try { 
            ctx = new AudioContext(); //is there a better API for this? 
            loadFile(); 
        } catch(e) { 
            alert('you need webaudio support'); 
        } 
    } 
    window.addEventListener('load', init, false);

    function loadFile() {
        //load and decode mp3 file 
        var req = new XMLHttpRequest(); 
        req.open("GET", "music.mp3", true); 
        req.responseType = "arraybuffer"; 
        req.onload = function() { 
            //decode the loaded data 
            ctx.decodeAudioData(req.response, function(buffer) { 
                buf = buffer; 
                play(); 
            }); 
        }; 
        req.send(); 
    }

    //play the loaded file 
    function play() { 
        //create a source node from the buffer 
        var src = ctx.createBufferSource(); 
        src.buffer = buf; 
        //create fft 
        fft = ctx.createAnalyser(); 
        fft.fftSize = Audio.frequencyBuckets*2; 

        //connect them up into a chain 
        src.connect(fft); 
        fft.connect(ctx.destination); 

        //play immediately 
        src.start(0); 

        Audio.setup = true;
        initAnimation();

    } 

    Audio.updateData = function(data) {
        fft.getByteFrequencyData(Audio.data);
    }

    // TODO: figure out visual alignment
    // TODO: make soundcloud api


}());