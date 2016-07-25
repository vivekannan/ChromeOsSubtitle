// necessary detection (fixes for <IE9)
mejs.MediaFeatures = {
    init: function() {
        var
            t = this,
            ua = window.navigator.userAgent.toLowerCase(),
            i,
            v,
            html5Elements = ['source', 'track', 'audio', 'video'];
        
        // detect browsers (only the ones that have some kind of quirk we need to work around)
        t.isAndroid = (ua.match(/android/i) !== null);
        t.isBustedAndroid = (ua.match(/android 2\.[12]/) !== null);
        t.isBustedNativeHTTPS = (location.protocol === 'https:' && (ua.match(/android [12]\./) !== null || ua.match(/macintosh.* version.* safari/) !== null));
        t.isChrome = (ua.match(/chrome/gi) !== null);
        t.isWebkit = (ua.match(/webkit/gi) !== null);
        t.hasTouch = ('ontouchstart' in window);
        
        // create HTML5 media elements for IE before 9, get a <video> element for fullscreen detection
        for(i = 0; i < html5Elements.length; i++) {
            v = document.createElement(html5Elements[i]);
        }
        
        t.supportsMediaTag = (typeof v.canPlayType !== 'undefined' || t.isBustedAndroid);
    }
};

mejs.MediaFeatures.init();