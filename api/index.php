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

// checks if a username exists
$app->post('/checkUsername',  function () use ( $app ) {
	$output = new stdClass();
	$params = json_decode($app->request()->getBody());
	
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	
	if(isset($params)){
		$usernameStr = $params -> username;
		// checks for unique username
		$sqlQueryStr = "SELECT username FROM users WHERE username='$usernameStr'";	
		$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
		if (mysqli_connect_errno()){
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		$result = mysqli_query($sql_db, $sqlQueryStr);
		// check if user data has returned
		$rowsNum = mysqli_num_rows($result);
		if($rowsNum != 0){
			$output -> successBln = false;
			$output -> messageStr = "This username is unavailable";
		}else{
			$output -> successBln = true;
			$output -> messageStr = "This username is available";
		}
		$sql_db -> close();
		$result -> close();
	}
	
	renderJSON( '200', 
				array( 	
								'type'=>'POST only',
								'description'=>'Checks if username exists',
								'called'=>'/checkUsername' ),
				$output);
});

// checks if a email exists
$app->post('/checkEmail',  function () use ( $app ) {
	$output = new stdClass();
	$params = json_decode($app->request()->getBody());
	
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	
	if(isset($params) && isset($params -> email)){
		$emailStr = $params -> email;
		// checks for unique email
		$sqlQueryStr = "SELECT email FROM users WHERE email='$emailStr'";
		$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
		if (mysqli_connect_errno()){
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		$result = mysqli_query($sql_db, $sqlQueryStr);
		// check if user data has returned
		$rowsNum = mysqli_num_rows($result);
		if($rowsNum != 0){
			$output -> successBln = false;
			$output -> messageStr = "E-mail address already exists";
		}else{
			$output -> successBln = true;
			$output -> messageStr = "E-mail address is valid";
		}
		$sql_db -> close();
		$result -> close();
		
	}else{
		
		$output -> successBln = false;
		$output -> messageStr = "Parameter not set";
		
		header('HTTP/1.1 401 Unauthorized', true, 401);
		renderJSON( '401',
		array( 	'type'=>'POST only',
		'description'=>'Checks if e-mail exists',
		'called'=>'/checkEmail' ),
		$output);
		exit;
	}
	
	renderJSON( '200',
				array( 	
								'type'=>'POST only',
								'description'=>'Checks if e-mail exists',
								'called'=>'/checkEmail' ),
				$output);
});
	
	
	
// Registers a user
$app->post('/register',  function () use ( $app ) {
				$output = new stdClass();
				$params = json_decode($app->request()->getBody());
				$passwordStr = $params -> password;
				$emailStr = $params -> email;
				$firstnameStr = $params -> firstname;
				$lastnameStr = $params -> lastname;
				$usernameStr = $params -> username;
				$errorBln = false;
				$errorMessageArr = array();
				$minPasswordLenNum = 8;
				$maxPasswordLenNum = 100;
				$maxEmailLenNum = 255;
				$maxNameLenNum = 35;
				$maxUsernameLenNum = 30;
				
				global $db_host;
				global $db_username;
				global $db_password;
				global $db_database;
				
				//checks password
				if(!isset($passwordStr)){
					$errorBln = true;
				}else{
					if(strlen($passwordStr) < $minPasswordLenNum){
						// password too short
						$errorMessageArr[] = "Password length is too short";
						$errorBln = true;
					}
					if(strlen($passwordStr) > $maxPasswordLenNum){
						// password too long
						$errorMessageArr[] = "Password length is too long";
						$errorBln = true;
					}
				}
				
				if(!isset($emailStr)){
					$errorBln = true;
				}else{
					// check unique and valid email
					if(strlen($emailStr)>$maxEmailLenNum){
						// email too long
						$errorMessageArr[] = "E-mail address is too long";
						$errorBln = true;
					}
					
					// checks for unique email
					$sqlQueryStr = "SELECT email FROM users WHERE email='$emailStr'";

					$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
					if (mysqli_connect_errno()){
						echo "Failed to connect to MySQL: " . mysqli_connect_error();
					}
					
					$result = mysqli_query($sql_db, $sqlQueryStr);
					
					// check if user data has returned
					$rowsNum = mysqli_num_rows($result);
					
					if($rowsNum != 0){
						$errorMessageArr[] = "E-mail address already exists";
						$errorBln = true;
					};
					
					$sql_db -> close();
					$result -> close();
				}
				
				if(!isset($firstnameStr)){
					$errorBln = true;
				}else{
					if(strlen($firstnameStr)>$maxNameLenNum){
						// name too long
						$errorMessageArr[] = "First name is too long";
						$errorBln = true;
					}
				}
				
				if(!isset($lastnameStr)){
					$errorBln = true;
				}else{
					if(strlen($lastnameStr)>$maxNameLenNum){
						// name too long
						$errorMessageArr[] = "Last name is too long";
						$errorBln = true;
					}
				}
				
				if(!isset($usernameStr)){
					$errorBln = true;
				}else{
					
					if(strlen($usernameStr)>$maxUsernameLenNum){
						// username too long
						$errorMessageArr[] = "Username is too long";
						$errorBln = true;
					}
					
					// checks for unique username
					$sqlQueryStr = "SELECT username FROM users WHERE username='$usernameStr'";
					
					$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
					if (mysqli_connect_errno()){
						echo "Failed to connect to MySQL: " . mysqli_connect_error();
					}
						
					$result = mysqli_query($sql_db, $sqlQueryStr);
						
					// check if user data has returned
					$rowsNum = mysqli_num_rows($result);
						
					if($rowsNum != 0){
						$errorMessageArr[] = "Username is not available";
						$errorBln = true;
					};
						
					$sql_db -> close();
					$result -> close();
				}
			
				// check for errors
				if($errorBln){
					$output -> errorMessagesArr = $errorMessageArr;
					$output -> messageStr = "Registration Unsuccessful";
					$output -> successBln = false;
					header('HTTP/1.1 401 Unauthorized', true, 401);
					renderJSON( '401',
					array( 	'type'=>'GET only',
					'description'=>'Registers user',
					'called'=>'/register' ),
					$output);
					exit;
				}else{
				// if no errors, insert new user
					$passwordMd5 = md5($passwordStr);
					$todaysDate = date("Y-m-d");
					
					$sqlQueryStr = "INSERT INTO users VALUES ('', '$usernameStr', '$firstnameStr', '$lastnameStr', '$emailStr', '$passwordMd5', '$todaysDate', '0', '', '', '')";
					
					$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
					if (mysqli_connect_errno()){
						echo "Failed to connect to MySQL: " . mysqli_connect_error();
					}
					
					$result = mysqli_query($sql_db, $sqlQueryStr);

				}
				
                renderJSON( '200', 
		                	array( 	'type'=>'POST only',
		                					'description'=>'Registers user',
		                					'called'=>'/register' ),
                			$output);
});


// Checks if a user is logged in
$app->post('/isLoggedIn',  function () use ( $app ) {

		$output = new stdClass();
		
		if(isset($_SESSION)){
			if(isset($_SESSION['loggedInBln']) && $_SESSION['loggedInBln'] == true){
					
			}else{
				$_SESSION['loggedInBln'] = false;
			}
		}else{
			$_SESSION['loggedInBln'] = false;
		}
		
		$output -> userSessionObj = $_SESSION;
			
            renderJSON( '200', 
	                	array( 	'type'=>'POST only',
	                					'description'=>'Checks if a user is logged in',
	                					'called'=>'/isLoggedIn' ),
            			$output);  			
});

// Logs a user in
$app->post('/login',  function () use ( $app ) {
				$output = new stdClass();
				$params = json_decode($app->request()->getBody());
				$passwordStr = $params -> password;
				$emailStr = $params -> email;
				
				//	$passwordStr = "password";
				//	$emailStr = "kendrick.lin@hotmail.com";
				
				$sqlQueryStr = "SELECT * FROM users WHERE email='$emailStr'";
								
				global $db_host;
				global $db_username;
				global $db_password;
				global $db_database;
				
				$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
				if (mysqli_connect_errno()){
					echo "Failed to connect to MySQL: " . mysqli_connect_error();
				}

				$result = mysqli_query($sql_db, $sqlQueryStr);

				// check if user data has returned
				$rowsNum = mysqli_num_rows($result);
				
				// no user found
				if($rowsNum == 0){
					$output -> messageStr = "Log in unsuccessful, email not found";
					$output -> successBln = false;
					header('HTTP/1.1 401 Unauthorized', true, 401);
				    renderJSON( '401', 
		                	array( 	'type'=>'GET only',
		                					'description'=>'Logs user in',
		                					'called'=>'/login' ),
                			$output);
					exit;
				//user found
				}else{
					$dbUserObj = mysqli_fetch_assoc($result);
				}
	
				//Verify password
				if($dbUserObj['password'] == $passwordStr){
					$output -> messageStr = "Log in successful";
					$output -> successBln = true;
				}else{
					$output -> messageStr = "Log in unsuccessful, incorrect password";
					$output -> successBln = false;
					header('HTTP/1.1 401 Unauthorized', true, 401);
				    renderJSON( '401', 
		                	array( 	'type'=>'GET only',
		                					'description'=>'Logs user in',
		                					'called'=>'/login' ),
                			$output);
					exit;	
				}
				
				$sql_db -> close(); 
				$result -> close(); 
				
				$_SESSION['id'] = $dbUserObj['id'];
				$_SESSION['email'] = $dbUserObj['email'];
				$_SESSION['username'] = $dbUserObj['username'];
				$_SESSION['loggedInBln'] = true;

				$output -> userSessionObj = $_SESSION;
				
                renderJSON( '200', 
		                	array( 	'type'=>'POST only',
		                					'description'=>'Logs user in',
		                					'called'=>'/login' ),
                			$output);
});

// LOGS USER OUT 
$app->post('/logout',  function () use ( $app ) {
	$output = new stdClass();
	
	if (session_status() == PHP_SESSION_NONE) {
	    session_start();
	}

	session_destroy();
	
	if(session_status() != PHP_SESSION_ACTIVE){
		$output -> messageStr = "Log out successful";
		$output -> successBln = true;	
	}else{
		$output -> messageStr = "Log out failed";
		$output -> successBln = false;
		
		header('HTTP/1.1 401 Unauthorized', true, 401);
				    renderJSON( '401', 
		                	array( 	'type'=>'GET only',
		                					'description'=>'Logs user out',
		                					'called'=>'/logout' ),
                			$output);
					exit;	
	}

	renderJSON( '200', 
	    	array( 	'type'=>'POST only',
	    					'description'=>'Logs user out',
	    					'called'=>'/logout' ),
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