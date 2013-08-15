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

Route::get('/{sid?}', function($sid = null)
{
	$browser = new Browser();
	$type = $browser->getBrowser();
	$version = $browser->getVersion();

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

	echo $compatible;

	$params = array();
	if($sid != null || Session::has('sid')){
		$params['skipintro'] = true;
	}else{
		$params['skipintro'] = false;
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
	return View::make('about');
});
Route::get('privacy', function(){
	return View::make('privacy');
});

Route::get('browser', function(){
	$browser = new Browser();

	var_dump($browser);
});

/**
 *
 *	TELEPHONY ROUTES - These routes handle telephony related stuff
 * 
 */

Route::get('/telephony/create_session', function(){
	if(Session::has('sid')){
		$sid = Session::get('sid');
		if(Cache::has($sid)){
			return Response::json(jsend("success", array("sid" => $sid, "session_id" => Cache::get($sid))));
		}else{
			Session::flush();
		}
	}

	$opentok = new OpenTokSDK( API_Config::API_KEY, API_Config::API_SECRET );
	$session = $opentok->createSession( $_SERVER["REMOTE_ADDR"], array(SessionPropertyConstants::P2P_PREFERENCE=> "enabled") );
	$session_id = $session->getSessionId();

	$sid = str_random(8);

	while (Cache::has($sid)) {
		$sid = str_random(8);
	}

	Cache::add($sid, $session_id, 60);
	Session::put('sid', $sid);

	return Response::json(jsend("success", array("sid" => $sid, "session_id" => $session_id)));
});

Route::get('/telephony/get_session/{sid}', function($sid){
	if(Cache::has($sid)){
		$session_id = Cache::get($sid);
		return Response::json(jsend("success", array("session_id" => $session_id)));
	}else{
		Session::flush();
		return Response::json(jsend("fail", array("code" => 1404)));
	}
});

Route::get('/telephony/get_token/{sid}', function($sid){
	$sesh_key = "token_{$sid}";

	if(Cache::has($sid)){
		if(Session::has($sesh_key)){
			return Response::json(jsend("success", array("token" => Session::get($sesh_key))));
		}else{
			$opentok = new OpenTokSDK( API_Config::API_KEY, API_Config::API_SECRET );
			$token  = $opentok->generate_token(Cache::get($sid));

			Session::put($sesh_key, $token);

			return Response::json(jsend("success", array("token" => $token)));
		}
	}else{
		Session::flush();
		return Response::json( jsend("fail", array("code" => 2404)) );
	}
});

Route::get('/telephony/flush_session', function(){
	Session::flush();

	return Response::json(jsend("success", array()));
});
