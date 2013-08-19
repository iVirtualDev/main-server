<!--

__  __                    _____                           __   ____  __                   
\ \/ /___  __  _______   / ___/___  _________  ____  ____/ /  / __ \/ /_  ____  ____  ___ 
 \  / __ \/ / / / ___/   \__ \/ _ \/ ___/ __ \/ __ \/ __  /  / /_/ / __ \/ __ \/ __ \/ _ \
 / / /_/ / /_/ / /      ___/ /  __/ /__/ /_/ / / / / /_/ /  / ____/ / / / /_/ / / / /  __/
/_/\____/\__,_/_/      /____/\___/\___/\____/_/ /_/\__,_/  /_/   /_/ /_/\____/_/ /_/\___/ 
                                                                                                                                                                                                                                                                           
Created, Designed, and Coded lovingly by Nick Comer (@nkcmr)

Hosted at (mt) MediaTemple in Los Angeles, California, USA

    	
-->
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Your Second Phone</title>
        <meta name="description" content="Your Second Phone is a turnkey video chat application. Create a video chat session for free and with no account!">
        <meta name="keywords" content="video chat call chat message messaging talk conversation facetime skype google hangouts facebook private secure free no account encrypted open-source open source telephone phone dial cellphone iphone">
        <meta name="viewport" content="width=device-width">

        @if($no_crawl_index)
        <meta name="robots" content="NOINDEX, FOLLOW">
        @endif

        <meta property="og:site_name" content="Your Second Phone">
        <meta property="og:description" content="Your Second Phone is a turnkey video chat application. Create a video chat session for free and with no account!">
        <meta property="og:type" content="website">
        <meta property="og:image:url" content="http://yoursecondphone.co/static/img/ogp.png">
        <meta property="og:image:secure_url" content="https://yoursecondphone.co/static/img/ogp.png">

        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/normalize/2.1.0/normalize.min.css">
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/foundation/4.1.6/css/foundation.min.css">
        <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Aldrich">
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.1/css/font-awesome.min.css">
        <link rel="stylesheet" href="/static/css/animate.min.css">
        <link rel="stylesheet" href="/static/css/main.css">
		@yield('css')
    </head>
    <body id="{{ $page_id }}">
		<div class="row">
			<div class="large-9 large-centered columns">
				<header id="global_header">
					<a href="/"><h2>Your Second Phone</h2></a>
				</header>
			</div>
		</div>
		<div class="row">
            <div class="large-9 large-centered columns">
                <div id="page_content">
                    @yield('main')
                </div>
            </div>
		</div>
        <div class="row">
            <div class="large-9 large-centered columns">
                <footer id="global_footer">
                    <ul class="inline-list">
                        <li><a href="/about"><i class="icon-info-sign"></i>&nbsp;About</a></li>
                        <li><a href="/privacy"><i class="icon-eye-open"></i>&nbsp;Privacy Policy</a></li>
                        <li><a href="https://github.com/yoursecondphone"><i class="icon-github-alt"></i>&nbsp;GitHub</a></li>
                        <li><a href="/terms"><i class="icon-legal"></i>&nbsp;Terms of Service</a></li>
                    </ul>
                    <div id="copyright">
                        <small>&copy; 2013 yoursecondphone (Licensed Under Apache 2.0)</small>
                    </div>
                    <div id="twitter">
                        <a href="https://twitter.com/yoursecondphone" class="twitter-follow-button" data-show-count="true" data-show-screen-name="false" data-dnt="true">Follow @yoursecondphone</a>
                        <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
                    </div>
                </footer>
            </div>
        </div>

        <script src="//cdnjs.cloudflare.com/ajax/libs/sugar/1.3.9/sugar.min.js"></script>
        @yield('js')
        
        @if($show_ad)
            @if($is_mobile)
                <div id="ad" class="mobile">
                    <script async src="http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                    <!-- ysp_mobile -->
                    <ins class="adsbygoogle"
                         style="display:inline-block;width:320px;height:50px"
                         data-ad-client="ca-pub-6604919870949736"
                         data-ad-slot="2331462035"></ins>
                    <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    </script>
                </div>
            @else
                <div id="ad" align="center">
                    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                    <!-- video_chat_ysp -->
                    <ins class="adsbygoogle"
                         style="display:inline-block;width:970px;height:90px"
                         data-ad-client="ca-pub-6604919870949736"
                         data-ad-slot="4713178837"></ins>
                    <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    </script>
                </div>
            @endif
        @endif
        <script>
            var _gaq=[['_setAccount','UA-42099921-1'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src='//www.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>
    </body>
</html>
