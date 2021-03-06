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
*	App config
*/

$debugBln = true;
$lockdownBln = false;

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
 *	request edit profile 
 */
$app->post('/get-edit-profile',  function () use ($app) {
	$output = new stdClass();
	$errorBln = false;
	$params = json_decode($app->request()->getBody());
	$userIdNum = $params -> userIdNum;
	$dbUserAcctObj = [];
	$newdbUserAcctObj;
	if(checkUserIdConsistent($userIdNum) || checkUserIsAdmin($userIdNum)){
	// if(false){
		$userObj = new stdClass();
		
		$dbUserObj = getUserById($userIdNum) -> userObj;
		
		$dbUserAcctResultObj = getUserAccountsById($userIdNum);
		
		if($dbUserAcctResultObj -> successBln){
			$dbUserAcctObj = $dbUserAcctResultObj -> userObj;
		};
			
		$userObj -> useraccountIdNum = $dbUserAcctObj["useraccountIdNum"];
		$userObj -> userIdNum = $dbUserObj["userIdNum"];		
		$userObj -> usernameStr = $dbUserObj["usernameStr"];
		$userObj -> firstnameStr = $dbUserObj["firstnameStr"];
		$userObj -> lastnameStr = $dbUserObj["lastnameStr"];
		
		$userObj -> profilePicStr = $dbUserAcctObj["profilePicStr"];
		$userObj -> audienceStr = $dbUserAcctObj["audienceStr"];
		$userObj -> bioStr = $dbUserAcctObj["bioStr"];
		$userObj -> supportStr = $dbUserAcctObj["supportStr"];
		$userObj -> websiteStr = $dbUserAcctObj["websiteStr"];
		
		if(isset($dbUserAcctObj["companyObj"])){
			$userObj -> companyObj = $dbUserAcctObj["companyObj"];
		}
		if(isset($dbUserAcctObj["facebookObj"])){
			$userObj -> facebookObj = $dbUserAcctObj["facebookObj"];
		}
		if(isset($dbUserAcctObj["twitterObj"])){
			$userObj -> twitterObj = $dbUserAcctObj["twitterObj"];
		}
		if(isset($dbUserAcctObj["googleplusObj"])){
			$userObj -> googleplusObj = $dbUserAcctObj["googleplusObj"];
		}
		if(isset($dbUserAcctObj["instagramObj"])){
			$userObj -> instagramObj = $dbUserAcctObj["instagramObj"];
		}
		if(isset($dbUserAcctObj["pinterestObj"])){
			$userObj -> pinterestObj = $dbUserAcctObj["pinterestObj"];
		}
		if(isset($dbUserAcctObj["vineObj"])){
			$userObj -> vineObj = $dbUserAcctObj["vineObj"];
		}
		if(isset($dbUserAcctObj["youtubeObj"])){
			$userObj -> youtubeObj = $dbUserAcctObj["youtubeObj"];
		}
		
		$output -> permissionBln = true;
		$output -> userObj = $userObj;
		
	//	$output -> dbUserObj = $dbUserObj;
	//	$output -> dbUserAcctObj = $dbUserAcctObj;
		
	}else{

		$output -> permissionBln = false;
		$output -> messageStr = "User does not have permission to edit profile.";
	}
	
	if($errorBln == true){
		$output -> successBln = false;
		$output -> messageStr = $errorMsgStr;
		header('HTTP/1.1 401 Unauthorized', true, 401);
		renderJSON( '401',
		array( 	'type'=>'POST only',
		'description'=>'Checks if user has permission to edit profile, then sends profile info.',
		'called'=>'/get-edit-profile' ),
		$output);
		exit;
	}
	
	$output -> successBln = true;
	renderJSON( '200',
	array( 	'type'=>'POST only',
	'description'=>'Checks if user has permission to edit profile, then sends profile info.',
	'called'=>'/get-edit-profile' ),
	$output);
});

/*
* Sends a password recovery email
*/
$app->post('/recover-password',  function () use ($app) {
	$output = new stdClass();
	$errorBln = false;
	$errorMsgStr = "";

	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	
	$params = json_decode($app->request()->getBody());

	if(isset($params) && isset($params -> email)){
		$emailStr = $params -> email;
		
		$emailValidBln = checkEmailExists($emailStr) -> successBln;
	
		// if email doesnt exist
		if($emailValidBln){
			$errorBln = true;
			$errorMsgStr = "The email you submitted does not exist";
		//if email does exist
		}else{
			
			//generates a code for password reset
			$todaysDate = date('m/d/Y h:i:s a');
			$codeStr = md5($emailStr.$todaysDate);
			
			/*
			 * generate reset code
			 */
			$resetStr = $emailStr." "."reset"." ".$codeStr." ".$todaysDate;
			$encryptedCodeStr = encrypt_decrypt('encrypt', $resetStr);
			
			/*
			 * generate cancel/didn't request code
			 */
			$cancelStr = $emailStr." "."cancel"." ".$codeStr." ".$todaysDate;
			$encryptedCancelStr = encrypt_decrypt('encrypt', $cancelStr);
			
			//sets the generated code into the database
			$sqlQueryStr = "UPDATE users SET passwordRecoveryStr='$codeStr' WHERE emailStr='$emailStr'";
			
			$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
			if (mysqli_connect_errno()){
				echo "Failed to connect to MySQL: " . mysqli_connect_error();
			}
			$result = mysqli_query($sql_db, $sqlQueryStr);
			$sql_db -> close();
			
			// sends email
			$subject = 'Password recovery at fivesixseveneight.co';
			
			$messageStr = "You are receiving this email because a password recovery was requested at www.kendricklin.com \r\n\r\n\r\n";
			
			$messageStr .= "Please click the link below to reset your password. \r\n";
			$messageStr .= "http://www.stage.fivesixseveneight.co/#/recoverpassword/".$encryptedCodeStr." \r\n\r\n";
			
			$messageStr .= "If you didn't request a password reset, please click the link below \r\n";
			$messageStr .= "http://www.stage.fivesixseveneight.co/#/recoverpassword/".$encryptedCancelStr." \r\n\r\n";
			
			$sendMailSuccessBln = sendMail($emailStr, $subject, $messageStr);
		
			//	$output -> encryptedCodeStr = $encryptedCodeStr;
			//	$output -> encryptedCancelStr = $encryptedCancelStr;
			
		}
	}else{
			$errorBln = true;
			$errorMsgStr = "Email not submitted";
	}	
	if($errorBln == true){
		$output -> successBln = false;
		$output -> messageStr = $errorMsgStr;
		header('HTTP/1.1 401 Unauthorized', true, 401);
		renderJSON( '401',
		array( 	'type'=>'POST only',
		'description'=>'Sends a password recovery email',
		'called'=>'/recover-password' ),
		$output);
		exit;
	}

	$output -> successBln = true;
	renderJSON( '200',
	array( 	'type'=>'POST only',
	'description'=>'Sends a password recovery email',
	'called'=>'/recover-password' ),
	$output);
});
	
/*
* verifies password recovery code
*/
$app->post('/verify-recovery',  function () use ($app) {
	$output = new stdClass();
	$errorBln = false;
	$errorMsgStr = "";

	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	
	$params = json_decode($app->request()->getBody());
	$keyStr = $params -> activationIdNum;
	
	$decrypted = encrypt_decrypt('decrypt', $keyStr);
	// if the email is found
	try {
		$emailStr = explode(" ", $decrypted)[0];
		$instructionStr = explode(" ", $decrypted)[1];
		$passwordResetKeyStr = explode(" ", $decrypted)[2];
		$timeStr = explode(" ", $decrypted)[3];
		
		if($instructionStr == "reset" || $instructionStr == "cancel"){

			$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
			if (mysqli_connect_errno()){
				echo "Failed to connect to MySQL: " . mysqli_connect_error();
			}
			
			// checks database if the code was valid
			$sqlQueryStr = "SELECT emailStr, passwordRecoveryStr FROM users WHERE emailStr='$emailStr'";
			$result = mysqli_query($sql_db, $sqlQueryStr);
			$dbUserObj = mysqli_fetch_assoc($result);
			
			// if the database key is the same as the password reset key provided by user, reset
			if($dbUserObj['passwordRecoveryStr'] == $passwordResetKeyStr){

				if($instructionStr == "cancel"){
					// cancel
					// this resets the password recovery string
					$sqlQueryStr = "UPDATE users SET passwordRecoveryStr='' WHERE emailStr='$emailStr'";
					$result = mysqli_query($sql_db, $sqlQueryStr);
					$output -> messageStr = "We have cancelled the pending password reset and will look into issue.";
					$output -> editBln = false;
				}else if($instructionStr == "reset"){
					// reset
					$output -> messageStr = "Please enter your new password.";
					$output -> editBln = true;
				}
			
			}else{
				$errorBln = true;
				$errorMsgStr = "Reset password verification key is invalid";
			}
			
		//	$output -> dbUserObj = $dbUserObj;

		}else{
			$errorBln = true;
			$errorMsgStr = "Reset password verification key is invalid";
		}
		// if the email is not found
	} catch (Exception $e) {
		$emailStr = "";
		$instructionStr = "";
		$errorBln = true;
		$errorMsgStr = "Reset password verification key is invalid";
	}
	
	//	$output -> decrypted = $decrypted;
	
	if($errorBln == true){
		$output -> successBln = false;
		$output -> messageStr = $errorMsgStr;
		header('HTTP/1.1 401 Unauthorized', true, 401);
		renderJSON( '401',
		array( 	'type'=>'POST only',
		'description'=>'Verifies if password can be changed',
		'called'=>'/verify-recovery' ),
		$output);
		exit;
	}
	
	$output -> successBln = true;
	renderJSON( '200',
	array( 	'type'=>'POST only',
	'description'=>'Verifies if password can be changed',
	'called'=>'/verify-recovery' ),
	$output);
	
});

/*
 * Resets the password of the user
*/
$app->post('/reset-password',  function () use ($app) {
	$output = new stdClass();
	$errorBln = false;
	$errorMsgStr = "";
	$passwordApprovedBln = false;
	$saltStr = "";
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;

	$params = json_decode($app->request()->getBody());
	$keyStr = $params -> activationIdNum;
	$passwordStr = $params -> password;
	$password2Str = $params -> password2;
	$minPasswordLenNum = 8;
	$maxPasswordLenNum = 100;
	
	//checks password
	if(!isset($passwordStr) || !isset($password2Str)){
		$errorBln = true;
		$errorMsgStr = "Passwords not set";
	}else{
		if($passwordStr != $password2Str){
			$errorBln = true;
			$errorMsgStr = "Passwords are not the same";
		}
		if(strlen($passwordStr) < $minPasswordLenNum){
			// password too short
			$errorBln = true;
			$errorMsgStr = "Password length is too short";
		}
		if(strlen($passwordStr) > $maxPasswordLenNum){
			// password too long
			$errorBln = true;
			$errorMsgStr = "Password length is too long";
		}
		
		$passwordApprovedBln = true;
	}
	
	// only fire if password was approved
	if($passwordApprovedBln == true){		
		$decrypted = encrypt_decrypt('decrypt', $keyStr);
		// if the email is found
		try {
			$emailStr = explode(" ", $decrypted)[0];
			$instructionStr = explode(" ", $decrypted)[1];
			$passwordResetKeyStr = explode(" ", $decrypted)[2];
			$timeStr = explode(" ", $decrypted)[3];
	
			
			if($instructionStr == "reset"){
	
				$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
				if (mysqli_connect_errno()){
					echo "Failed to connect to MySQL: " . mysqli_connect_error();
				}
					
				// checks database if the code was valid
				$sqlQueryStr = "SELECT emailStr, saltStr, passwordRecoveryStr FROM users WHERE emailStr='$emailStr'";
				$result = mysqli_query($sql_db, $sqlQueryStr);
				$dbUserObj = mysqli_fetch_assoc($result);
					
				// if the database key is the same as the password reset key provided by user, reset
				if($dbUserObj['passwordRecoveryStr'] == $passwordResetKeyStr){
					
					
					$saltStr = $dbUserObj['saltStr'] ;
					$passwordMd5 = md5($saltStr.$passwordStr);
					
					$sqlQueryStr = "UPDATE users SET passwordStr='$passwordMd5', passwordRecoveryStr='' WHERE emailStr='$emailStr'";
					$result2 = mysqli_query($sql_db, $sqlQueryStr);
					// reset
					$output -> messageStr = "Your password has been reset.";
				//	$output -> passwordMd5 = $passwordMd5;
					$output -> editBln = true;
					
				}else{
					$errorBln = true;
					$errorMsgStr = "Reset password verification key is invalid";
				}
					
				//	$output -> dbUserObj = $dbUserObj;
	
			}else{
				$errorBln = true;
				$errorMsgStr = "Reset password verification key is invalid";
			}
			// if the email is not found
		} catch (Exception $e) {
			$emailStr = "";
			$instructionStr = "";
			$errorBln = true;
			$errorMsgStr = "Reset password verification key is invalid";
		}
	//	$output -> decrypted = $decrypted;
		
	}
		

	if($errorBln == true){
		$output -> successBln = false;
		$output -> messageStr = $errorMsgStr;
		header('HTTP/1.1 401 Unauthorized', true, 401);
		renderJSON( '401',
		array( 	'type'=>'POST only',
		'description'=>'Resets the users password',
		'called'=>'/reset-password' ),
		$output);
		exit;
	}

	$output -> successBln = true;
	renderJSON( '200',
	array( 	'type'=>'POST only',
	'description'=>'Resets the users password',
	'called'=>'/reset-password' ),
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
$app->post('/getUsers',  function () use ( $app ) {
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
				$userIdNum;
				
				global $db_host;
				global $db_username;
				global $db_password;
				global $db_database;
				global $lockdownBln;		
				
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
				if($errorBln || $lockdownBln){
					$output -> errorMessagesArr = $errorMessageArr;
					
					$output -> messageStr = "Registration Unsuccessful";
					if($lockdownBln){
						$output -> messageStr = "Registration Unsuccessful, website is currently locked from new user registrations";
					}
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
				//	$output -> messageStr = "Log in unsuccessful, email not found";
					$output -> messageStr = "Log in unsuccessful";
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
				
				$userIdNum = $dbUserObj['userIdNum'];
				if(sendActivationEmailById($userIdNum)){
					$output -> confirmationemail = "success";
				}else{
					$output -> confirmationemail = "failed";
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
	
	$errorBln = false;
	$errorMsgStr = "";
	
	$params = json_decode($app->request()->getBody());
	$keyStr = $params -> activationIdNum;
	
	$decrypted = encrypt_decrypt('decrypt', $keyStr);
	$activationObj;
	
	// if the user id and salt are found
	try {
		$userIdNum = explode(" ", $decrypted)[0];
		$saltStr = explode(" ", $decrypted)[1];
		
		$activationObj = activateAccount($userIdNum, $saltStr);
		
		// $output -> activationObj = $activationObj;
		
		// was activation successful?
		if($activationObj -> successBln){
			// user activation successful
		}else{
			$errorBln = true;
			$errorMsgStr = $activationObj -> messageStr;
		}

		// if there's no user id and salt found
	} catch (Exception $e) {
		$userIdNum = "";
		$saltStr = "";
		$errorBln = true;
	//	$errorMsgStr = "Error matching activation key to user id, activation unsuccessful";
	}

	if($errorBln == true){
		$output -> successBln = false;
		$output -> messageStr = $errorMsgStr;
		header('HTTP/1.1 401 Unauthorized', true, 401);
		renderJSON( '401',
		array( 	'type'=>'POST only',
		'description'=>'Activates a users account',
		'called'=>'/activate-account' ),
		$output);
		exit;
	}
	
	$output -> messageStr = "Activation successful";
	$output -> successBln = true;
	
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
				
				// we force an update to the users's session
				$userIdNum = $_SESSION['userIdNum'];
				
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
				if($dbUserObj['adminBln'] == true || $dbUserObj['adminBln'] == 1){
					$_SESSION['adminBln'] = $dbUserObj['adminBln'];
				}
				
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

				$sqlQueryStr = "SELECT 
				userIdNum,
				emailStr,
				usernameStr,
				firstnameStr,
				lastnameStr,
				publisherBln,
				advertiserBln,
				activatedBln,
				prevloginDate,
				lastloginDate,
				adminBln,
				passwordStr,
				saltStr
				
				FROM users WHERE emailStr='$emailStr'";
				
				$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
				if (mysqli_connect_errno()){
					echo "Failed to connect to MySQL: " . mysqli_connect_error();
				}

				$result = mysqli_query($sql_db, $sqlQueryStr);
				// check if user data has returned
				$rowsNum = mysqli_num_rows($result);

				// no user found
				if($rowsNum == 0 || $rowsNum == null){
				//	$output -> messageStr = "Log in unsuccessful, email not found";
					$output -> messageStr = "Log in unsuccessful";
						
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
		if($dbUserObj['adminBln'] == true || $dbUserObj['adminBln'] == 1){
			$_SESSION['adminBln'] = $dbUserObj['adminBln'];
		}
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
 * activates an account based on user id and it's salt
*/
function activateAccount($userIdNum, $saltStr){

	$output = new stdClass();
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;

	if(isset($userIdNum) && isset($saltStr)){

		// checks for unique email
		$sqlQueryStr = "SELECT userIdNum, saltStr, activatedBln FROM users WHERE userIdNum='$userIdNum'";
		$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
		if (mysqli_connect_errno()){
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}

		$result = mysqli_query($sql_db, $sqlQueryStr);
		// check if user data has returned
		$rowsNum = mysqli_num_rows($result);

		if($rowsNum != 0){
			$dbUserObj = mysqli_fetch_assoc($result);
				
			// checks if user id and salts line up
			if($dbUserObj['saltStr'] == $saltStr && $dbUserObj['userIdNum'] == $userIdNum){

				// checks if user is already activated
				if($dbUserObj['activatedBln'] == "0"){
					$output -> activatedBln = $dbUserObj['activatedBln'] ;
						
					$sqlQueryStr = "UPDATE users SET activatedBln='1' WHERE userIdNum='$userIdNum'";
					$result2 = mysqli_query($sql_db, $sqlQueryStr);
						
					$output -> successBln = true;
					$output -> messageStr = "User Activated";
						
				}else{
					$output -> successBln = false;
					$output -> messageStr = "User already activated";
				}
			}else{
				$output -> successBln = false;
				//	$output -> messageStr = "User id found but keys dont match";
			}
		}else{
			$output -> successBln = false;
			//	$output -> messageStr = "User id not found";
		}
		$sql_db -> close();
		$result -> close();

	}else{
		$output -> successBln = false;
		//	$output -> messageStr = "Keys not set for user activation";
	}

	return $output;
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
	
	$sqlQueryStr = "SELECT 
	
	userIdNum,
	emailStr,
	usernameStr,
	firstnameStr,
	lastnameStr,
	publisherBln,	
	advertiserBln,	
	activatedBln,
	prevloginDate,
	lastloginDate,
	adminBln

	FROM users WHERE userIdNum='$userIdNum'";
	
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
 * 
 *	Sends mail 
 * 
 */

function sendMail($toStr, $subjectStr, $messageStr){
	global $debugBln;
	$to      = $toStr;
	if($debugBln){
		$toStr = 'kendrick.lin@hotmail.com';
	}
	$headers = 'From: no-reply@kendricklin.com \r\n' .
			'Reply-To: no-reply@kendricklin.com \r\n' .
			'Content-type: text/html \r\n';
	$sendMailSuccessBln = mail($to, $subjectStr, $messageStr, $headers);
	
	return $sendMailSuccessBln;
};

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
	

	$subject = 'Please activate your account at www.fivesixseveneight.com';
	
	$messageStr = $nameStr." please activate your account by clicking on the link below";

	$messageStr .= "http://www.stage.fivesixseveneight.co/#/activateaccount/".$encrypted;

	$sendMailSuccessBln = sendMail($emailStr, $subject, $messageStr);
	return $sendMailSuccessBln;
	
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
*	getUserAccountsById
*	gets user social media accounts by id
*/

function getUserAccountsById($userIdNum){
	$output = new stdClass();
	$dbUserObj = [];
	$userObj = [];
	$newUserObj;
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	
	$sqlQueryStr = "SELECT 
	userIdNum,
	useraccountIdNum,
	profilePicStr,
	bioStr,
	supportStr,
	audienceStr,
	websiteStr,
	companyIdNum,
	facebookBln, 
	googleplusBln,
	instagramBln,
	pinterestBln,
	twitterBln,
	vineBln,
	youtubeBln
	
	FROM useraccountinfo WHERE userIdNum='$userIdNum'";
	
	$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
	if (mysqli_connect_errno()){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	$result = mysqli_query($sql_db, $sqlQueryStr);
	// check if user data has returned
	$rowsNum = mysqli_num_rows($result);

	// no user found
	if($rowsNum == 0 || $rowsNum == null){
		//create a new user if it doesn't exist
		$newUserObj = createUserAccountsById($userIdNum);
		
		if($newUserObj -> successBln){
			$output -> successBln = true;
			$dbUserObj = $newUserObj -> userObj;
		}else{
			$output -> successBln = false;
			$sql_db -> close();
			$result -> close();
		}
	}else{
		$output -> successBln = true;
		$dbUserObj = mysqli_fetch_assoc($result);
	}
	

	$userObj["userIdNum"] = $dbUserObj["userIdNum"];
	$userObj["useraccountIdNum"] = $dbUserObj["useraccountIdNum"];
	$userObj["profilePicStr"] = $dbUserObj["profilePicStr"];
	$userObj["bioStr"] = $dbUserObj["bioStr"];
	$userObj["supportStr"] = $dbUserObj["supportStr"];
	$userObj["audienceStr"] = $dbUserObj["audienceStr"];
	$userObj["websiteStr"] = $dbUserObj["websiteStr"];
	
	
	if(isset($dbUserObj["companyIdNum"]) && $dbUserObj["companyIdNum"] != "0"){
		//	$userObj["facebookBln"] = $dbUserObj["facebookBln"];
		$companyIdNum = $dbUserObj["companyIdNum"];
		$companyObj;
		$sqlQueryStr = "SELECT * FROM companies WHERE companyIdNum='$companyIdNum'";
		$result = mysqli_query($sql_db, $sqlQueryStr);
		$companyObj = mysqli_fetch_assoc($result);
		$userObj["companyObj"] = $companyObj;
	}
	
	if(isset($dbUserObj["facebookBln"]) && $dbUserObj["facebookBln"] == "1"){
	//	$userObj["facebookBln"] = $dbUserObj["facebookBln"];
		
		$sqlQueryStr = "SELECT * FROM facebookaccounts WHERE userIdNum='$userIdNum'";
		$result = mysqli_query($sql_db, $sqlQueryStr);
		$userObj["facebookObj"] = mysqli_fetch_assoc($result);
	}
	
	if(isset($dbUserObj["googleplusBln"]) && $dbUserObj["googleplusBln"] == "1"){
	//	$userObj["googleplusBln"] = $dbUserObj["googleplusBln"];
		
		$sqlQueryStr = "SELECT * FROM googleplusaccounts WHERE userIdNum='$userIdNum'";
		$result = mysqli_query($sql_db, $sqlQueryStr);
		$userObj["googleplusObj"] = mysqli_fetch_assoc($result);
		
	}
	
	if(isset($dbUserObj["instagramBln"]) && $dbUserObj["instagramBln"] == "1"){
	//	$userObj["instagramBln"] = $dbUserObj["instagramBln"];
		
		$sqlQueryStr = "SELECT * FROM instagramaccounts WHERE userIdNum='$userIdNum'";
		$result = mysqli_query($sql_db, $sqlQueryStr);
		$userObj["instagramObj"] = mysqli_fetch_assoc($result);
		
	}
	
	if(isset($dbUserObj["pinterestBln"]) && $dbUserObj["pinterestBln"] == "1"){
	//	$userObj["pinterestBln"] = $dbUserObj["pinterestBln"];
		
		$sqlQueryStr = "SELECT * FROM pinterestaccounts WHERE userIdNum='$userIdNum'";
		$result = mysqli_query($sql_db, $sqlQueryStr);
		
		$userObj["pinterestObj"] = mysqli_fetch_assoc($result);
	}
	
	if(isset($dbUserObj["twitterBln"]) && $dbUserObj["twitterBln"] == "1"){
	//	$userObj["twitterBln"] = $dbUserObj["twitterBln"];
		
		$sqlQueryStr = "SELECT * FROM twitteraccounts WHERE userIdNum='$userIdNum'";
		$result = mysqli_query($sql_db, $sqlQueryStr);
		
		$userObj["twitterObj"] = mysqli_fetch_assoc($result);
	}
	
	if(isset($dbUserObj["vineBln"]) && $dbUserObj["vineBln"] == "1"){
	//	$userObj["vineBln"] = $dbUserObj["vineBln"];
		
		$sqlQueryStr = "SELECT * FROM vineaccounts WHERE userIdNum='$userIdNum'";
		$result = mysqli_query($sql_db, $sqlQueryStr);
		
		$userObj["vineObj"] = mysqli_fetch_assoc($result);
	}
	
	if(isset($dbUserObj["youtubeBln"]) && $dbUserObj["youtubeBln"] == "1"){
	//	$userObj["youtubeBln"] = $dbUserObj["youtubeBln"];
		
		$sqlQueryStr = "SELECT * FROM youtubeaccounts WHERE userIdNum='$userIdNum'";
		$result = mysqli_query($sql_db, $sqlQueryStr);
		$userObj["youtubeObj"] = mysqli_fetch_assoc($result);
	}
		
	
	$output -> userObj = $userObj;
	$sql_db -> close();
	$result -> close();

	return $output;
}

/*
 *	createUserAccountsById
*	creates user social media accounts and profile data by id
*/

function createUserAccountsById($userIdNum){
	$output = new stdClass();
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	
	$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
	if (mysqli_connect_errno()){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	$sqlQueryStr = "SELECT * FROM useraccountinfo WHERE userIdNum='$userIdNum'";
	$result = mysqli_query($sql_db, $sqlQueryStr);
	$rowsNum = mysqli_num_rows($result);
	
	// no user found
	if($rowsNum == 0 || $rowsNum == null){
		//create user because they don't exist
		$result -> close();
		
		$sqlQueryStr = "INSERT INTO
		useraccountinfo(
		useraccountIdNum,
		userIdNum
		)
		
		VALUES (
		'',
		'$userIdNum'
		)";
		
		$result = mysqli_query($sql_db, $sqlQueryStr);

		//successfully added new user
		if($result){
			// query the user account info after adding them
			$sqlQueryStr = "SELECT * FROM useraccountinfo WHERE userIdNum='$userIdNum'";
			$result = mysqli_query($sql_db, $sqlQueryStr);
			$output -> successBln = true;
		}else{
			$output -> successBln = false;
		}
	}
	
	$dbUserObj = mysqli_fetch_assoc($result);
	
	$output -> userObj = $dbUserObj;
	$result -> close();
	$sql_db -> close();
	
	return $output;
}

/*
 * Gets facebook id by user id
 */
function getFacebookIdById($userIdNum){
	$output = new stdClass();
	global $db_host;
	global $db_username;
	global $db_password;
	global $db_database;
	
	$sqlQueryStr = "SELECT facebookIdNum FROM facebookaccounts WHERE userIdNum='$userIdNum'";
	$sql_db = mysqli_connect($db_host, $db_username, $db_password, $db_database);
	if (mysqli_connect_errno()){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	$result = mysqli_query($sql_db, $sqlQueryStr);
	
	if($result){
		$dbUserObj = mysqli_fetch_assoc($result);
		$output -> dataObj = $dbUserObj;
		$output -> successBln = true;
	}else{
		$output -> dataObj = "";
		$output -> successBln = false;
		$output -> messageStr = "Facebook Id not found";
	}
		
	$sql_db -> close();
	$result -> close();
	return $output;
};


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
 * checks if the user is an admin  
 */
function checkUserIsAdmin($userIdNum){
	if( isset($_SESSION['adminBln']) && $userIdNum == $_SESSION['adminBln']){
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