(function($) {
    var activeTimer = null;
    
    MediaElementPlayer.prototype.buildnotification = function() {
        this.notification = $('<div class="mejs-notification"></div>').appendTo($('.mejs-inner')).hide();
    }
    
    MediaElementPlayer.prototype.setNotification = function(text, timeout) {
        this.notification.text(text).show();
        this.startNotificationTimer(timeout);
    }
    
    MediaElementPlayer.prototype.startNotificationTimer = function(timeout) {
        var t = this;
        
        if(activeTimer != null)
            clearTimeout(activeTimer);
        
        activeTimer = setTimeout(function() { activeTimer = null; t.notification.hide(); }, timeout || 1000);
    }
})(mejs.$);
