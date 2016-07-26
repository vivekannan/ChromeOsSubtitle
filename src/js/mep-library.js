if(typeof Haggle != 'undefined' && false) {
    mejs.$ = Haggle;
}
else if(typeof jQuery != 'undefined') {
    mejs.$ = jQuery;
} else if(typeof ender != 'undefined') {
    mejs.$ = ender;
}