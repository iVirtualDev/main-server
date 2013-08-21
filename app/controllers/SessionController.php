<?php

class SessionController extends BaseController {

	private $opentok;

    public function __construct(){
    	$this->opentok = new OpenTokSDK( API_Config::API_KEY, API_Config::API_SECRET );
    }

    private function generate_sid($length){
    	$consonants = "bcdfghjklmnpqrstvwxyz";
    	$vowels = "aeiou";

    	$out = "";

    	for ($i=0; $i < $length; $i++) { 
    		switch($i%2) {
    			case 0:
    				$out += $consonants[mt_rand(0, 20)];
    				break;
    			default:
    				$out += $vowels[mt_rand(0, 4)];
    				break;
    		}
    	}

    	return $out;
    }

    private function jsend($status, $data = array(), $message = "Unknown Error", $code = 301){
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

    public function create(){
    	return $this->generate_sid(10);

    	//If User's Session is already attached to an existing YSP Session, look for it in the Cache
    	if(Session::has('sid')){
    		$sid = Session::get('sid');

    		//If the YSP Session is still around, load it up and return its data back to the user
    		if(Cache::has($sid)){

    			$token = "";

    			if(Session::has("token_{$sid}")){
    				$token = Session::get("token_{$sid}");
    			}else{
    				$token = $this->opentok->generate_token(Cache::get($sid));
    				Session::put("token_{$sid}", $token);
    			}

    			return Response::json($this->jsend("success", array("sid" => $sid, "session_id" => Cache::get($sid), "token" => $token)));
    		}else{

    			//If the YSP Session is not still around, flush the User's Session data and continue with creating a new YSP Session
    			Session::flush();
    		}
    	}
    	//Create a new session, pass the users IP address in so OpenTok can have a clue where to establish the
    	//session in its global network, and then enable P2P
    	//
    	//NOTE: If you are reading this and are concerened about your IP address being passed to TokBox, go here to learn more about what TokBox is doing
    	//with your IP address (spoiler alert: They just use it to decide where to establish the session in their global CDN):
    	//	http://tokbox.com/opentok/docs/server/server_side_libraries.html#create_session
    	//
    	$session = $this->opentok->createSession( $_SERVER["REMOTE_ADDR"], array(SessionPropertyConstants::P2P_PREFERENCE=> "enabled") );

    	//Retrieve the session id
    	$session_id = $session->getSessionId();

    	//Generate a token from that session for the user
    	$token = $this->opentok->generate_token($session_id);

    	//Generate a random SID that will be used to identify sessions on YSP
    	$sid = $this->generate_sid(8);

    	//All sids need to be unique, the likelihood of to sids being the same is so very slim, but I don't know, I guess I'm just superstitious :/
    	//So while the Cache has the sid already generate a new one; repeat until unique!
    	while (Cache::has($sid)) {
    		$sid = str_random(8);
    	}

    	//Add the YSP session to the cache and set it to expire in 1 day
    	Cache::add($sid, $session_id, 1440);

    	//Add the sid to the User's cache so YSP doesn't needlessly generate YSP sessions
    	Session::put('sid', $sid);
    	Session::put("token_{$sid}", $token);

    	//Send the data back to the User in a JSend format
    	return Response::json($this->jsend("success", array("sid" => $sid, "session_id" => $session_id, "token" => $token)));

    }

    public function show($sid) {
    	return 'session.show';
    }
}