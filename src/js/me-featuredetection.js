// necessary detection (fixes for <IE9)
mejs.MediaFeatures = {
    init: function() {
        var
            t = this,
            ua = window.navigator.userAgent.toLowerCase();
        
        // detect browsers (only the ones that have some kind of quirk we need to work around)
        t.isAndroid = (ua.match(/android/i) !== null);
        t.isBustedAndroid = (ua.match(/android 2\.[12]/) !== null);
        t.isChrome = (ua.match(/chrome/gi) !== null);
        t.isWebkit = (ua.match(/webkit/gi) !== null);
        t.hasTouch = ('ontouchstart' in window);
    }
};

mejs.MediaFeatures.init();