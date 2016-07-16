/*
Default options
*/
mejs.MediaElementDefaults = {
    // allows testing on HTML5, flash, silverlight
    // auto: attempts to detect what the browser can do
    // auto_plugin: prefer plugins and then attempt native HTML5
    // native: forces HTML5 playback
    // shim: disallows HTML5, will attempt either Flash or Silverlight
    // none: forces fallback view
    mode: 'auto',
    // remove or reorder to change plugin priority and availability
    plugins: ['flash', 'silverlight', 'youtube', 'vimeo'],
    // shows debug errors on screen
    enablePluginDebug: false,
    // overrides the type specified, useful for dynamic instantiation
    type: '',
    // name of flash file
    flashName: 'flashmediaelement.swf',
    // streamer for RTMP streaming
    flashStreamer: '',
    // turns on the smoothing filter in Flash
    enablePluginSmoothing: false,
    // enabled pseudo-streaming (seek) on .mp4 files
    enablePseudoStreaming: false,
    // start query parameter sent to server for pseudo-streaming
    pseudoStreamingStartQueryParam: 'start',
    // name of silverlight file
    silverlightName: 'silverlightmediaelement.xap',
    // default if the <video width> is not specified
    defaultVideoWidth: 480,
    // default if the <video height> is not specified
    defaultVideoHeight: 270,
    // overrides <video width>
    pluginWidth: -1,
    // overrides <video height>
    pluginHeight: -1,
    // additional plugin variables in 'key=value' form
    pluginVars: [],
    // rate in milliseconds for Flash and Silverlight to fire the timeupdate event
    // larger number is less accurate, but less strain on plugin->JavaScript bridge
    timerRate: 250,
    // initial volume for player
    startVolume: 0.8,
    success: function() {},
    error: function() {}
};

/*
Determines if a browser supports the <video> or <audio> element
and returns either the native element or a Flash/Silverlight version that
mimics HTML5 MediaElement
*/
mejs.MediaElement = function(el, o) {
    return mejs.HtmlMediaElementShim.create(el, o);
};

mejs.HtmlMediaElementShim = {
    create: function(el, o) {
        var
            options = mejs.MediaElementDefaults,
            htmlMediaElement = (typeof(el) == 'string') ? document.getElementById(el) : el,
            tagName = htmlMediaElement.tagName.toLowerCase(),
            isMediaTag = (tagName === 'audio' || tagName === 'video'),
            src = (isMediaTag) ? htmlMediaElement.getAttribute('src') : htmlMediaElement.getAttribute('href'),
            poster = htmlMediaElement.getAttribute('poster'),
            autoplay = htmlMediaElement.getAttribute('autoplay'),
            preload = htmlMediaElement.getAttribute('preload'),
            controls = htmlMediaElement.getAttribute('controls'),
            playback,
            prop;
        
        // extend options
        for(prop in o) {
            options[prop] = o[prop];
        }
        
        // clean up attributes
        src = (typeof src == 'undefined' || src === null || src == '') ? null : src;
        poster = (typeof poster == 'undefined' || poster === null) ? '' : poster;
        preload = (typeof preload == 'undefined' || preload === null || preload === 'false') ? 'none' : preload;
        autoplay = !(typeof autoplay == 'undefined' || autoplay === null || autoplay === 'false');
        controls = !(typeof controls == 'undefined' || controls === null || controls === 'false');
        
        // test for HTML5 and plugin capabilities
        playback = this.determinePlayback(htmlMediaElement, options, mejs.MediaFeatures.supportsMediaTag, isMediaTag, src);
        playback.url = (playback.url !== null) ? mejs.Utility.absolutizeUrl(playback.url) : '';
        
        if(playback.method == 'native') {
            // second fix for android
            if(mejs.MediaFeatures.isBustedAndroid) {
                htmlMediaElement.src = playback.url;
                htmlMediaElement.addEventListener('click', function() {
                    htmlMediaElement.play();
                }, false);
            }
            // add methods to native HTMLMediaElement
            
            return this.updateNative(playback, options, autoplay, preload);
        } else if(playback.method !== '') {
            // create plugin to mimic HTMLMediaElement
            
            return this.createPlugin(playback, options, poster, autoplay, preload, controls);
        } else {
            // boo, no HTML5, no Flash, no Silverlight.
            this.createErrorMessage(playback, options, poster);
            
            return this;
        }
    },
    
    determinePlayback: function(htmlMediaElement, options, supportsMediaTag, isMediaTag, src) {
        var
            mediaFiles = [],
            i,
            j,
            k,
            l,
            n,
            type,
            result = {
                method: '',
                url: '',
                htmlMediaElement: htmlMediaElement,
                isVideo: (htmlMediaElement.tagName.toLowerCase() != 'audio')
            },
            pluginName,
            pluginVersions,
            pluginInfo,
            dummy,
            media;
        
        // STEP 1: Get URL and type from <video src> or <source src>
        
        // supplied type overrides <video type> and <source type>
        if(typeof options.type != 'undefined' && options.type !== '') {
            // accept either string or array of types
            if(typeof options.type == 'string') {
                mediaFiles.push({
                    type: options.type,
                    url: src
                });
            } else {
                for(i = 0; i < options.type.length; i++) {
                    mediaFiles.push({
                        type: options.type[i],
                        url: src
                    });
                }
            }
            // test for src attribute first
        } else if(src !== null) {
            type = this.formatType(src, htmlMediaElement.getAttribute('type'));
            mediaFiles.push({
                type: type,
                url: src
            });
            // then test for <source> elements
        } else {
            // test <source> types to see if they are usable
            for(i = 0; i < htmlMediaElement.childNodes.length; i++) {
                n = htmlMediaElement.childNodes[i];
                if(n.nodeType == 1 && n.tagName.toLowerCase() == 'source') {
                    src = n.getAttribute('src');
                    type = this.formatType(src, n.getAttribute('type'));
                    media = n.getAttribute('media');
                    
                    if(!media || !window.matchMedia || (window.matchMedia && window.matchMedia(media).matches)) {
                        mediaFiles.push({
                            type: type,
                            url: src
                        });
                    }
                }
            }
        }
        
        // in the case of dynamicly created players
        // check for audio types
        if(!isMediaTag && mediaFiles.length > 0 && mediaFiles[0].url !== null && this.getTypeFromFile(mediaFiles[0].url).indexOf('audio') > -1) {
            result.isVideo = false;
        }
        
        // STEP 2: Test for playback method
        
        // special case for Android which sadly doesn't implement the canPlayType function (always returns '')
        if(mejs.MediaFeatures.isBustedAndroid) {
            htmlMediaElement.canPlayType = function(type) {
                return(type.match(/video\/(mp4|m4v)/gi) !== null) ? 'maybe' : '';
            };
        }
        
        // test for native playback first
        if(supportsMediaTag && (options.mode === 'auto' || options.mode === 'auto_plugin' || options.mode === 'native') && !(mejs.MediaFeatures.isBustedNativeHTTPS)) {
            if(!isMediaTag) {
                // create a real HTML5 Media Element 
                dummy = document.createElement(result.isVideo ? 'video' : 'audio');
                htmlMediaElement.parentNode.insertBefore(dummy, htmlMediaElement);
                htmlMediaElement.style.display = 'none';
                
                // use this one from now on
                result.htmlMediaElement = htmlMediaElement = dummy;
            }
            
            for(i = 0; i < mediaFiles.length; i++) {
                // normal check
                if(htmlMediaElement.canPlayType(mediaFiles[i].type).replace(/no/, '') !== ''
                    // special case for Mac/Safari 5.0.3 which answers '' to canPlayType('audio/mp3') but 'maybe' to canPlayType('audio/mpeg')
                    ||
                    htmlMediaElement.canPlayType(mediaFiles[i].type.replace(/mp3/, 'mpeg')).replace(/no/, '') !== '') {
                    result.method = 'native';
                    result.url = mediaFiles[i].url;
                    break;
                }
            }
            if(mediaFiles.length == 0) {
                result.method = 'native';
            }
            
            if(result.method === 'native') {
                if(result.url !== null) {
                    htmlMediaElement.src = result.url;
                }
                
                // if `auto_plugin` mode, then cache the native result but try plugins.
                if(options.mode !== 'auto_plugin') {
                    return result;
                }
            }
        }
        
        // what if there's nothing to play? just grab the first available
        if(result.method === '' && mediaFiles.length > 0) {
            result.url = mediaFiles[0].url;
        }
        
        return result;
    },
    
    formatType: function(url, type) {
        var ext;
        
        // if no type is supplied, fake it with the extension
        if(url && !type) {
            return this.getTypeFromFile(url);
        } else {
            // only return the mime part of the type in case the attribute contains the codec
            // see http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#the-source-element
            // `video/mp4; codecs="avc1.42E01E, mp4a.40.2"` becomes `video/mp4`
            
            if(type && ~type.indexOf(';')) {
                return type.substr(0, type.indexOf(';'));
            } else {
                return type;
            }
        }
    },
    
    getTypeFromFile: function(url) {
        url = url.split('?')[0];
        var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        return(/(mp4|m4v|ogg|ogv|webm|webmv|flv|wmv|mpeg|mov)/gi.test(ext) ? 'video' : 'audio') + '/' + this.getTypeFromExtension(ext);
    },
    
    getTypeFromExtension: function(ext) {
        switch(ext) {
            case 'mp4':
            case 'm4v':
                return 'mp4';
            case 'webm':
            case 'webma':
            case 'webmv':
                return 'webm';
            case 'ogg':
            case 'oga':
            case 'ogv':
                return 'ogg';
            default:
                return ext;
        }
    },
    
    createErrorMessage: function(playback, options, poster) {
        var
            htmlMediaElement = playback.htmlMediaElement,
            errorContainer = document.createElement('div');
            
        errorContainer.className = 'me-cannotplay';
        
        try {
            errorContainer.style.width = htmlMediaElement.width + 'px';
            errorContainer.style.height = htmlMediaElement.height + 'px';
        } catch(e) {}
        
        if(options.customError) {
            errorContainer.innerHTML = options.customError;
        } else {
            errorContainer.innerHTML = (poster !== '') ?
                '<a href="' + playback.url + '"><img src="' + poster + '" width="100%" height="100%" /></a>' :
                '<a href="' + playback.url + '"><span>' + mejs.i18n.t('Download File') + '</span></a>';
        }
        
        htmlMediaElement.parentNode.insertBefore(errorContainer, htmlMediaElement);
        htmlMediaElement.style.display = 'none';
        
        options.error(htmlMediaElement);
    },
    
    updateNative: function(playback, options, autoplay, preload) {
        var htmlMediaElement = playback.htmlMediaElement,
            m;
        
        // add methods to video object to bring it into parity with Flash Object
        for(m in mejs.HtmlMediaElement) {
            htmlMediaElement[m] = mejs.HtmlMediaElement[m];
        }
        
        // fire success code
        options.success(htmlMediaElement, htmlMediaElement);
        
        return htmlMediaElement;
    }
};

window.mejs = mejs;
window.MediaElement = mejs.MediaElement;