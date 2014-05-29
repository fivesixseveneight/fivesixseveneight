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

/*
* sends an activation email to the user
*/
 
$app->post('/activate-email',  function () use ($app) {
	$output = new stdClass();
	$errorBln = false;
	$errorMsgStr = "";
	
	$params = json_decode($app->request()->getBody());
	
	if(isset($params) && isset($params -> userIdNum)){
		$userIdNum = $params -> userIdNum;
		// checks the user id in the session and makes sure it's who the user is
		if(checkUserIdConsistent($userIdNum)){
			sendActivationEmailById($userIdNum);
		}
	}else{
		$errorBln = true;
		$errorMsgStr = "User Id's dont match";
	}
	
	if($errorBln == true){
		$output -> successBln = false;
		$output -> messageStr = $errorMsgStr;
		header('HTTP/1.1 401 Unauthorized', true, 401);
		renderJSON( '401',
		array( 	'type'=>'POST only',
		'description'=>'Sends an activation email to the user',
		'called'=>'/activate-email' ),
		$output);
		exit;
	}
		
	$output -> successBln = true;
	renderJSON( '200',
	array( 	'type'=>'POST only',
	'description'=>'Sends an activation email to the user',
	'called'=>'/activate-email' ),
	$output);
	
});

/*
 * update emails for confirming newly registered users
 * who arent activated yet
 */

// Updates users email
$app->post('/update-email-form',  function () use ( $app ) {
	$output = new stdClass();
	$emailValidBln = false;
	$userIdValidBln = false;
	$userActivatedBln = false;
	$emailUpdatedObj;
	$userObj;
	$params = json_decode($app->request()->getBody());
	$errorBln = false;
	$errorMsgStr = "";
	
	if(isset($params) && isset($params -> email) && isset($params -> email2) && isset($params -> userIdNum)){
		$userIdNum = $params -> userIdNum; // 
		
		// checks the user id in the session and makes sure it's who the user is
		if(checkUserIdConsistent($userIdNum)){
			$emailStr = $params -> email;
			$email2Str = $params -> email2;
			
			// checks if emails are equal
			if($emailStr == $email2Str){
				$emailValidBln = checkEmailExists($emailStr) -> successBln;
				// checks if email exists
				if($emailValidBln){
					$userIdValidBln = checkUserIdExists($userIdNum) -> successBln;
					//checks if user id exists
					if($userIdValidBln){
						$userObj = getUserById($userIdNum); 
						//gets user data 
						if($userObj->successBln){
							$userActivatedBln = $userObj -> userObj['activatedBln'];
							// checks if user is activated already
							if(!$userActivatedBln){
								//query to update email
								$emailUpdatedObj = updateUserEmail($userIdNum, $emailStr);
								// update email
								if($emailUpdatedObj->successBln){
									// SUCCESS!
									// send activation email
									sendActivationEmailById($userIdNum);
								}else{
									$errorBln = true;
									$errorMsgStr = "There was an error in SQL update, can not update email address";
								}
							}else{
								$errorBln = true;
								$errorMsgStr = "User already activated, can not update email address";
							}
						}
					}else{
						$errorBln = true;
						$errorMsgStr = "User Id does not exist, can not update email address";
					}
				}else{
					$errorBln = true;
					$errorMsgStr = "Email address not valid, can not update email address";
				}
			}else{
				$errorBln = true;
				$errorMsgStr = "Emails do not match, can not update email address";
			}
		}else{
			$errorBln = true;
			$errorMsgStr = "Parameters are missing, can not update email address";
		}
	
	}else{	
		$errorBln = true;
		$errorMsgStr = "User id's don't match, can not update email address";
	}
	
	if($errorBln == true){
		$output -> successBln = false;
		$output -> messageStr = $errorMsgStr;
		header('HTTP/1.1 401 Unauthorized', true, 401);
		renderJSON( '401',
		array( 	'type'=>'POST only',
		'description'=>'Updates a users email address',
		'called'=>'/update-email-form' ),
		$output);
		exit;
	}

	$output -> successBln = true;
	renderJSON( '200',
	array( 	'type'=>'GET only',
	'description'=>'Updates a users email address',
	'called'=>'/update-email-form' ),
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
		$sqlQueryStr = "SELECT usernameStr FROM users WHERE usernameStr='$usernameStr'";	
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

	
	
	if(isset($params) && isset($params -> email)){
		$emailStr = $params -> email;
		$output = checkEmailExists($emailStr);
		
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
						$errorMessageArr['password'] = "Password length is too short";
						$errorBln = true;
					}
					if(strlen($passwordStr) > $maxPasswordLenNum){
						// password too long
						$errorMessageArr['password'] = "Password length is too long";
						$errorBln = true;
					}
				}
				
				if(!isset($emailStr)){
					$errorBln = true;
				}else{
					// check unique and valid email
					if(strlen($emailStr)>$maxEmailLenNum){
						// email too long
						$errorMessageArr['email'] = "E-mail address is too long";
						$errorBln = true;
					}
					
					// checks for unique email
					$sqlQueryStr = "SELECT emailStr FROM users WHERE emailStr='$emailStr'";

					$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
					if (mysqli_connect_errno()){
						echo "Failed to connect to MySQL: " . mysqli_connect_error();
					}
					
					$result = mysqli_query($sql_db, $sqlQueryStr);
					
					// check if user data has returned
					$rowsNum = mysqli_num_rows($result);
					
					if($rowsNum != 0){
						$errorMessageArr['email'] = "E-mail address already exists";
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
						$errorMessageArr['firstname'] = "First name is too long";
						$errorBln = true;
					}
				}
				
				if(!isset($lastnameStr)){
					$errorBln = true;
				}else{
					if(strlen($lastnameStr)>$maxNameLenNum){
						// name too long
						$errorMessageArr['lastname'] = "Last name is too long";
						$errorBln = true;
					}
				}
				
				if(!isset($usernameStr)){
					$errorBln = true;
				}else{
					
					if(strlen($usernameStr)>$maxUsernameLenNum){
						// username too long
						$errorMessageArr['username'] = "Username is too long";
						$errorBln = true;
					}
					
					// checks for unique username
					$sqlQueryStr = "SELECT usernameStr FROM users WHERE usernameStr='$usernameStr'";
					
					$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
					if (mysqli_connect_errno()){
						echo "Failed to connect to MySQL: " . mysqli_connect_error();
					}
						
					$result = mysqli_query($sql_db, $sqlQueryStr);
						
					// check if user data has returned
					$rowsNum = mysqli_num_rows($result);
						
					if($rowsNum != 0){
						$errorMessageArr['username'] = "Username is not available";
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
					$saltStr = generateRandomString();
					$passwordMd5 = md5($saltStr.$passwordStr);
					$todaysDate = date("Y-m-d");
					$sqlQueryStr = "INSERT INTO 
					users(
						userIdNum,
						usernameStr,
						firstnameStr,
						lastnameStr,
						emailStr,
						passwordStr,
						saltStr,
						signupDate,
						activatedBln
					)

					VALUES (
						'', 
						'$usernameStr', 
						'$firstnameStr', 
						'$lastnameStr', 
						'$emailStr', 
						'$passwordMd5', 
						'$saltStr', 
						'$todaysDate', 
						'0'
					)";
					
					$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
					if (mysqli_connect_errno()){
						echo "Failed to connect to MySQL: " . mysqli_connect_error();
					}
					
					$result = mysqli_query($sql_db, $sqlQueryStr);
				}
				
				$output -> messageStr = "Registration Successful";
				$output -> successBln = true;

				/*
				 * Login after registration
				 * */
				
				$sqlQueryStr = "SELECT * FROM users WHERE emailStr='$emailStr'";
				
				$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
				if (mysqli_connect_errno()){
					echo "Failed to connect to MySQL: " . mysqli_connect_error();
				}
				
				$result = mysqli_query($sql_db, $sqlQueryStr);
				// check if user data has returned
				$rowsNum = mysqli_num_rows($result);
				
				// no user found
				if($rowsNum == 0 || $rowsNum == null){
					$output -> messageStr = "Log in unsuccessful, email not found";
					$output -> successBln = false;
					header('HTTP/1.1 401 Unauthorized', true, 401);
					renderJSON( '401',
					array( 	'type'=>'GET only',
					'description'=>'Registers user',
					'called'=>'/register' ),
					$output);
					exit;
					//user found
				}
				
				$dbUserObj = mysqli_fetch_assoc($result);
				$passwordMd5 =  md5($dbUserObj['saltStr'].$passwordStr);
				
				//Verify password
				
				if($dbUserObj['passwordStr'] == $passwordMd5){
					$output -> messageStr = "Registration successful, Login successful";
					$output -> successBln = true;
				}else{
					$output -> messageStr = "Registration successful, Login unsuccessful, incorrect password";
					$output -> successBln = false;
					header('HTTP/1.1 401 Unauthorized', true, 401);
					renderJSON( '401',
					array( 	'type'=>'GET only',
					'description'=>'Registers user',
					'called'=>'/register' ),
					$output);
					exit;
				}
				
				$sql_db -> close();
				$result -> close();
				
				$_SESSION['userIdNum'] = $dbUserObj['userIdNum'];
				$_SESSION['emailStr'] = $dbUserObj['emailStr'];
				$_SESSION['usernameStr'] = $dbUserObj['usernameStr'];
				$_SESSION['firstnameStr'] = $dbUserObj['firstnameStr'];
				$_SESSION['lastnameStr'] = $dbUserObj['lastnameStr'];
				$_SESSION['publisherBln'] = $dbUserObj['publisherBln'];
				$_SESSION['advertiserBln'] = $dbUserObj['advertiserBln'];
				$_SESSION['activatedBln'] = $dbUserObj['activatedBln'];
				$_SESSION['prevloginDate'] = $dbUserObj['prevloginDate'];
				$_SESSION['lastloginDate'] = $dbUserObj['lastloginDate'];
				if($dbUserObj['adminBln'] == true || $dbUserObj['adminBln'] == 1){
					$_SESSION['adminBln'] = $dbUserObj['adminBln'];
				}
				
				$_SESSION['loggedInBln'] = true;
				
				
				$output -> userSessionObj = $_SESSION;
				
                renderJSON( '200', 
		                	array( 	'type'=>'POST only',
		                					'description'=>'Registers user',
		                					'called'=>'/register' ),
                			$output);
});



// Checks if a user is logged in
$app->post('/activate-account',  function () use ( $app ) {

	$output = new stdClass();

	
	
	renderJSON( '200',
	array( 	'type'=>'POST only',
	'description'=>'Activates a users account',
	'called'=>'/activate-account' ),
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
		
		if($_SESSION['loggedInBln'] == false){
			$_SESSION['userIdNum'] = "-1";
			$_SESSION['emailStr'] = "";
			$_SESSION['usernameStr'] = "Guest";
			$_SESSION['firstnameStr'] = "";
			$_SESSION['lastnameStr'] = "";
			$_SESSION['publisherBln'] = "0";
			$_SESSION['advertiserBln'] = "0";
			$_SESSION['activatedBln'] = "0";
			$_SESSION['prevloginDate'] = "";
			$_SESSION['lastloginDate'] = "";
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
				
				global $db_host;
				global $db_username;
				global $db_password;
				global $db_database;

				$sqlQueryStr = "SELECT * FROM users WHERE emailStr='$emailStr'";
				
				$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
				if (mysqli_connect_errno()){
					echo "Failed to connect to MySQL: " . mysqli_connect_error();
				}

				$result = mysqli_query($sql_db, $sqlQueryStr);
				// check if user data has returned
				$rowsNum = mysqli_num_rows($result);

				// no user found
				if($rowsNum == 0 || $rowsNum == null){
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
				}

				$dbUserObj = mysqli_fetch_assoc($result);
				$passwordMd5 =  md5($dbUserObj['saltStr'].$passwordStr);
				
				//Verify password
				
				if($dbUserObj['passwordStr'] == $passwordMd5){
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
				
				$_SESSION['userIdNum'] = $dbUserObj['userIdNum'];
				$_SESSION['emailStr'] = $dbUserObj['emailStr'];
				$_SESSION['usernameStr'] = $dbUserObj['usernameStr'];
				$_SESSION['firstnameStr'] = $dbUserObj['firstnameStr'];
				$_SESSION['lastnameStr'] = $dbUserObj['lastnameStr'];
				$_SESSION['publisherBln'] = $dbUserObj['publisherBln'];
				$_SESSION['advertiserBln'] = $dbUserObj['advertiserBln'];
				$_SESSION['activatedBln'] = $dbUserObj['activatedBln'];
				$_SESSION['prevloginDate'] = $dbUserObj['prevloginDate'];
				$_SESSION['lastloginDate'] = $dbUserObj['lastloginDate'];
				if($dbUserObj['adminBln'] == true || $dbUserObj['adminBln'] == 1){
					$_SESSION['adminBln'] = $dbUserObj['adminBln'];
				}

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
	
	session_unset();
	$_SESSION['loggedInBln'] = false;
	$_SESSION['userIdNum'] = "-1";
	$_SESSION['emailStr'] = "";
	$_SESSION['usernameStr'] = "Guest";
	$_SESSION['firstnameStr'] = "";
	$_SESSION['lastnameStr'] = "";
	$_SESSION['publisherBln'] = "0";
	$_SESSION['advertiserBln'] = "0";
	$_SESSION['activatedBln'] = "0";
	$_SESSION['prevloginDate'] = "";
	$_SESSION['lastloginDate'] = "";
	
	
	$output -> userSessionObj = $_SESSION;
	
	renderJSON( '200', 
	    	array( 	'type'=>'POST only',
	    					'description'=>'Logs user out',
	    					'called'=>'/logout' ),
			$output);
});




// Updates the users session
$app->post('/updateUserSession',  function () use ( $app ) {
	$output = new stdClass();
	$errorBln = false;
	$errorMsgStr = "";
	$dbUserObj;
	
	$params = json_decode($app->request()->getBody());
	$userIdNum = $params -> userIdNum;
	
	// checks the user id in the session and makes sure it's who the user is
	if(checkUserIdConsistent($userIdNum)){
		
		$dbUserObj = getUserById($userIdNum) -> userObj;
		
		$_SESSION['userIdNum'] = $dbUserObj['userIdNum'];
		$_SESSION['emailStr'] = $dbUserObj['emailStr'];
		$_SESSION['usernameStr'] = $dbUserObj['usernameStr'];
		$_SESSION['firstnameStr'] = $dbUserObj['firstnameStr'];
		$_SESSION['lastnameStr'] = $dbUserObj['lastnameStr'];
		$_SESSION['publisherBln'] = $dbUserObj['publisherBln'];
		$_SESSION['advertiserBln'] = $dbUserObj['advertiserBln'];
		$_SESSION['activatedBln'] = $dbUserObj['activatedBln'];
		$_SESSION['prevloginDate'] = $dbUserObj['prevloginDate'];
		$_SESSION['lastloginDate'] = $dbUserObj['lastloginDate'];
		
		$output -> userSessionObj = $_SESSION;
		
		
	}else{
		$errorBln = true;
		$errorMsgStr = "User Id's dont match, session not updated";
	}

	if($errorBln == true){
		$output -> successBln = false;
		$output -> messageStr = $errorMsgStr;
		header('HTTP/1.1 401 Unauthorized', true, 401);
		renderJSON( '401',
		array( 	'type'=>'POST only',
		'description'=>'Sends an activation email to the user',
		'called'=>'/activate-email' ),
		$output);
		exit;
	}

	renderJSON( '200',
	array( 	'type'=>'POST only',
	'description'=>'Updates the users session',
	'called'=>'/updateUserSession' ),
	$output);
});

	
	

/*
*	fetchSqlQuery
*	fetches data from database
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


/*
 *  get user session
 */

function getUserSession($userIdNum){
	$output = new stdClass();
		
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	
	$sqlQueryStr = "SELECT * FROM users WHERE userIdNum='$userIdNum'";
	
	$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
	if (mysqli_connect_errno()){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	$result = mysqli_query($sql_db, $sqlQueryStr);
	// check if user data has returned
	$rowsNum = mysqli_num_rows($result);
	
	// no user found
	if($rowsNum == 0 || $rowsNum == null){
		//No user found
		$output -> successBln = false;
		$sql_db -> close();
		$result -> close();
		return $output;
	}
	
	$dbUserObj = mysqli_fetch_assoc($result);
	
	$sql_db -> close();
	$result -> close();
	
	$_SESSION['userIdNum'] = $dbUserObj['userIdNum'];
	$_SESSION['emailStr'] = $dbUserObj['emailStr'];
	$_SESSION['usernameStr'] = $dbUserObj['usernameStr'];
	$_SESSION['firstnameStr'] = $dbUserObj['firstnameStr'];
	$_SESSION['lastnameStr'] = $dbUserObj['lastnameStr'];
	$_SESSION['publisherBln'] = $dbUserObj['publisherBln'];
	$_SESSION['advertiserBln'] = $dbUserObj['advertiserBln'];
	$_SESSION['activatedBln'] = $dbUserObj['activatedBln'];
	$_SESSION['prevloginDate'] = $dbUserObj['prevloginDate'];
	$_SESSION['lastloginDate'] = $dbUserObj['lastloginDate'];
	
	if($dbUserObj['adminBln'] == true || $dbUserObj['adminBln'] == 1){
		$_SESSION['adminBln'] = $dbUserObj['adminBln'];
	}
	
	$_SESSION['loggedInBln'] = true;
	
	$output -> successBln = true;
	$output -> userObj = $_SESSION;
	
	return $output;
}

/*
*	Send activation email to a user via their user id number
*/
function sendActivationEmailById($userIdNum){
	$output = new stdClass();
	$emailStr;
	$nameStr;
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	
	$userObj = getUserById($userIdNum) -> userObj;

	$emailStr = $userObj['emailStr'];
	$nameStr = $userObj['firstnameStr'];
	
	
	$codeStr = $userIdNum." ".$userObj['saltStr'];
	
	$encrypted = encrypt_decrypt('encrypt', $codeStr);
	
	$messageStr = $nameStr." please activate your account by clicking on the link below";

	$messageStr .= "http://www.stage.fivesixseveneight.co/#/activateaccount/".$encrypted;
		
	$to      = 'kendrick.lin@hotmail.com';
	//$to      = 'kendrick.lin@alumni.utoronto.ca';
	$subject = 'Please activate your account at www.fivesixseveneight.com';
	$message = $messageStr;
	$headers = 'From: no-reply@kendricklin.com \r\n' .
			'Reply-To: no-reply@kendricklin.com \r\n' .
		    'Content-type: text/html \r\n';
	$sendMailSuccessBln = mail($to, $subject, $message, $headers);
	
	
};


/*
*	getUserById
*	gets user data by id
*/

function getUserById($userIdNum){
	$output = new stdClass();
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	
	
	$sqlQueryStr = "SELECT * FROM users WHERE userIdNum='$userIdNum'";
	
	$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
	if (mysqli_connect_errno()){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	$result = mysqli_query($sql_db, $sqlQueryStr);
	// check if user data has returned
	$rowsNum = mysqli_num_rows($result);
	
	// no user found
	if($rowsNum == 0 || $rowsNum == null){
		$output -> successBln = false;
	}else{
		$output -> successBln = true;
		$dbUserObj = mysqli_fetch_assoc($result);
		$output -> userObj = $dbUserObj;
	}
	
	$sql_db -> close();
	$result -> close();
	
	return $output;
}

/*
*	checkUserIdExists
*
*	Checks if a user Id  exists
*/

function checkUserIdExists($userIdNum){
	$output = new stdClass();
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;

	
	if(isset($userIdNum)){

		// checks for unique email
		$sqlQueryStr = "SELECT userIdNum FROM users WHERE userIdNum='$userIdNum'";
		$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
		if (mysqli_connect_errno()){
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		$result = mysqli_query($sql_db, $sqlQueryStr);
		// check if user data has returned
		$rowsNum = mysqli_num_rows($result);

		if($rowsNum != 0){
			$output -> successBln = true;
			$output -> messageStr = "UserId in use";
		}else{
			$output -> successBln = false;
			$output -> messageStr = "UserId is not valid";
		}
		$sql_db -> close();
		$result -> close();

	}else{

		$output -> successBln = false;
		$output -> messageStr = "UserId parameter not set";

	}

	return $output;
};



/*
*	updateUserEmail
*	updates user's email by user id
*/

function updateUserEmail($userIdNum, $emailStr){
	$output = new stdClass();
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;

	if(isset($emailStr) && isset($userIdNum)){

		// checks for unique email
		$sqlQueryStr = "UPDATE users SET emailStr= '$emailStr' WHERE userIdNum='$userIdNum'";
		
		$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
		if (mysqli_connect_errno()){
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		$result = mysqli_query($sql_db, $sqlQueryStr);
		$output -> successBln = true;
		$output -> result = $result;
		$sql_db -> close();
	}else{
		$output -> successBln = false;
		$output -> messageStr = "Could not update email";
	}

	return $output;
};



/*
*	checkEmailExists
*
*	Checks if an email exists
*/

function checkEmailExists($emailStr){
	$output = new stdClass();
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	
	if(isset($emailStr)){

		// checks for unique email
		$sqlQueryStr = "SELECT emailStr FROM users WHERE emailStr='$emailStr'";
		$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
		if (mysqli_connect_errno()){
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		$result = mysqli_query($sql_db, $sqlQueryStr);
		// check if user data has returned
		$rowsNum = mysqli_num_rows($result);
		
		if($rowsNum != 0){
			$output -> successBln = false;
			$output -> messageStr = "E-mail address already in use";
		}else{
			$output -> successBln = true;
			$output -> messageStr = "E-mail address is valid";
		}
		$sql_db -> close();
		$result -> close();

	}else{
		
		$output -> successBln = false;
		$output -> messageStr = "E-mail parameter not set";
	
	}
	
	return $output;
};


/*
 * Generates a random string
 */
function generateRandomString($length = 64) {
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, strlen($characters) - 1)];
	}
	return $randomString;
}

/*
 * checks user id to determine if they are consistent with the user in the session
 * this is used to avoid malicious queries
 */

function checkUserIdConsistent($userIdNum){
	if($userIdNum == $_SESSION['userIdNum']){
		return true;
	}else{
		return false;
	}
}

/*
 * used for encrypting data
 */
function encrypt_decrypt($action, $string) {
	$output = false;
	// initialization vector
	if( $action == 'encrypt' ) {
		$output = base64_encode($string);
	}
	else if( $action == 'decrypt' ){
		$output = base64_decode($string);
	}
	return $output;
}


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