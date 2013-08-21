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

Route::get('/static/js/lang.js', function(){
	$view = View::make('js_lang');
	$res = Response::make($view, 200);
	$res->header('Content-type', 'application/javascript');

	return $res;
});

Route::resource('session', 'SessionController', array('only' => array('create', 'show')));