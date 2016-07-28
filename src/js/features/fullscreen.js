(function() {
    MediaElementPlayer.prototype.buildfullscreen = function() {
        var t = this,
            fullscreenBtn = mejs.Utility.createNestedElement('<div class="mejs-button mejs-fullscreen-button">' +
                    '<button type="button" title="Toggle Fullscreen" aria-label="Toggle Fullscreen"></button>' +
                '</div>');
        
        fullscreenBtn.addEventListener('click', function() {
            t[document.webkitIsFullScreen ? 'exitFullScreen' : 'enterFullScreen']();
        });
        
        t.controls[0].appendChild(fullscreenBtn);
        
        document.addEventListener("webkitfullscreenchange", function() {
            fullscreenBtn.classList[document.webkitIsFullScreen ? 'add' : 'remove']('mejs-unfullscreen');
        }, false);
    }
    
    MediaElementPlayer.prototype.enterFullScreen = function() {
        this.container[0].webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    
    MediaElementPlayer.prototype.exitFullScreen = function() {
        document.webkitCancelFullScreen();
    }
})();