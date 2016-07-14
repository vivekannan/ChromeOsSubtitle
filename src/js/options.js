(function() {
    mejs.MepDefaults = {
        // default if the <video width> is not specified
        defaultVideoWidth: 480,
        // default if the <video height> is not specified
        defaultVideoHeight: 270,
        // if set, overrides <video width>
        videoWidth: -1,
        // if set, overrides <video height>
        videoHeight: -1,
        // default if the user doesn't specify
        defaultAudioWidth: 400,
        // default if the user doesn't specify
        defaultAudioHeight: 30,
        
        // width of audio player
        audioWidth: -1,
        // height of audio player
        audioHeight: -1,
        // initial volume when the player starts (overrided by user cookie)
        startVolume: 0.8,
        // useful for <audio> player loops
        loop: false,
        // rewind to beginning when media ends
        autoRewind: true,
        // resize to media dimensions
        enableAutosize: true,
        // forces the hour marker (##:00:00)
        alwaysShowHours: false,
        
        // automatically calculate the width of the progress bar based on the sizes of other elements
        autosizeProgress: true,
        // Hide controls when playing and mouse is not over the video
        alwaysShowControls: false,
        // Display the video control
        hideVideoControlsOnLoad: false,
        // Enable click video element to toggle play/pause
        clickToPlayPause: true,
        // force Android's native controls
        AndroidUseNativeControls: false,
        // features to show
        features: ['source', 'settings', 'playpause', 'stop', 'progress', 'current', 'duration', 'tracks', 'subdelay', 'subsize', 'volume', 'settingsbutton', 'info', 'help', 'fullscreen', 'drop', 'stats', 'opensubtitle', 'autosrt', 'notification', 'shortcuts'],
        
        // only for dynamic
        isVideo: true,
        
        // turns keyboard support on and off for this instance
        enableKeyboard: true,
        
        aspectRatios: [null, 1, 1.333333, 1.777778, 1.666666, 2.21, 2.35, 2.39, 1.25],
        
        aspectRatiosText: ['Default', '1:1', '4:3', '16:9', '16:10', '2.21:1', '2.35:1', '2.39:1', '5:4'],
        
        // array of keyboard actions such as play pause
        keyActions: [
            {
                keys: [
                    32, // SPACE
                    179 // GOOGLE play/pause button
                ],
                action: function(player, keyCode, activeModifiers) {
                    if(player.isPaused() || player.isEnded())
                        player.play();
                    else
                        player.pause();
                }
            },
            {
                keys: [38], // UP
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl)
                        player.setVolume(Math.min(player.getVolume() + 0.1, 1));
                }
            },
            {
                keys: [40], // DOWN
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl)
                        player.setVolume(Math.max(player.getVolume() - 0.1, 0));
                }
            },
            {
                keys: [
                    37, // LEFT
                    227 // Google TV rewind
                ],
                action: function(player, keyCode, activeModifiers) {
                    if(!isNaN(player.getDuration()) && player.getDuration() > 0) {
                        if(player.isVideo) {
                            player.showControls();
                            player.startControlsTimer();
                        }
                        
                        var seekDuration = activeModifiers.shift ? -3 : (activeModifiers.alt ? -10 : (activeModifiers.ctrl ? -60 : undefined))
                        
                        if(seekDuration)
                            player.seek(seekDuration);
                    }
                }
            },
            {
                keys: [
                    39, // RIGHT
                    228 // Google TV forward
                ], 
                action: function(player, keyCode, activeModifiers) {
                    if(!isNaN(player.getDuration()) && player.getDuration() > 0) {
                        var seekDuration = activeModifiers.shift ? 3 : (activeModifiers.alt ? 10 : (activeModifiers.ctrl ? 60 : undefined))
                        
                        if(seekDuration)
                            player.seek(seekDuration);
                        
                        if(player.isVideo) {
                            player.showControls();
                            player.startControlsTimer();
                        }
                    }
                }
            },
            {
                keys: [70], // f
                action: function(player, keyCode, activeModifiers) {
                    if(!activeModifiers.ctrl)
                        return;
                    
                    if(typeof player.enterFullScreen != 'undefined') {
                        if(player.isFullScreen)
                            player.exitFullScreen();
                        else
                            player.enterFullScreen();
                    }
                }
            },
            {
                keys: [79], // O
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl)
                        player.openFileForm();
                }
            },
            {
                keys: [189],  // -
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl)
                        player.decCaptionSize();
                }
            },
            {
                keys: [187],  // +
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl)
                        player.incCaptionSize();
                }
            },
            {
                keys: [90],  // z
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl)
                        player.decCaptionDelay();
                }
            },
            {
                keys: [88],  // x
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl)
                        player.incCaptionDelay();
                }
            },
            {
                keys: [190],  // ,
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl)
                        player.incPlaybackRate();
                }
            },
            {
                keys: [188],  // .
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl)
                        player.decPlaybackRate();
                }
            },
            {
                keys: [191],  // /
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl)
                        player.resetPlaybackRate();
                }
            },
            {
                keys: [76],  // l
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl)
                        player.toggleLoop();
                }
            },
            {
                keys: [68], // D
                action: function(player, keyCode, activeModifiers) {
                    if(!activeModifiers.ctrl || !player.openedFile)
                        return;
                    
                    player.openSubtitleLogIn();
                }
            },
            {
                keys: [65], // D
                action: function(player, keyCode, activeModifiers) {
                    if(!activeModifiers.ctrl || !player.openedFile)
                        return;
                    
                    player.changeAspectRatio();
                }
            }
        ]
    };
})();