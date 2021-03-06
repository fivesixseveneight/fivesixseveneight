/**
 * configure RequireJS
 * prefer named modules to long paths, especially for version mgt
 * or 3rd party libraries
 */
require.config({
	optimize: "uglify",
	waitSeconds: 10,
    paths: {
        'angular': '../lib/angular/angular',
        'angular-route': '../lib/angular-route/angular-ui-router',
        'angular-statehelper': '../lib/angular-route/statehelper',
        'angular-sanitize': '../lib/angular-sanitize/angular-sanitize',
        'angular-animate': '../lib/angular-animate/angular-animate',
        'angular-slider': "../lib/angular-slider/ngslider.min",
        'domReady': '../lib/requirejs-domready/domReady',
        'jquery': "../lib/jquery/jquery",
        'jqueryValidate': "../lib/jquery/jquery.validate",
        'bootstrap': "../lib/bootstrap/js/bootstrap.min",
	    'bootstrap-select': "../lib/bootstrap-select/bootstrap-select",
	    'ui.bootstrap': "../lib/bootstrap/js/ui-bootstrap",
    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-statehelper': {
            deps: ['angular-route']
        },
        'angular-animate': {
            deps: ['angular']
        },
        'angular-sanitize': {
            deps: ['angular']
        },
        'angular-slider': {
            deps: ['angular']
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrap-select': {
            deps: ['bootstrap']
        },
        'ui.bootstrap': {
            deps: ['angular', 'bootstrap']
        },
        'jqueryValidate': {
            deps: ['jquery']
        } 
        
    },
    deps: [
        // kick start application... see angularbootstrap.js
        './angularbootstrap'
    ]
});
