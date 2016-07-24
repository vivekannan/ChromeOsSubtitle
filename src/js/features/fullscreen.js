(function($) {
    $.extend(mejs.MepDefaults, {
        fullscreenText: mejs.i18n.t('Fullscreen')
    });
    
    MediaElementPlayer.prototype.buildfullscreen = function(player, controls, layers, media) {
        if(!player.isVideo)
            return;
        
        var fullscreenBtn =
            $('<div class="mejs-button mejs-fullscreen-button">' +
                '<button type="button" title="' + this.options.fullscreenText + '" aria-label="' + this.options.fullscreenText + '"></button>' +
                '</div>')
            .appendTo(controls)
            .click(function() {
                if(document.webkitIsFullScreen) {
                    player.exitFullScreen();
                } else {
                    player.enterFullScreen();
                }
            });
        
        player.fullscreenBtn = fullscreenBtn;
        
        document.addEventListener("webkitfullscreenchange", function() {
            if(document.webkitIsFullScreen) {
                player.fullscreenBtn
                    .removeClass('mejs-fullscreen')
                    .addClass('mejs-unfullscreen');
            }
            else {
                player.fullscreenBtn
                    .removeClass('mejs-unfullscreen')
                    .addClass('mejs-fullscreen');
            }
            
            player.setControlsSize();
        }, false);
    }
    
    MediaElementPlayer.prototype.enterFullScreen = function() {
        this.container[0].webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    
    MediaElementPlayer.prototype.exitFullScreen = function() {
        document.webkitCancelFullScreen();
    }
})(mejs.$);