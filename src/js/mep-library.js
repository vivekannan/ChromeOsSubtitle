if(typeof Haggle != 'undefined' && false) {
    //Haggle aims to replace jQuery. Need this
    //for testing purposes.
    mejs.$ = Haggle;
}
else if(typeof jQuery != 'undefined') {
    mejs.$ = jQuery;
} else if(typeof ender != 'undefined') {
    mejs.$ = ender;
}