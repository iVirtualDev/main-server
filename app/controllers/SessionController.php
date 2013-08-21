<?php

class SessionController extends BaseController {

	private $opentok;

    public function __construct(){
    	$this->opentok = new 
    }

    public function create(){
    	return 'session.create';
    }

    public function show($sid) {
    	return 'session.show';
    }
}