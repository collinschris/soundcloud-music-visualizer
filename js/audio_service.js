(function(){

    'use strict';

    /* backend */
    angular.module('Audio').factory('Audio', ['$rootScope', function($rootScope) {
        // TODO: refactor to make cleaner
        var Audio = {};
        Audio.setup = false;
        Audio.updateData = null;
        Audio.frequencyBuckets = 512;
        Audio.data = new Uint8Array(Audio.frequencyBuckets); // same as freqBuckets
        Audio.isPaused = false;
        Audio.currentTrackTime = 0;

        Audio.ctx = new AudioContext(); //audio context 
        Audio.buf; //audio buffer 
        Audio.fft; //fft audio node
        Audio.src;  
         
        //init the sound system 
        // Audio.init = function() { 
        //     try { 
        //         ctx = new AudioContext(); //is there a better API for this? 
        //     } catch(e) { 
        //         alert('you need webaudio support'); 
        //     } 
        // } 
        // window.addEventListener('load', Audio.init, false);

        // TODO: fix slow loading by pre-loading buffer and calling start once song is finished
        Audio.loadFile = function(songUrl) {
            //load and decode mp3 file 
            var req = new XMLHttpRequest(); 
            req.open("GET", songUrl, true); 
            req.responseType = "arraybuffer"; 
            req.onload = function() { 
                //decode the loaded data 
                Audio.ctx.decodeAudioData(req.response, function(buffer) { 
                    console.log('loaded file');
                    Audio.buf = buffer; 
                    Audio.start(); 
                }); 
            }; 
            req.send(); 
        };

        Audio.newBufferSource = function(buf) {
            Audio.src = Audio.ctx.createBufferSource();
            Audio.src.buffer = buf;

            //connect them up into a chain 
            Audio.src.connect(Audio.fft); 
            Audio.fft.connect(Audio.ctx.destination); 

            Audio.src.onended = Audio.trackPlaybackFinished;
        };  

        Audio.pause = function() {
            if (Audio.isPaused) return;
            Audio.currentTrackTime = Audio.ctx.currentTime;
            Audio.src.stop();
            Audio.isPaused = true;
        };

        Audio.play = function() {
            if (!Audio.isPaused) return;
            Audio.newBufferSource(Audio.buf);
            Audio.src.start(0, Audio.currentTrackTime);
            Audio.isPaused = false;
        };

        Audio.trackPlaybackFinished = function() {
            if (Audio.isPaused) return;
            console.log('track finished');
            Audio.setup = false;
            Audio.isPaused = false;
            Audio.currentTrackTime = 0;
            $rootScope.$broadcast('trackFinished');
        };

        //start the loaded file 
        Audio.start = function() { 
            //create fft 
            Audio.fft = Audio.ctx.createAnalyser(); 
            Audio.fft.fftSize = Audio.frequencyBuckets*2; 
            //create a source node from the buffer 
            Audio.newBufferSource(Audio.buf);

            Audio.src.start(0); 

            Audio.setup = true;
            Audio.isPaused = false;
        };

        Audio.updateData = function(data) {
            Audio.fft.getByteFrequencyData(Audio.data);
        }
        return Audio;
    }]);


}());