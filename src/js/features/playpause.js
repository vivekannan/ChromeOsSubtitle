(function($) {
    $.extend(mejs.MepDefaults, {
        playpauseText: mejs.i18n.t('Play/Pause')
    });
    
    // PLAY/pause BUTTON
    MediaElementPlayer.prototype.buildplaypause = function() {
        var t = this;
        
        $('<div class="mejs-button mejs-playpause-button msjs-play" >' +
            '<button type="button" title="' + t.options.playpauseText + '" aria-label="' + t.options.playpauseText + '"></button>' +
        '</div>')
        .appendTo(t.controls)
        .click(function(e) {
            e.preventDefault();
            
            if(t.media.paused) {
                t.play();
            } else {
                t.pause();
            }
        });
    }
})(mejs.$);