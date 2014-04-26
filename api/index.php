<?php
/**
 * This file contains the main ROUTES and REST interface for this site.
 *
 * @package    API
 * @author     Kendrick Lin
 */

// JSON headers
// JSON only. ( json + jsonP )
header('content-type: application/json; charset=utf-8');

$time_start = microtime();

require_once dirname(__FILE__) . '/lib/slim/Slim.php';
require_once dirname(__FILE__) . '/lib/orm/Idorm.php';
require_once dirname(__FILE__) .'/lib/facebook/src/facebook.php';

/*
*
* database configs
*
*/ 
$db_host = "localhost";
$db_username = "linkendr_root";
$db_password = "1password1";
$db_database = "linkendr_fivesixseveneight";
 
/**
 * App Instance
 */
$app = new Slim();
$app->config( 'debug', true );
$app->facebook = new Facebook(array(
  'appId'  => '224679534393438',
  'secret' => 'e7ee425e809bd0ffb976d5968a3a5e8c',
));


// ROUTES
$app->get('/',  function () use ( $app ) {
                renderJSON( '', '', '' );
});

// TEST
$app->get('/test',  function () use ( $app ) {
				$output = [];
                renderJSON( '200', 
		                	array( 			
		                					'type'=>'GET only',
		                					'description'=>'Test Api',
		                					'called'=>'/test' ),
                			$output);
});





// Contact
$app->get('/contact-page',  function () use ( $app ) {
				$wp_query = new WP_Query(array(				 
				   'pagename' => 'page-contact',
    	           'posts_per_page' => -1
    	        ));            	      	
    	        
    	      	$output 			= new stdClass();
    	      	$queried_object 	= new stdClass();
    	        $queried_object 	= $wp_query->queried_object;
	     		$output->id 		= $queried_object->ID;
				$output->title 		= $queried_object->post_title;
				$output->content 	= $queried_object->post_content;
                renderJSON( '200', 
		                	array( 	'type'=>'GET only',
		                					'description'=>'Contact Page Endpoint',
		                					'called'=>'/contact-page' ),
                			$output);
});

$app->get('/contact-posts',  function () use ( $app ) {
				$wp_query = new WP_Query(array(				 
				   'category_name' => 'cat-contact',
    	           'posts_per_page' => -1
    	        ));            	      	
    	      	$output = array();
    	        foreach ( $wp_query->posts as &$value ) {
    	     		$tmp 				= new stdClass();
    	     		$tmp->id 			= $value->ID;
  					$tmp->title 		= $value->post_title;
  					$tmp->content 		= $value->post_content;
  					$output[] 			= $tmp;
  					$tmp 				= null;
  				}
                renderJSON( '200', 
		                	array( 	'type'=>'GET only',
		                					'description'=>'Contact Posts Endpoint',
		                					'called'=>'/contact-posts' ),
                			$output);
});

// SEND AN EMAIL OUT
$app->post('/contact-form',  function () use ( $app ) {
				$output = "Success";
				$params = json_decode($app->request()->getBody());
				$nameStr = $params -> name;
				$emailStr = $params -> email;
				$messageStr = $params -> message;
				$sendMailBln = true;
				$sendMailSuccessBln = false;
				//this variable is used to detect spam
				
				if(isset($params -> name2)){
					$sendMailBln = false;
					// we lie to the front end saying email was sent if it is spam mail
					$sendMailSuccessBln = true;
				}
				
				if($sendMailBln == true){
				// only send mail if name2 isnt filled out, name2 isn't visible to humans
						$to      = 'info@kendricklin.com';
						$subject = $nameStr.' sent a message from the www.kendricklin.com';
						$message = $messageStr;
						$headers = 'From: '.$emailStr."\r\n" .
						    'Reply-To: '.$emailStr. "\r\n" .
						    'X-Mailer: PHP/' . phpversion();
						$sendMailSuccessBln = mail($to, $subject, $message, $headers);
				}
				
				$output = new stdClass();
				$output -> messageStr = "Thank you for contacting me, I will get back to you as soon as I can!";
				$output -> successBln = true;
				
				if($sendMailSuccessBln == false){
					$output -> messageStr = "Oops something went wrong on our end, please try contacting us again in a few minutes";
					$output -> successBln = false;
					
					header('HTTP/1.1 404 Not Found', true, 404);
				    renderJSON( '404', 
		                	array( 	'type'=>'GET only',
		                					'description'=>'Contact Page Form Submission',
		                					'called'=>'/contact-form' ),
                			$output);
					exit;
				}

                renderJSON( '200', 
		                	array( 	'type'=>'GET only',
		                					'description'=>'Contact Page Form Submission',
		                					'called'=>'/contact-form' ),
                			$output);
});

// FACEBOOK
$app->get('/facebookAppId',  function () use ( $app ) {
				$output = new stdClass();
				$output->fbId = $app->facebook->getAppID();
				
                renderJSON( '200', 
		                	array( 			
		                					'type'=>'GET only',
		                					'description'=>'gets the app id for facebook',
		                					'called'=>'/facebookAppId' ),
                			$output);
});

// FACEBOOK
$app->get('/facebookGetUser',  function () use ( $app ) {
				$output = new stdClass();
				
				$fbId = $app->facebook->getUser();
				
				if($fbId){
					$output->fbUser = $app->facebook->api('/me');
				}else{
					$output->fbUser = [];
				}
				
				
                renderJSON( '200', 
		                	array( 			
		                					'type'=>'GET only',
		                					'description'=>'Gets the currently logged in facebook user',
		                					'called'=>'/facebookGetUser' ),
                			$output);
});





/*
*
*	DATABASE
*	
*/
// GET USERS
$app->get('/getUsers',  function () use ( $app ) {
				$output = new stdClass();
				
				$sqlQueryStr = "SELECT * FROM users";
				
				$output -> usersArr = fetchSqlQuery($sqlQueryStr);		
                renderJSON( '200', 
		                	array( 			
		                					'type'=>'GET only',
		                					'description'=>'Gets users from database',
		                					'called'=>'/getUsers' ),
                			$output);
                			
                			
});


/*
*	fetchSqlQuery
*	
*	fetches data from database
*	
*/

function fetchSqlQuery($query){
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	
	$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
	// Check connection
	if (mysqli_connect_errno()){
	 echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	$data = [];
	$result = mysqli_query($sql_db, $query);
	while ($row = mysqli_fetch_assoc($result)) {
		$data[] = $row;
    }
	$sql_db -> close(); 
	$result -> close(); 
	return $data;
};


/**
 * Render View - JSON output
 *
 * @param string $output PHP object to render to client
 * @return mixed will always return a JSON object with an result or error description
 */
function renderJSON( $status, $info, $output ) {

	if ( isset($_GET['callback']) ) {

		exit( $_GET['callback'] . '(' . json_encode( array('status'=>$status, 'info'=>$info, 'data'=>$output ) )  . ')' );

	} else {

		exit( json_encode( array('status'=>$status, 'info'=>$info, 'data'=>$output ) ) );

	}
}


$app->run();

// find new timer

?>