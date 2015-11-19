!function ($) {

  $(function(){

	// Scrollspy
    var $window = $(window)
    var $body   = $(document.body)

    $body.scrollspy({
      target: '.wiki-sidebar'
    })
    $window.on('load', function () {
//      $body.scrollspy('refresh')

      // IE10 workarounds for Bootstrap
      if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement('style')
        msViewportStyle.appendChild(
        document.createTextNode(
          '@-ms-viewport{width:auto!important}'
          )
        )
        document.querySelector('head').appendChild(msViewportStyle)
      }
    })

    // Sidenav affixing
    setTimeout(function () {
      var $sideBar = $('.wiki-sidebar')

      $sideBar.affix({
        offset: {
          top: function () {
            var offsetTop      = $sideBar.offset().top
            var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
            var navOuterHeight = $('.wiki-nav').height()

            return (this.top = offsetTop - navOuterHeight - sideBarMargin)
          },
          bottom: function () {
            return (this.bottom = $('.wiki-footer').outerHeight(true))
          }
        }
      })
    }, 100)

    //setTimeout(function () {
      //$('.bs-top').affix()
    //}, 100)

    // Disable certain links in docs
/*    $('section [href^=#]').click(function (e) {
      e.preventDefault()
    })
*/
  })

}(window.jQuery)
