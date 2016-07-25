(function($) {
    $.extend(mejs.MepDefaults, {
        stopText: 'Stop'
    });
    
    // STOP BUTTON
    MediaElementPlayer.prototype.buildstop = function() {
        var t = this,
            stop = $('<div class="mejs-button mejs-stop-button mejs-stop">' +
                '<button type="button" title="' + t.options.stopText + '" aria-label="' + t.options.stopText + '"></button>' +
                '</div>')
            .appendTo(t.controls)
            .click(function() {
                if(t.getCurrentTime() > 0) {
                    t.stop();
                }
            });
    }
})(mejs.$);