(function($) {
    var showRemaining = false;
    
    // current and duration 00:00 / 00:00
    MediaElementPlayer.prototype.buildcurrent = function() {
        var t = this;
        
        t.controls[0].appendChild(mejs.Utility.createNestedElement('<div class="mejs-time">' +
            '<span class="mejs-currenttime">00:00</span>' +
        '</div>'));
        
        t.time = t.controls.find('.mejs-time');
        t.currenttime = t.controls.find('.mejs-currenttime');
        
        t.media.addEventListener('timeupdate', function() {
            t.controlsAreVisible && t.updateCurrent();
        }, false);
        
        t.currenttime[0].addEventListener('click', function() {
            if(t.getDuration()) {
                showRemaining = !showRemaining;
                
                t.updateCurrent();
                t.setControlsSize();
            }
        })
    }
    
    MediaElementPlayer.prototype.buildduration = function() {
        $('<span>/</span><span class="mejs-duration">00:00</span></span>').appendTo(this.controls.find('.mejs-time'));
        
        this.durationD = this.controls.find('.mejs-duration');
    }
    
    MediaElementPlayer.prototype.updateCurrent = function() {
        if(showRemaining) {
            this.currenttime.text('-' + mejs.Utility.secondsToTimeCode(this.getDuration() - this.getCurrentTime()));
        }
        else {
            this.currenttime.text(mejs.Utility.secondsToTimeCode(this.getCurrentTime()));
        }
    }
    
    MediaElementPlayer.prototype.updateDuration = function() {
        //Toggle the long video class if the video is longer than an hour.
        this.container.toggleClass("mejs-long-video", this.getDuration() > 3600);
        
        if(this.durationD && this.getDuration()) {
            this.durationD.text(mejs.Utility.secondsToTimeCode(this.getDuration()));
        }
    }
})(mejs.$);