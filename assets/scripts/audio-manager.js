/**
 * @fileOverview
 * AudioManager module Definition
 * Load and control audio assets
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */ 

define(
    function(
    ) {
        "use strict";

        // Dev purposes only
        // If we disable sound, just set all methods of the audio manager to no-ops
        if (SETTINGS.enableSound === false) {
            var NoopAudioManager = function() {
                this.init =
                this.getAudio =
                this.playSound =
                this.playMusic =
                this.stop =
                this.muteMusic =
                this.unmuteMusic =
                this.muteAll =
                this.unmuteAll =
                $.noop;
            }
            return new NoopAudioManager();
        }
        
        if (window.audioManager) {
            return window.audioManager;
        }
        
        var AudioManager = function() {
            
            /**
             * Our audio manager's available assets
             * @type {object}
             * @example
            {
                'axlFoleyTheme': {
                    data: new NAudio('music/axl-foley-theme.mp3', onReadyCallback),
                    someOtherDataYouMightWant: 'yes'
                }
            }
             */
            this.assetList = {};
            
            
            /**
             * Are we currently muted (music only)?
             * @type {boolean}
             */
            this.isMuted = false;
            
            /**
             * Are we currently muting everything?
             * @type {boolean}
             */
            this.isMutedSFX = false;
            
            
            /**
             * An object containing all of the currently playing music NAudios
             * @type {object.<NAudio>}
             * @example
            {
                'axlFoleyTheme': NAudio
            }
             */
            this.isPlayingList = {};
            
        };
        
        
        var _events = {
            onEnded: function(id) {
                delete this.isPlayingList[id];
            }
        };
        
        
        /**
         * Initialize the AudioManager
         * @param {object} assetList An object in the form {'soundName': data}
         * @param {NAudio} assetList['*'].data
         */
        AudioManager.prototype.init = function(assetList) {
            this.assetList = assetList;
        };
        
        
        /**
         * Retrieve an NAudio object from the assetList object
         * @param {string} id An ID corresponding to a key in the assetList object
         * @returns {NAdudio}
         */
        AudioManager.prototype.getAudio = function(id) {
            if (typeof this.assetList[id] != 'undefined') {
                return this.assetList[id].data;
            }
            return null;
        };
        
        
        /**
         * Play a sound effect (sound effects are not affected by mute, also they do not mute)
         * @param {string} id An ID corresponding to a key in the assetList object
         */
        AudioManager.prototype.playSound = function(id) {
            if (this.isMutedSFX) {
                return;
            }
            var audio = this.getAudio(id);
            if (!audio) {
                return;
            }
            audio.play();
        };
        
        
        /**
         * Play a music file (music IS affected by mute and it loops continuously)
         * @param {string} id An ID corresponding to a key in the assetList object
         */
        AudioManager.prototype.playMusic = function(id) {
            var audio = this.getAudio(id);
            if (!audio) {
                return;
            }
            this.isPlayingList[id] = audio;
            
            audio
                .setOnEnded(_events.onEnded.bind(this, id))
                .setLoop(true)
            ;
            
            if (!this.isMuted) {
                audio.play()
            }
        };
        
        
        /**
         * Stop an audio file and remove it from the isPlayingList if we need to
         * @param {string} id An ID corresponding to a key in the assetList object
         */
        AudioManager.prototype.stop = function(id) {
            // Stop the audio
            var audio = this.getAudio(id);
            if (audio) {
                audio.stop();
            }
            
            // Remove the audio from the isPlayingList
            delete this.isPlayingList[id];
        };
        
        
        /**
         * Loop through the isPlayingList and pause all the things
         */
        AudioManager.prototype.muteMusic = function() {
            this.isMuted = true;
            for (var key in this.isPlayingList) {
                this.isPlayingList[key].pause();
            }
        };


        /**
         * Loop through the isPlayingList and push play on all the things
         */
        AudioManager.prototype.unmuteMusic = function() {
            this.isMuted = false;
            for (var key in this.isPlayingList) {
                this.isPlayingList[key].play();
            }
        };


        /**
         * Mute music and make sure any future sound effects DON'T play
         */
        AudioManager.prototype.muteAll = function() {
            this.muteMusic();
            this.isMutedSFX = true;
        };


        /**
         * Unmute music and make sure any future sound effects DO play
         */
        AudioManager.prototype.unmuteAll = function() {
            this.unmuteMusic();
            this.isMutedSFX = false;
        };


        /**
         * Unmute sound effects
         */
        AudioManager.prototype.unmuteSFX = function() {
            this.isMutedSFX = false;
        };
        

        return window.audioManager = new AudioManager();
    }
);