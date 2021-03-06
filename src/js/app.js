var myURL = window.URL || window.webkitURL;

var mainMediaElement = null;

$('#main').append('<video id="player" controls="controls"></video>');

$('#player').mediaelementplayer({
    startLanguage: 'en',
    isVideo: true,
    hideCaptionsButtonWhenEmpty: false,
    mode: "native",
    success: function(mediaElement) {
        mainMediaElement = mediaElement;
        
        mainMediaElement.player.container
            .addClass('mejs-container-fullscreen');
        mainMediaElement.player.container
            .width('100%')
            .height('100%');
        
        var t = mainMediaElement.player;
        
        t.layers.children('div')
            .width('100%')
            .height('100%');
        console.log('78787');
        t.setControlsSize();
        
        function openCmdLineVideo() {
            if(!window.launchData || !window.launchData.items || window.launchData.items.length != 1)
                return false;
            
            entry = window.launchData.items[0].entry;
            
            if(entry === null)
                return;
            
            mainMediaElement.pause();
            entry.file(function fff(file) {
                mainMediaElement.player.openedFile = file;
                mainMediaElement.player.openedFileEntry = entry;
                
                mainMediaElement.player.setSrc(window.URL.createObjectURL(file));
            });
        }
        
        $(document).trigger("appStarted");
        
        openCmdLineVideo()
    }
});