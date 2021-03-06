(function($) {
    MediaElementPlayer.prototype.buildsource = function() {
        var t = this,
            openFileInput = mejs.Utility.createNestedElement('<input style="display:none" type="file" id="openfile_input" multiple/>'),
            open = mejs.Utility.createNestedElement('<div class="mejs-button mejs-source-button mejs-source" >' +
                '<button type="button" title="' + mejs.i18n.t('Open video...') + '" aria-label="' + mejs.i18n.t('Open video...') + '"></button>' +
                '</div>');
        
        t.controls[0].appendChild(openFileInput);
        t.controls[0].appendChild(open);
        t.openedFile = null;
        
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
                openFileInput.click();
            }
        };
        
        open.addEventListener('click', function(e) {
            e.preventDefault();
            t.openFileForm();
            return false;
        });
        
        openFileInput.addEventListener('change', function(e) {
            if(openFileInput.files.length > 0) {
                t.stop();
            }
            
            t.tracks = [];
            
            t.playlist = openFileInput.files;
            t.setSrc(t.playlist[0]);
            t.playIndex = 0;
        });
    }
})(mejs.$);