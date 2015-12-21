(function(){

    'use strict';

    /* backend */
    angular.module('Audio').factory('Audio', [function() {
        var Audio = {};
        Audio.setup = false;
        Audio.updateData = null;
        Audio.frequencyBuckets = 512;
        Audio.data = new Uint8Array(Audio.frequencyBuckets); // same as freqBuckets

        var ctx = new AudioContext(); //audio context 
        var buf; //audio buffer 
        var fft; //fft audio node 
         
        //init the sound system 
        // Audio.init = function() { 
        //     try { 
        //         ctx = new AudioContext(); //is there a better API for this? 
        //     } catch(e) { 
        //         alert('you need webaudio support'); 
        //     } 
        // } 
        // window.addEventListener('load', Audio.init, false);

        Audio.loadFile = function(songUrl) {
            //load and decode mp3 file 
            var req = new XMLHttpRequest(); 
            req.open("GET", songUrl, true); 
            req.responseType = "arraybuffer"; 
            req.onload = function() { 
                //decode the loaded data 
                ctx.decodeAudioData(req.response, function(buffer) { 
                    buf = buffer; 
                    console.log('file loaded');
                    Audio.play(); 
                }); 
            }; 
            req.send(); 
        };

        //play the loaded file 
        Audio.play = function() { 
            //create a source node from the buffer 
            var src = ctx.createBufferSource(); 
            src.buffer = buf; 
            //create fft 
            fft = ctx.createAnalyser(); 
            fft.fftSize = Audio.frequencyBuckets*2; 

            //connect them up into a chain 
            src.connect(fft); 
            fft.connect(ctx.destination); 

            src.start(0); 

            Audio.setup = true;
        };

        Audio.updateData = function(data) {
            fft.getByteFrequencyData(Audio.data);
        }
        return Audio;
    }]);

    // Audio.setup = false;
    // Audio.updateData = null;
    // Audio.frequencyBuckets = 512;
    // Audio.data = new Uint8Array(Audio.frequencyBuckets); // same as freqBuckets

    // var ctx; //audio context 
    // var buf; //audio buffer 
    // var fft; //fft audio node 
     
    // //init the sound system 
    // Audio.init = function() { 
    //     try { 
    //         ctx = new AudioContext(); //is there a better API for this? 
    //     } catch(e) { 
    //         alert('you need webaudio support'); 
    //     } 
    // } 
    // window.addEventListener('load', Audio.init, false);

    // Audio.loadFile = function(songUrl) {
    //     //load and decode mp3 file 
    //     var req = new XMLHttpRequest(); 
    //     req.open("GET", songUrl, true); 
    //     req.responseType = "arraybuffer"; 
    //     req.onload = function() { 
    //         //decode the loaded data 
    //         ctx.decodeAudioData(req.response, function(buffer) { 
    //             buf = buffer; 
    //             Audio.play(); 
    //         }); 
    //     }; 
    //     req.send(); 
    // };

    // //play the loaded file 
    // Audio.play = function() { 
    //     //create a source node from the buffer 
    //     var src = ctx.createBufferSource(); 
    //     src.buffer = buf; 
    //     //create fft 
    //     fft = ctx.createAnalyser(); 
    //     fft.fftSize = Audio.frequencyBuckets*2; 

    //     //connect them up into a chain 
    //     src.connect(fft); 
    //     fft.connect(ctx.destination); 

    //     //play immediately 
    //     src.start(0); 

    //     Audio.setup = true;
    //     initAnimation();

    // };

    // Audio.updateData = function(data) {
    //     fft.getByteFrequencyData(Audio.data);
    // }

    // TODO: figure out visual alignment
    // TODO: make soundcloud api


}());