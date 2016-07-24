(function($) {
    var showRemaining = false;
    
    // current and duration 00:00 / 00:00
    MediaElementPlayer.prototype.buildcurrent = function(player, controls, layers, media) {
        var t = this;
        
        $('<div class="mejs-time">' +
            '<span class="mejs-currenttime">00:00</span>' +
        '</div>')
            .appendTo(controls);
        
        t.currenttime = t.controls.find('.mejs-currenttime');
        
        media.addEventListener('timeupdate', function() {
            if(!player.controlsAreVisible)
                return;
            
            player.updateCurrent();
        }, false);
        
        t.currenttime[0].addEventListener('click', function() {
            showRemaining = !showRemaining;
            
            if(player.isPaused())
                t.updateCurrent();
            
            t.setControlsSize();
        })
    }
    
    MediaElementPlayer.prototype.buildduration = function(player, controls, layers, media) {
        $('<span>/</span><span class="mejs-duration">00:00</span>')
            .appendTo(controls.find('.mejs-time'));
        
        this.durationD = this.controls.find('.mejs-duration');
    }
    
    MediaElementPlayer.prototype.updateCurrent = function() {
        if(this.currenttime) {
            if(showRemaining) {
                this.currenttime.html('-' + mejs.Utility.secondsToTimeCode(this.getDuration() - this.getCurrentTime()));
            }
            else {
                this.currenttime.html(mejs.Utility.secondsToTimeCode(this.getCurrentTime()));
            }
        }
    }
    
    MediaElementPlayer.prototype.updateDuration = function() {
        //Toggle the long video class if the video is longer than an hour.
        this.container.toggleClass("mejs-long-video", this.media.duration > 3600);
        
        if(this.durationD && this.media.duration) {
            this.durationD.html(mejs.Utility.secondsToTimeCode(this.media.duration));
        }
    }
})(mejs.$);