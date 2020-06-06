(function ($) {
	"use strict";

		jQuery(document).ready(function($){
		
			$('#nav').slicknav();
	
			// header top Menu
			$('.left_header_top > ul > li').hover(
				function(){
					$(this).children('.left_header_top > ul > li > ul').css('display','table')
				},
				function(){	
					$(this).children('.left_header_top > ul > li > ul').css('display','none')
				}
			);

			// header top Menu
			$('.right_header_top > ul > li').hover(
				function(){
					$(this).children('.right_header_top > ul > li > ul').css('display','table')
				},
				function(){
					$(this).children('.right_header_top > ul > li > ul').css('display','none')
				}
			);

			// footer top carousel
			
			$('.footer_top_slider').owlCarousel({
				loop:true,
				autoHeight: true,
				autoplay: true,
				nav: false,
				margin:30,
				responsive:{
					0:{
						items:2
					},
					768:{
						items:3
					},
					992:{
						items:4
					},
					1000:{
						items:6
					}
				}
			});

			// upsell product carousel
			
			$('.upsell_products_carousel').owlCarousel({
				loop:true,
				nav : true, // Show next and prev buttons
				navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
				autoHeight: true,
				autoplay: false,
				margin:30,
				responsive:{
					0:{
						items:2
					},
					600:{
						items:1
					},
					1000:{
						items:3
					},
					300:{
						items:1
					}
				}
			});

			//another_accordion (about us page)

			$(".another_accordion").collapse({
				accordion:true,
			  open: function() {
				this.slideDown(550);
			  },
			  close: function() {
				this.slideUp(550);
			  }		
			});

			
			
			//another_accordion (grid page)

			$('.collapse').on('shown.bs.collapse', function(){
				$(this).parent().find(".fa-plus-square-o").removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
				}).on('hidden.bs.collapse', function(){
				$(this).parent().find(".fa-minus-square-o").removeClass("fa-minus-square-o").addClass("fa-plus-square-o");
			});

				//another_accordion (grid page)

			$('.collapse').on('shown.bs.collapse', function(){
				$(this).parent().find(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
				}).on('hidden.bs.collapse', function(){
				$(this).parent().find(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
			});
		
		

			// add to cart hover add
			$('.single_tab_content .add_to_cart').hover(function(){
					$('.single_tab_content').addClass('hover');
				},
				function(){
					$('.single_tab_content').removeClass('hover');
			});


			// MENU
			$('#cssmenu li.has-sub>a').on('click', function() {
				$(this).removeAttr('href');
				var element = $(this).parent('li');
				if (element.hasClass('open')) {
					element.removeClass('open');
					element.find('li').removeClass('open');
					element.find('ul').slideUp();
				} else {
					element.addClass('open');
					element.children('ul').slideDown();
					element.siblings('li').children('ul').slideUp();
					element.siblings('li').removeClass('open');
					element.siblings('li').find('li').removeClass('open');
					element.siblings('li').find('ul').slideUp();
				}
			});
			$('#cssmenu>ul>li.has-sub>a').append('<span class="holder"></span>');
			(function getColor() {
				var r, g, b;
				var textColor = $('#cssmenu').css('color');
				textColor = textColor.slice(4);
				r = textColor.slice(0, textColor.indexOf(','));
				textColor = textColor.slice(textColor.indexOf(' ') + 1);
				g = textColor.slice(0, textColor.indexOf(','));
				textColor = textColor.slice(textColor.indexOf(' ') + 1);
				b = textColor.slice(0, textColor.indexOf(')'));
				var l = rgbToHsl(r, g, b);
				if (l > 0.7) {
					$('#cssmenu>ul>li>a').css('text-shadow', '0 1px 1px rgba(0, 0, 0, .35)');
					$('#cssmenu>ul>li>a>span').css('border-color', 'rgba(0, 0, 0, .35)');
				} else {
					$('#cssmenu>ul>li>a').css('text-shadow', '0 1px 0 rgba(255, 255, 255, .35)');
					$('#cssmenu>ul>li>a>span').css('border-color', 'rgba(255, 255, 255, .35)');
				}
			})();

			function rgbToHsl(r, g, b) {
				r /= 255, g /= 255, b /= 255;
				var max = Math.max(r, g, b),
					min = Math.min(r, g, b);
				var h, s, l = (max + min) / 2;
				if (max == min) {
					h = s = 0;
				} else {
					var d = max - min;
					s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
					switch (max) {
						case r:
							h = (g - b) / d + (g < b ? 6 : 0);
							break;
						case g:
							h = (b - r) / d + 2;
							break;
						case b:
							h = (r - g) / d + 4;
							break;
					}
					h /= 6;
				}
				return l;
			}
		});
		
		/** start prelaoder js **/

		$(window).load(function() { // makes sure the whole site is loaded
			$('#status').fadeOut(); // will first fade out the loading animation
			$('#loader-wrapper').delay(300).fadeOut('slow'); // will fade out the white DIV that covers the website.
			$('body').delay(350).css({'overflow-x':'hidden'});
		})

		/** end prelaoder js **/

		/* ---Scroll Up-- */

		/*----------------------------------------*/
	/*  Cart Plus Minus Button
/*----------------------------------------*/
	$('.cart-plus-minus').append(
		'<div class="dec qtybutton"><i class="fa fa-angle-down"></i></div><div class="inc qtybutton"><i class="fa fa-angle-up"></i></div>'
	);
	$('.qtybutton').on('click', function() {
		var $button = $(this);
		var oldValue = $button.parent().find('input').val();
		if ($button.hasClass('inc')) {
			var newVal = parseFloat(oldValue) + 1;
		} else {
			// Don't allow decrementing below zero
			if (oldValue > 1) {
				var newVal = parseFloat(oldValue) - 1;
			} else {
				newVal = 1;
			}
		}
		$button.parent().find('input').val(newVal);
	});
		
})(jQuery);
