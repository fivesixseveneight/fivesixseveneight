/**
 * attach services to this module
 * if you get 'unknown {x}Provider' errors from angular, be sure they are
 * properly referenced in one of the module dependencies in the array.
 * below, you can see we bring in our services and constants modules 
 * which avails each service of, for example, the `config` constants object.
 **/
define([
    './activation-email-post',
    './activate-account-post',
	'./contact-form-post',
	'./check-username-post',
	'./check-email-post',
	'./email-update-post',
	'./login-form-post',
	'./logout-post',
	'./register-form-post',
	'./update-session-post'
        ], function () {});
