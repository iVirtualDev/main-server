@extends('layout')

@section('main')
	<div class="large-7 large-centered columns">
		<div id="app_hold">
			<div id="main_hold" class="row">
				@if( ! $skipintro)
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
				<div class="large-12 columns">
					<div class="row">
						<div class="large-12 large-centered columns">
							<button class="button large expand" id="bootstrap">Let's Go!</button>
						</div>
					</div>
				</div>
				@endif
			</div>
		</div>
	</div>
@stop

@section('js')
<script src="/static/js/plugin/webrtc_adapter.js"></script>
<script src="/static/js/lib/loglevel.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.8/require.min.js" data-main="/static/js/src/root.js"></script>
@stop