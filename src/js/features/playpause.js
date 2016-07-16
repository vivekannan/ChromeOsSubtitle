(function($) {
    $.extend(mejs.MepDefaults, {
        playpauseText: mejs.i18n.t('Play/Pause')
    });
    
    // PLAY/pause BUTTON
    MediaElementPlayer.prototype.buildplaypause = function(player, controls, layers, media) {
        var play = $('<div class="mejs-button mejs-playpause-button mejs-play" >' +
                '<button type="button" title="' + this.options.playpauseText + '" aria-label="' + this.options.playpauseText + '"></button>' +
                '</div>')
            .appendTo(controls)
            .click(function(e) {
                e.preventDefault();
                
                if(media.paused) {
                    player.play();
                } else {
                    player.pause();
                }
            });
    }
})(mejs.$);