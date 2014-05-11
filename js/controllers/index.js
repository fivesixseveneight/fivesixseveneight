/** attach controllers to this module 
 * if you get 'unknown {x}Provider' errors from angular, be sure they are
 * properly referenced in one of the module dependencies in the array.
 * below, you can see we bring in our services and constants modules 
 * which avails each controller of, for example, the `config` constants object.
 **/
define([
    './footer-controller',
    './header-controller',
    './primary-controller',
    './home-controller',
    './campaign-controller',
    './reporting-controller',
    './users-controller',
    './profile-controller',
    './notifications-controller',
    './messages-controller',
    './settings-controller',
    './tools-controller',
    './funds-controller',
    './overview-controller',
    './jobs-controller',
    './help-controller',
    './terms-controller',
    './about-controller',
    './login-controller',
    './logout-controller',
    './register-controller',
    './confirmregistration-controller'


], function () {});
