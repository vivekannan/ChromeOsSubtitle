(function($) {
    MediaElementPlayer.prototype.buildplaylist = function() {
        this.playlist = [];
        this.playIndex = null;
    };
    
    MediaElementPlayer.prototype.next = function() {
        if(this.playIndex === this.playlist.length - 1) {
            return;
        }
        
        this.setSrc(this.playlist[++this.playIndex]);
    };
    
    MediaElementPlayer.prototype.previous = function() {
        if(this.playIndex === 0) {
            return;
        }
        
        this.setSrc(this.playlist[--this.playIndex]);
    };
})(mejs.$);