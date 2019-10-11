$(document).ready(function () {
	
	/* ObjectFit polifill init
	=========================*/
	var someImages = document.querySelectorAll('img');
	objectFitImages(someImages);
	
	
	/* Popup
	=========================*/
	window.globalPopup = new Popup();
	
	$(document).on('click', '[data-ajax]', function (e) {
		e.stopPropagation();
		e.preventDefault();
		$.get(this.getAttribute('data-url'), function (response) {
			globalPopup.html(response).show();
		});
	});
	
	/* humburger
	=========================*/
	$('#js-hamburger').click(function () {
		
		$(this).toggleClass('active');
		$('#js-menu').toggleClass('active');
		$('html, body').toggleClass('body-hidden');
	});
	
	
	/* WOW
	=========================*/
	new WOW().init();
	
	
	/* Swipper
	=========================*/
	
	var mainSwipper = '.js-swiper-main';
	var jdSlider = '.js-services-jd__slider';
	
	if ($(mainSwipper)) {
		
		var mainslider = new Swiper(mainSwipper, {
			slidesPerView: 1,
			speed: 600,
			parallax: true,
			loop: true,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false,
			},
			pagination: {
				el: '.swiper-pagination',
				type: 'fraction',
				loop: true,
				
			},
			navigation: {
				nextEl: '.js-slider-nav__next',
				prevEl: '.js-slider-nav__prev',
			},
		});
	}
	
	if ($(jdSlider)) {
		
		var jdSlider = new Swiper(jdSlider, {
			slidesPerView: 1,
			speed: 600,
			parallax: true,
			loop: true,
			spaceBetween: 0,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false,
			},
			navigation: {
				nextEl: '.services-jd__slider-next',
				prevEl: '.services-jd__slider-prev',
			},
			breakpoints: {
				768: {
					pagination: {
						el: '.swiper-pagination',
						clickable: true,
					},
				}
			}
		});
	}
	
	/* READ MORE
	======================*/
	
	$('.js-read-more').readmore({
		speed: 75,
		collapsedHeight: 250,
		moreLink: '<a class="read-more__link" href="#">Показать еще</a>',
		lessLink: '<a class="read-more__link active" href="#">Свернуть</a>',
	});
	
	/* Phone mask
	======================*/
	
	// $('[type=tel]').mask("8 (999) 999-9999", {placeholder: "8 (Код) ___-____"});
	
	/*Wow
	================*/
	
	new WOW().init();
	
	/* Smooth scroll to section
	===================================*/
	
	$(".js-anim-scroll").click(function () {
		
		var offset = parseInt(this.getAttribute('data-offset')) || 90;
		
		var top = $(this.getAttribute("href")).offset().top - offset;
		
		$("html, body").animate({scrollTop: top + "px"});
		
		return false;
	});
	
	// Прибивка адаптивного футера к низу
	(function (footerSelector, wrapperSelector) {
		
		var footer = document.querySelector(footerSelector);
		var wrapper = document.querySelector(wrapperSelector);
		var height;
		var setSize;
		
		if (!wrapper || !footer) {
			return false;
		}
		
		setSize = function () {
			
			height = footer.offsetHeight;
			
			wrapper.style.paddingBottom = height + 'px';
			footer.style.marginTop = (height * (-1)) + 'px';
			
		}
		
		setSize();
		
		window.addEventListener('resize', setSize, false);
		
	})('#js-footer', '#js-wrapper');
	
});
