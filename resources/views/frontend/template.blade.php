<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <base href="http://pruebaslaravel/"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Mosaddek">
    <meta name="keyword" content="FlatLab, Dashboard, Bootstrap, Admin, Template, Theme, Responsive, Fluid, Retina">
    <link rel="shortcut icon" href="frontend/img/favicon.png">

    <title>FlatLab Frontend | Home</title>

    <!-- Bootstrap core CSS -->
    <link href="frontend/css/bootstrap.css" rel="stylesheet">
   <!-- <link href="frontend/css/theme.css" rel="stylesheet">
    <link href="frontend/css/bootstrap-reset.css" rel="stylesheet">-->
    <!--external css-->
    <link href="frontend/assets/font-awesome/css/font-awesome.css" rel="stylesheet" />
    <link rel="stylesheet" href="frontend/css/flexslider.css"/>
    <link href="frontend/assets/bxslider/jquery.bxslider.css" rel="stylesheet" />
    <link href="frontend/assets/fancybox/source/jquery.fancybox.css" rel="stylesheet" />

    <link rel="stylesheet" href="frontend/assets/revolution_slider/css/rs-style.css" media="screen">
    <link rel="stylesheet" href="frontend/assets/revolution_slider/rs-plugin/css/settings.css" media="screen">

    <!-- Custom styles for this template -->
    <link href="frontend/css/style.css" rel="stylesheet">
    <link href="frontend/css/style-responsive.css" rel="stylesheet" />

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 tooltipss and media queries -->
    <!--[if lt IE 9]>
      <script src="frontend/js/html5shiv.js"></script>
      <script src="forntend/js/respond.min.js"></script>
    <![endif]-->
 <link href="frontend/css/my-custom-frontend.css" rel="stylesheet" />

</head>


  

    
<body>
    <!--header start-->
    <header class="header-frontend">
    
        <div class="navbar navbar-default navbar-static-top">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="fa fa-bars"></span>
                    </button>
                    <a class="navbar-brand" href="index.html">Flat<span>Lab</span></a>
                </div>
                <div class="navbar-collapse collapse ">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="index.html"> wizards make toxic </a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="services.html">Service</a></li>
                        <li class="dropdown ">
                            <a href="#" class="dropdown-toggle " data-toggle="dropdown" data-hover="dropdown" data-delay="0" data-close-others="false">Feature <b class=" fa fa-angle-down"></b></a>
                            <ul class="dropdown-menu">
                                <li><a href="typography.html">Typography</a></li>
                                <li><a href="button.html">Buttons</a></li>
                            </ul>
                        </li>
                        <li><a href="portfolio.html">Portfolio</a></li>
                        <li><a href="price.html">Price</a></li>
                        <li><a href="blog.html">Blog</a></li>
                        <li><a href="contact.html">Contact</a></li>
                        <li class="dropdown language">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                <img alt="" src="frontend/img/flags/us.png">
                                <span class="username">US</span>
                                <b class=" fa fa-angle-down"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a href="#"><img alt="" src="img/flags/es.png"> Spanish</a></li>
                                <li><a href="#"><img alt="" src="img/flags/de.png"> German</a></li>
                                <li><a href="#"><img alt="" src="img/flags/ru.png"> Russian</a></li>
                                <li><a href="#"><img alt="" src="img/flags/fr.png"> French</a></li>
                            </ul>
                        </li>
                        <li><input type="text" placeholder=" Search" class="form-control search"></li>
                    </ul>
                </div>
            </div>
        </div>
    </header>

 		@yield('index')

    <!-- js placed at the end of the document so the pages load faster -->
    <script src="frontend/js/jquery.js"></script>
    <script src="frontend/js/jquery-migrate-1.2.1.min.js"></script>
    <script src="frontend/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="frontend/js/hover-dropdown.js"></script>
    <script defer src="frontend/js/jquery.flexslider.js"></script>
    <script type="text/javascript" src="frontend/assets/bxslider/jquery.bxslider.js"></script>

    <script type="text/javascript" src="frontend/js/jquery.parallax-1.1.3.js"></script>

    <script src="frontend/js/jquery.easing.min.js"></script>
    <script src="frontend/js/link-hover.js"></script>

    <script src="frontend/assets/fancybox/source/jquery.fancybox.pack.js"></script>

    <script type="text/javascript" src="frontend/assets/revolution_slider/rs-plugin/js/jquery.themepunch.plugins.min.js"></script>
    <script type="text/javascript" src="frontend/assets/revolution_slider/rs-plugin/js/jquery.themepunch.revolution.min.js"></script>

    <!--common script for all pages-->
    <script src="frontend/js/common-scripts.js"></script>

    <script src="frontend/js/revulation-slide.js"></script>


  <script>

      RevSlide.initRevolutionSlider();

      $(window).load(function() {
          $('[data-zlname = reverse-effect]').mateHover({
              position: 'y-reverse',
              overlayStyle: 'rolling',
              overlayBg: '#fff',
              overlayOpacity: 0.7,
              overlayEasing: 'easeOutCirc',
              rollingPosition: 'top',
              popupEasing: 'easeOutBack',
              popup2Easing: 'easeOutBack'
          });
      });

      $(window).load(function() {
          $('.flexslider').flexslider({
              animation: "slide",
              start: function(slider) {
                  $('body').removeClass('loading');
              }
          });
      });

      //    fancybox
      jQuery(".fancybox").fancybox();



  </script>

  </body>
</html>
