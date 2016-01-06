(function(){

    'use strict';

    /* backend */
    angular.module('Audio').factory('Audio', ['$rootScope', function($rootScope) {
        var AudioPlayer = {};
        AudioPlayer.audioElem;
        AudioPlayer.ctx;
        AudioPlayer.src; 
        AudioPlayer.analyser;
        AudioPlayer.frequencyBuckets = 512;
        AudioPlayer.freqData = new Uint8Array(AudioPlayer.frequencyBuckets);
        AudioPlayer.timeData = new Uint8Array(AudioPlayer.frequencyBuckets);
        AudioPlayer.configured = false;

        AudioPlayer.loadTrack = function(trackURL, useAnalyser) {
            if (useAnalyser) AudioPlayer.checkStreamability(trackURL);
            if (document.getElementById('player')) {
                document.getElementById('audio-wrapper').removeChild(document.getElementById('player'));            
            }
            AudioPlayer.audioElem = new Audio();
            if (useAnalyser) AudioPlayer.audioElem.crossOrigin = 'anonymous';
            AudioPlayer.audioElem.src = trackURL;
            AudioPlayer.audioElem.controls = true;
            AudioPlayer.audioElem.autoplay = true;
            AudioPlayer.audioElem.setAttribute('id', 'player');
            document.getElementById('audio-wrapper').appendChild(AudioPlayer.audioElem);
            AudioPlayer.audioElem.onended = AudioPlayer.trackEnded;

            if (useAnalyser) AudioPlayer.configNodes();
        };

        AudioPlayer.checkStreamability = function(URL) {
              var req = new XMLHttpRequest(); 
              req.open("GET", URL, true); 
              req.responseType = "arraybuffer"; 
              req.onreadystatechange = function() {
                if (req.readyState === 4 && req.status === 0) {
                    $rootScope.$broadcast('noTrackAnalyser');
                }
              }; 
              req.send();
        };

        AudioPlayer.trackEnded = function() {
            $rootScope.$broadcast('trackFinished');
        };

        AudioPlayer.configNodes = function() {
            if (!AudioPlayer.ctx) AudioPlayer.ctx = new AudioContext(); // only need 1 audio context obj
            AudioPlayer.analyser = AudioPlayer.ctx.createAnalyser();
            AudioPlayer.analyser.fftSize = AudioPlayer.frequencyBuckets*2;
            AudioPlayer.src = AudioPlayer.ctx.createMediaElementSource(AudioPlayer.audioElem);
            AudioPlayer.src.connect(AudioPlayer.analyser);
            AudioPlayer.analyser.connect(AudioPlayer.ctx.destination);
            
            AudioPlayer.configured = true;
        };

        AudioPlayer.updateFreqData = function() {
            AudioPlayer.analyser.getByteFrequencyData(AudioPlayer.freqData);
        };

        AudioPlayer.updateTimeData = function() {
            AudioPlayer.analyser.getByteTimeDomainData(AudioPlayer.timeData);
        };

        return AudioPlayer;
    }]);


}());