(function($) {
    // options
    $.extend(mejs.MepDefaults, {
        duration: -1
    });
    
    // current and duration 00:00 / 00:00
    MediaElementPlayer.prototype.buildcurrent = function(player, controls, layers, media) {
        var t = this;
        
        $('<div class="mejs-time">' +
                '<span class="mejs-currenttime">00:00</span>' +
        '</div>')
            .appendTo(controls);
            
        t.currenttime = t.controls.find('.mejs-currenttime');
        
        media.addEventListener('timeupdate', function() {
            player.updateCurrent();
        }, false);
    }
    
    MediaElementPlayer.prototype.buildduration = function(player, controls, layers, media) {
        var t = this;
        
        if(controls.children().last().find('.mejs-currenttime').length > 0) {
            $('<span>/</span>' + 
                    '<span class="mejs-duration">' +
                    (t.options.duration > 0 ?
                        mejs.Utility.secondsToTimeCode(t.options.duration) :
                        '00:00'
                    ) +
                    '</span>')
                .appendTo(controls.find('.mejs-time'));
        } else {
            // add class to current time
            controls.find('.mejs-currenttime').parent().addClass('mejs-currenttime-container');
            
            $('<div class="mejs-time mejs-duration-container">' +
                    '<span class="mejs-duration">' +
                    (t.options.duration > 0 ?
                        mejs.Utility.secondsToTimeCode(t.options.duration) :
                        '00:00'
                    ) +
                    '</span>' +
                    '</div>')
                .appendTo(controls);
        }
        
        t.durationD = t.controls.find('.mejs-duration');
        
        media.addEventListener('timeupdate', function() {
            player.updateDuration();
        }, false);
    }
    
    MediaElementPlayer.prototype.updateCurrent = function() {
        var t = this;
        
        if(t.currenttime) {
            t.currenttime.html(mejs.Utility.secondsToTimeCode(t.media.currentTime));
        }
    }
    
    MediaElementPlayer.prototype.updateDuration = function() {
        var t = this;
        
        //Toggle the long video class if the video is longer than an hour.
        t.container.toggleClass("mejs-long-video", t.media.duration > 3600);
        
        if(t.durationD && (t.options.duration > 0 || t.media.duration)) {
            t.durationD.html(mejs.Utility.secondsToTimeCode(t.options.duration > 0 ? t.options.duration : t.media.duration));
        }
    }
})(mejs.$);