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
        'angular-sanitize': '../lib/angular-sanitize/angular-sanitize',
        'angular-animate': '../lib/angular-animate/angular-animate',
        'domReady': '../lib/requirejs-domready/domReady',
        'jquery': "../lib/jquery/jquery",
        'jqueryValidate': "../lib/jquery/jquery.validate",
	    'bootstrap': "../lib/bootstrap/js/bootstrap.min"
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
        'angular-animate': {
            deps: ['angular']
        },
        'angular-sanitize': {
            deps: ['angular']
        },
        'bootstrap': {
            deps: ['jquery']
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
