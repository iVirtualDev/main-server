<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

use Ikimea\Browser\Browser;

$browser = new Browser();

/**
 * JSend formatter - Used to create a JSend compliant array that is ready to be encoded in JSON and sent to an expecting AJAX call in JavaScript
 * Read more: http://labs.omniti.com/labs/jsend
 * 
 * @param  string  $status  Success - Everything went just fine, just returning requested/relevant data
 *                          Fail 	- Bad input was found, the user probably caused this error by not entering something right
 *                          Error 	- An error occured in the server, this was not the fault of the user, say your sorry server!
 * @param  array   $data    Any relevant/requested data that should be sent back with the response
 * @param  string  $message If status is "error" this will be the error message sent back
 * @param  integer $code    If status is "error" this will be the error code sent back
 * @return array           	A JSend compliant array, ready to be converted into JSON
 */
function jsend($status, $data = array(), $message = "Unknown Error", $code = 301){
	$out = array();
	if(in_array($status, array("fail", "error", "success"))){
		$out["status"] = $status;
		if($status == "error"){
			$out["code"] = $code;
			$out["message"] = $message;
		}else{
			$out["data"] = $data;
		}

		return $out;
	}else{
		throw new Exception("Invalid JSend Status", 105);
	}
}

$defaultParams = array(
	"no_crawl_index" => false,
	"show_ad" => false,
	"is_mobile" => $browser->isMobile()
);

Route::get('/{sid?}', function($sid = null)
{
	global $browser, $defaultParams;
	$type = $browser->getBrowser();
	$version = $browser->getVersion();


	$params = $defaultParams;

	$compatible = false;

	//Compatible browser?
	if( ($type == Browser::BROWSER_FIREFOX || $type == Browser::BROWSER_CHROME) && ! $browser->isMobile() ) {
		$version_int = (int) substr($version, 0, 2);

		if($type == Browser::BROWSER_FIREFOX) {
			if($version_int >= 22){
				$compatible = true;
			}
		}else if($type == Browser::BROWSER_CHROME) {
			if($version_int >= 26){
				$compatible = true;
			}
		}
	}

	$params["compatible"] = $compatible;
	$params["page_id"] = "main";
	$params["skipintro"] = false;
	$params["show_ad"] = true;

	if($sid != null || Session::has('sid')){
		$params["skipintro"] = true;
	}

	if($sid != null) {
		$params["no_crawl_index"] = true;
	}

	return View::make('main', $params);

})->where('sid', '^[a-zA-Z0-9]{8}$');

Route::get('/static/js/lang.js', function(){
	$view = View::make('js_lang');
	$res = Response::make($view, 200);
	$res->header('Content-type', 'application/javascript');

	return $res;
});

Route::get('about', function(){
	global $defaultParams;

	$params = $defaultParams;
	$params["page_id"] = "about";

	return View::make('about', $params);
});
Route::get('privacy', function(){
	global $defaultParams;

	$params = $defaultParams;
	$params["page_id"] = "privacy";

	return View::make('privacy', $params);
});
Route::get('terms', function(){
	global $defaultParams;

	$params = $defaultParams;
	$params["page_id"] = "terms";

	return View::make('terms', $params);
});

/**
 *
 *	TELEPHONY ROUTES - These routes handle telephony related stuff
 * 
 */

Route::get('/telephony/create_session', function(){

	//If User's Session is already attached to an existing YSP Session, look for it in the Cache
	if(Session::has('sid')){
		$sid = Session::get('sid');

		//If the YSP Session is still around, load it up and return its data back to the user
		if(Cache::has($sid)){
			return Response::json(jsend("success", array("sid" => $sid, "session_id" => Cache::get($sid))));
		}else{

			//If the YSP Session is not still around, flush the User's Session data and continue with creating a new YSP Session
			Session::flush();
		}
	}

	//Establish a new OpenTok SDK Instance
	$opentok = new OpenTokSDK( API_Config::API_KEY, API_Config::API_SECRET );

	//Create a new session, pass the users IP address in so OpenTok can have a clue where to establish the
	//session in its global network, and then enable P2P
	//
	//NOTE: If you are reading this and are concerened about your IP address being passed to TokBox, go here to learn more about what TokBox is doing
	//with your IP address (spoiler alert: They just use it to decide where to establish the session in their global CDN):
	//	http://tokbox.com/opentok/docs/server/server_side_libraries.html#create_session
	//
	$session = $opentok->createSession( $_SERVER["REMOTE_ADDR"], array(SessionPropertyConstants::P2P_PREFERENCE=> "enabled") );

	//Retrieve the session id
	$session_id = $session->getSessionId();

	//Generate a random SID that will be used to identify sessions on YSP
	$sid = str_random(8);

	//All sids need to be unique, the likelihood of to sids being the same is so very slim, but I don't know, I guess I'm just superstitious :/
	//So while the Cache has the sid already generate a new one; repeat until unique!
	while (Cache::has($sid)) {
		$sid = str_random(8);
	}

	//Add the YSP session to the cache and set it to expire in 1 day
	Cache::add($sid, $session_id, 1440);

	//Add the sid to the User's cache so YSP doesn't needlessly generate YSP sessions
	Session::put('sid', $sid);

	//Send the data back to the User in a JSend format
	return Response::json(jsend("success", array("sid" => $sid, "session_id" => $session_id)));
});

Route::get('/telephony/get_session/{sid}', function($sid){
	//If the Cache still remembers the sid, extract the info
	if(Cache::has($sid)){
		$session_id = Cache::get($sid);
		//Info extracted? Good! Send that back to the User!
		return Response::json(jsend("success", array("session_id" => $session_id)));
	}else{
		//Cache doesn't remember? Flush the User's session to prevent referencing errors n such, tell the user the bad news
		Session::flush();
		return Response::json(jsend("fail", array("code" => 1404)));
	}
});

Route::get('/telephony/get_token/{sid}', function($sid){
	//All tokens are store under the namespace "token_{$sid}"
	$sesh_key = "token_{$sid}";

	//Does the cache remember the sid?
	if(Cache::has($sid)){
		//Good! Does the User's session data already have an issued?
		if(Session::has($sesh_key)){
			//Spectacular! Just extract the data and send it on back to the user!
			return Response::json(jsend("success", array("token" => Session::get($sesh_key))));
		}else{
			//No problemo, let's generate a fresh one; start by initiating a OpenTok instance
			$opentok = new OpenTokSDK( API_Config::API_KEY, API_Config::API_SECRET );

			//Alright just plug in the Session ID and store the $token
			$token = $opentok->generate_token(Cache::get($sid));

			//Put token in the User's session data so we don't have to generate more later
			Session::put($sesh_key, $token);

			//Send everything back to the user
			return Response::json(jsend("success", array("token" => $token)));
		}
	}else{
		//Don't remember, huh? This is an extremely rare occurence, but we should prepare for it anyways.
		//Flush the User's session data to prevent any further hiccups
		Session::flush();

		//Tell the user the bad news
		return Response::json( jsend("fail", array("code" => 2404)) );
	}
});

Route::get('/telephony/flush_session', function(){
	//This is a nuclear option, if things get too confusing, just nuke the user's session data and move on

	Session::flush();

	return Response::json(jsend("success", array()));
});
