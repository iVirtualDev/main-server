@extends('layout')

@section('main')
	<div class="row">
		@if($skipintro && $compatible)
			<div class="large-12 columns" id="main_content">
				
			</div>
		@else
			@include('intro', array('compatible' => $compatible))
		@endif
	</div>
@stop

@section('js')
	@if($compatible)
		<script src="/static/js/plugin/webrtc_adapter.js"></script>
		<script src="/static/js/lib/loglevel.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.8/require.min.js" data-main="/static/js/src/root.js"></script>
	@endif
@stop