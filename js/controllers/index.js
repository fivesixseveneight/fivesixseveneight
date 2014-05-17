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
  
    './about/about-controller',
    './admin/admin-controller',
    
    './campaign/campaign-controller',
    './campaign/mycampaigns-controller',
    './campaign/campaignrequests-controller',
    './campaign/newcampaign-controller',
    './campaign/searchcampaigns-controller',
    
    './flagged/flagged-controller',
    
    './funds/funds-controller',
    
    './help/help-controller',
    
    './home/home-controller',
    
    './jobs/jobs-controller',
 
    './login/login-controller',
    
    './logout/logout-controller',
    
    './messages/messages-controller',
    
    './notifications/notifications-controller',
    
    './overview/overview-controller',
    
    './profile/profile-controller',
    
    './registration/confirmregistration-controller',
    './registration/register-controller',

    './reporting/reporting-controller',
    
    './settings/settings-controller',
    
    './terms/terms-controller',
    
    './tools/tools-controller',
     
    './users/findadvertisers-controller',
    './users/findpublishers-controller',
    './users/foundadvertisers-controller',
    './users/foundpublishers-controller',
    './users/users-controller'


], function () {});
