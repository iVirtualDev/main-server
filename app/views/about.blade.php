@extends('layout')

@section('main')
	<div class="row">
		<div class="large-6 columns">
			<div class="panel" id="history">
				<header>
					<h3><i class="icon-road"></i>&nbsp;History</h3>
				</header>
				<div class="panel_body">
					<p>
						<b>Your Second Phone</b> started as a little experminent back in 2010. It originally existed as a means to call phones right from the browser, but has since evolved into a multi-tool of ad hoc communications.
					</p>
					<p>
						With the advent of WebRTC, <b>Your Second Phone</b> has become a turnkey video chat client, where anybody can simply load a session without having an account or handing over personal infomation. <b>Your Second Phone</b> has never and will never require an account to use.
					</p>
				</div>
			</div>
		</div>
		<div class="large-6 columns">
			<div class="panel" id="team">
				<header>
					<h3><i class="icon-male"></i>&nbsp;Meet the Team</h3>
				</header>
				<div class="panel_body">
					<p>
						<b>Your Second Phone</b> has been maintained and coded by me, <a href="http://nick.comer.io" target="_blank">Nick Comer</a>, for its entire existence. I like knowing that I can provide a very hassle-free means of letting people communicate with others.
					</p>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="large-12 columns">
			<div class="panel" id="advantage">
				<header>
					<h3><i class="icon-thumbs-up"></i>&nbsp;Advantages</h3>
				</header>
				<div class="panel_body">
					<p>Asking yourself why <b>Your Second Phone</b> is better than other video chat services? Let the table below tell you!</p>
					<table id="advantages_table">
						<thead>
							<tr>
								<th></th>
								<th>Requires Account</th>
								<th>Requires Installation</th>
								<th>Open Source</th>
								<th>Respects Privacy</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="service_label">Skype</td>
								<td>Yes</td>
								<td>Yes</td>
								<td>No</td>
								<td>No</td>
							</tr>
							<tr>
								<td class="service_label">Google+ Hangouts</td>
								<td>Yes</td>
								<td>Yes</td>
								<td>No</td>
								<td>Unknown</td>
							</tr>
							<tr>
								<td class="service_label">Facebook</td>
								<td>Yes</td>
								<td>Yes</td>
								<td>No</td>
								<td>No</td>
							</tr>
							<tr>
								<td class="service_label">Your Second Phone</td>
								<td>No</td>
								<td>No</td>
								<td>Yes</td>
								<td>Yes</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="large-12 columns">
			<div class="panel">
				<header>
					<h3><i class="icon-code-fork"></i>&nbsp;Contributing</h3>
				</header>
				<div class="panel_body">
					<p>
						<b>Your Second Phone</b> is open source. The code that runs everything is freely available to sift through. Contributions to the code and pull-requests are welcomed.
					</p>
					<p>
						If you find and issue but don't know much code, thats okay, just open an issue on GitHub and it will be addressed.
					</p>
				</div>
			</div>
		</div>
	</div>
@stop