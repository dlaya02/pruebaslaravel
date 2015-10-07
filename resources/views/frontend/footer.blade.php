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
