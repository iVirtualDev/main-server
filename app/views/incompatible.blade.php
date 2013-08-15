@extends('layout')

@section('main')
<div class="large-7 large-centered columns">
	<div id="app_hold">
		<div id="main_hold" class="row">
			<div class="large-12 columns">
				<div class="row">
					<div class="large-6 columns">
						<div class="panel animated" id="videochat">
							<header>
								<h4><i class="icon-facetime-video"></i>&nbsp;Video Chat</h4>
							</header>
							<div class="panel_body">
								<p>Your Second Phone allows you to chat face-to-face with anyone. Simply create a session, send your friend the link and chat for as long as you need, it's <b>free!</b></p>
							</div>
						</div>
					</div>
					<div class="large-6 columns">
						<div class="panel animated" id="noaccount">
							<header>
								<h4><i class="icon-magic"></i>&nbsp;No Account</h4>
							</header>
							<div class="panel_body">
								<p>
									You don't need to have an account to use Your Second Phone. Once a session is created, the link to it will last an hour, but the call can last much longer.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="large-12 large-centered columns">
				<div class="row">
					<div class="large-12 large-centered columns">
						<div id="incompatible_browser" class="panel error">
							<header>
								<h4>Please upgrade your browser</h4>
							</header>
							<div class="panel_body">
								<p>Your browser is not equipped with the necessary tools to handle Your Second Phone. Please upgrade to, or install the latest version of <a href="https://www.google.com/chrome">Chrome</a> or <a href="http://www.firefox.com/">Firefox</a>.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
@stop