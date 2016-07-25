(function($) {
    MediaElementPlayer.prototype.buildsource = function() {
        var t = this,
            openFileInput = $('<input style="display:none" type="file" id="openfile_input"/>')
            .appendTo(t.controls);
        
        t.openedFile = null;
        
        var open = $('<div class="mejs-button mejs-source-button mejs-source" >' +
                '<button type="button" title="' + mejs.i18n.t('Open video...') + '" aria-label="' + mejs.i18n.t('Open video...') + '"></button>' +
                '</div>')
            .appendTo(t.controls);
        
        t.openFileForm = function() {
            if(t.getDuration() && !t.isPaused())
                t.pause();
            
            if(packaged_app) {
                chrome.fileSystem.chooseEntry({
                    type: "openFile"
                }, function(entry) {
                    entry.file(function fff(file) {
                        t.stop();
                        t.tracks = [];
                        
                        t.openedFile = file;
                        t.openedFileEntry = entry;
                        t.setSrc(window.URL.createObjectURL(file));
                    });
                });
            } else {
                openFileInput[0].click();
            }
        };
        
        open.click(function(e) {
            e.preventDefault();
            t.openFileForm();
            return false;
        });
        
        openFileInput.change(function(e) {
            t.stop();
            t.tracks = [];
            
            t.openedFile = openFileInput[0].files[0];
            t.setSrc(window.URL.createObjectURL(t.openedFile));
        });
    }
})(mejs.$);