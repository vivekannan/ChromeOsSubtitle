(function() {
    // PLAY/pause BUTTON
    MediaElementPlayer.prototype.buildplaypause = function() {
        var t = this,
            playpause = mejs.Utility.createNestedElement('<div class="mejs-button mejs-playpause-button mejs-play" >' +
            '<button type="button" title="Play/Pause" aria-label="Play/Pause"></button>' +
        '</div>');
        
        playpause.addEventListener('click', function(e) {
            e.preventDefault();
            t.isPaused() ? t.play() : t.pause();
        });
        t.controls[0].appendChild(playpause);
    }
})();