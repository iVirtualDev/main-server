@extends('layout')

@section('main')
	<div class="row">
		<div class="large-12 columns">
			<div class="panel">
				<header>
					<h3><i class="icon-eye-open"></i>&nbsp;Your Second Phone Privacy Policy</h3>
				</header>
				<div class="panel_body">
					<h3>Our Approach</h3>
					<p>In light of recent privacy encroachments made by various governments around the world, Your Second Phone is taking the "DuckDuckGo" approach to privacy which is; we simply just don't collect any unique data on our users, so there is no data to be requested by prying entites.</p>

					<h3>What is Collected?</h3>

					<p><b>Log Data: </b>Our server automatically records information about your visit to our servers. Log Data typically includes your IP address, Browser info, the time of your visit, and the pages you accessed. These logs are usually deleted after about 7 days.</p>

					<p><b>Session Data: </b>When you start a YSP session, a unique identifier is attached to it and stored in your session, so that if you leave Your Second Phone, you can pick up the same session that you started. No other information is stored in this session data. This session if left idle for 12 hours will automatically expire.</p>

					<p><b>Analytics: </b>When on Your Second Phone, we anonymously collect data about your browser, your rough geolocation (scope is limited to a city), where you were reffered from, and any errors that might have occured during your visit. This information is collected with the help of Google Analytics, and is completely anonymous. There is absolutely no way to link you (the user) and this information that is collected.</p>

					<h3>What <i>isn't</i> Collected?</h3>

					<p><b>Chat: </b> Messages that you send in your sessions is never logged, in order to assure this we implement our own chat server based on <i>Node.js</i> and <i>Socket.io</i>. The code that runs the server is freely available for you to scrutinize (<a href="http://git.io/SUmZug" target="_blank">Chat Server Code</a>).</p>

				</div>
			</div>
		</div>
	</div>
@stop