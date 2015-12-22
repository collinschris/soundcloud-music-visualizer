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
        AudioPlayer.data = new Uint8Array(AudioPlayer.frequencyBuckets);
        AudioPlayer.configured = false;

        AudioPlayer.loadTrack = function(trackURL) {
            console.log('loading track...');
            if (document.getElementById('player')) {
                document.body.removeChild(document.getElementById('player'));            
            }
            AudioPlayer.audioElem = new Audio();
            AudioPlayer.audioElem.src = trackURL;
            AudioPlayer.audioElem.controls = true;
            AudioPlayer.audioElem.autoplay = true;
            AudioPlayer.audioElem.crossOrigin = "anonymous";
            AudioPlayer.audioElem.setAttribute('id', 'player');
            document.body.appendChild(AudioPlayer.audioElem);

            AudioPlayer.configNodes();
        };

        AudioPlayer.configNodes = function() {
            console.log('configuring nodes');
            AudioPlayer.ctx = new AudioContext();
            AudioPlayer.analyser = AudioPlayer.ctx.createAnalyser();
            AudioPlayer.analyser.fftSize = AudioPlayer.frequencyBuckets*2;
            AudioPlayer.src = AudioPlayer.ctx.createMediaElementSource(AudioPlayer.audioElem);
            AudioPlayer.src.connect(AudioPlayer.analyser);
            AudioPlayer.analyser.connect(AudioPlayer.ctx.destination);
            AudioPlayer.configured = true;
        };

        AudioPlayer.updateData = function() {
            AudioPlayer.analyser.getByteFrequencyData(AudioPlayer.data);
        };

        return AudioPlayer;
    }]);


}());