(function($) {

var nav = responsiveNav("#primary-navigation", { // Selector
  animate: true, // Boolean: Use CSS3 transitions, true or false
  transition: 284, // Integer: Speed of the transition, in milliseconds
  label: "Menu", // String: Label for the navigation toggle
  insert: "before", // String: Insert the toggle before or after the navigation
  customToggle: "", // Selector: Specify the ID of a custom toggle
  closeOnNavClick: true, // Boolean: Close the navigation when one of the links are clicked
  openPos: "relative", // String: Position of the opened nav, relative or static
  navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
  navActiveClass: "js-nav-active", // String: Class that is added to  element when nav is active
  jsClass: "js", // String: 'JS enabled' class which is added to  element
  init: function(){}, // Function: Init callback
  open: function(){}, // Function: Open callback
  close: function(){} // Function: Close callback
});

var $marquee = $('.marquee');
$marquee.owlCarousel({

	items: 1,
	loop: ( $marquee.find(".item").length > 1 ) ? true : false,
	autoHeight: false,

	margin: 0,

	nav: false,
	navText: ["",""],
	slideBy: 1,
	dots: ( $marquee.find(".item").length > 1 ) ? true : false,
	dotEach: 3,
	dotData: false,

	video: true,
	videoWidth: false,
	videoHeight: false,

	autoplay: true,
	autoplayTimeout: 6000,
	autoplayHoverPause: false,
	smartSpeed: 400,
	autoplaySpeed: 1400,
	navSpeed: 400,
	dotsSpeed: 400,
	responsiveRefreshRate: 300,
	animateOut: "fadeOut",
	animateIn: false,
	
	mouseDrag: false,
	touchDrag: false

});

var $marquee = $('.media-marquee');
$marquee.owlCarousel({

	items: 1,
	loop: ( $marquee.find(".item").length > 1 ) ? true : false,
	autoHeight: false,

	margin: 0,

	nav: ( $marquee.find(".item").length > 1 ) ? true : false,
	navText: ["",""],
	slideBy: 1,
	dots: false,
	dotEach: 3,
	dotData: false,

	video: true,
	videoWidth: false,
	videoHeight: false,

	autoplay: true,
	autoplayTimeout: 6000,
	autoplayHoverPause: false,
	smartSpeed: 400,
	autoplaySpeed: 1400,
	navSpeed: 400,
	dotsSpeed: 400,
	responsiveRefreshRate: 300,
	animateOut: false,
	animateIn: false,
	
	mouseDrag: ( $marquee.find(".item").length > 1 ) ? true : false,
	touchDrag: ( $marquee.find(".item").length > 1 ) ? true : false

});

var $marquee = $('.marquee-testimonials');
$marquee.owlCarousel({

	items: 1,
	loop: ( $marquee.find(".testimonial").length > 1 ) ? true : false,
	autoHeight: false,

	margin: 0,

	nav: false,
	navText: ["",""],
	slideBy: 1,
	dots: ( $marquee.find(".testimonial").length > 1 ) ? true : false,
	dotEach: 3,
	dotData: false,

	video: true,
	videoWidth: false,
	videoHeight: false,

	autoplay: true,
	autoplayTimeout: 6000,
	autoplayHoverPause: false,
	smartSpeed: 400,
	autoplaySpeed: 700,
	navSpeed: 700,
	dotsSpeed: 700,
	responsiveRefreshRate: 300,
	animateOut: "fadeOut",
	animateIn: false,
	
	mouseDrag: ( $marquee.find(".testimonial").length > 1 ) ? true : false,
	touchDrag: ( $marquee.find(".testimonial").length > 1 ) ? true : false

});

var wow = new WOW(
  {
    boxClass:     'wow',      // animated element css class (default is wow)
    animateClass: 'animated', // animation css class (default is animated)
    offset:       0,          // distance to the element when triggering the animation (default is 0)
    mobile:       true,       // trigger animations on mobile devices (default is true)
    live:         true,       // act on asynchronously loaded content (default is true)
    callback:     function(box) {}
  }
);
wow.init();

$('.main-nav').find('ul').each( function( index, val ){
	if( index == 0 ) {
		$(this).children('li').addClass('top-level-nav-list');
	}
});

var getCount = $('.top-level-nav-list').length,
		getHalf = Math.floor(getCount / 2 ),
		getClientWidth = $(window).width();
var getList = $.map( $('.top-level-nav-list'), function( val, index ){
	if( index >= getHalf ) {
		return val;
	}
} );

function menuStructure() {
	
var getClientWidth = $(document).width();

if( getClientWidth >= 600 ) {
	if( ! $('.right-side-menu').length && ! $('.left-side-menu').length ) {
		$('.menu-bar').find('ul').eq(0).addClass('left-side-menu').after('<ul class="right-side-menu"></ul>');
	}
	for( i=0; i<getList.length; i++ ) {
		$('.right-side-menu').append(getList[i]);
	}
} else {
	var getListRight = $.map( $('.right-side-menu'), function( index, val ){ console.log(val);
		return val;
	});
	for( i=0; i<getListRight.length; i++ ) { 
		$('.left-side-menu').append(getListRight[i]);
	}
	$('right-side-menu').remove();
	$('.left-side-menu').removeClass('left-side-menu');
}

}

menuStructure();

$(window).resize( function(){
	
	clearTimeout( getTimerVar );
	var getTimerVar = setTimeout( function(){
		menuStructure();
	}, 250);
	
});

$('*[data-backplate]').each( function( index, val ){
	var getSRC = $(this).data( 'backplate' );
	$(this).css({ 'background-image': 'url(' + getSRC + ')' });
});

function menuFix(){

var menuPos = $('.menu-bar').position(),
		menuPosX = menuPos.top,
		clientWidth = $(window).width();
	
$(window).scroll( function(){
	
	if( $('.marquee').length && clientWidth >= 840 ) {
		
		var getScrollPos = $(window).scrollTop();
				
		if( getScrollPos > menuPosX )	{
			$('.menu-bar').addClass( 'fixed-nav' );
		} else {
			$('.menu-bar').removeClass( 'fixed-nav' );
		}
		
	} else {
		$('.menu-bar').removeClass( 'fixed-nav' );
	}
	
});

if( clientWidth < 840 ) {
	$('.menu-bar').removeClass( 'fixed-nav' );
}

}

menuFix();

$(window).resize( function(){
	
	clearTimeout( getTimeVar );
	var getTimeVar = setTimeout( function(){
		menuFix();
	}, 250);
	
});


$('a[href*=#]:not([href=#])').click(function() {
 if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
   var target = $(this.hash); console.log(target);
   target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
   if (target.length) {
     $('html,body').animate({
       scrollTop: target.offset().top
     }, 1000);
     return false;
   }
 }
});

$('.footnote').each( function(){
	$(this).closest('li').addClass('footnote-list');
});

$('.tab-nav').find('a').on('click', function(e){
	
	$(this).closest('li').addClass('active').siblings('li').removeClass('active');
	var getIndex = $(this).closest('li').index(); console.log(getIndex);
	
	$('.tab-wrap').each( function( index,val ){
		$(this).fadeOut(300);
		if( index == getIndex ) {
			$(this).fadeIn(300);
			var getHeight = $.map( $(this).find('.tab-col'), function( val,index ){
				return $(val).outerHeight();
			});
			var getMaxHeight = Math.max.apply( Math, getHeight );
			//$(this).find('.tab-col').css({ height: getMaxHeight + 'px' });
		}
		
	});
	
	
	
	e.preventDefault();
	
});

$('.tab-nav').find('a').eq(0).trigger('click');

function urlToggle() {
	
	var getHash = window.location.hash;
	if( getHash == "#lunch" ) {
		$('.tab-nav').find('li').eq(0).find('a').trigger('click');
	} else if( getHash == "#charcutherie" ) {
		$('.tab-nav').find('li').eq(0).find('a').trigger('click');
	} else if( getHash == "#dinner" ) {
		$('.tab-nav').find('li').eq(1).find('a').trigger('click');
	}
	
}
urlToggle();

$(window).on('hashchange', function() {
  urlToggle();
});

})(jQuery);