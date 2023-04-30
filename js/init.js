document.addEventListener("DOMContentLoaded", init);

function init() {

	// fix to improve scrolling performance by forcing jQuery to use passive listeners
	jQueryPassiveListenersFix();

	// typewriter
	initTypewriter();

	// carousel
	initProjectCarousel();

	// console welcome message
	console.log(
		"\n" +
		"Hello there, \x1b[32mdeveloper\x1b[0m! Thanks for visiting.\n" +
		"This is a template I made from the first frontend project I did, my personal website. " +
		"I made it for fun, as you can tell from all the bullshit I've put in it, but also to learn.\n" +
		"As a \x1b[32mbackend developer\x1b[0m this is not my field, " +
		"so I could have missed something or done something \x1b[33mdumb\x1b[0m :). If you find a \x1b[31mbug\x1b[0m, anything \x1b[31mwrong\x1b[0m, or have a suggestion, " +
		"feel free to contact me from the contact page, GitHub or anywhere else you can find me!\n" +
		"\n"
	);
}

function initTypewriter() {

	const typewriterElement = document.querySelector(".type-area");

	// using fetch to get config data from server
	fetch("../js/config.json")
	.then(response => response.json())
	.then(data => {

		/* the .slice method makes a (shallow) copy of an array, calling it with no arguments just copies the entire array.
		Why am I calling it with 0? As you can read here https://stackoverflow.com/questions/11286950/using-the-javascript-slice-method-with-no-arguments:
		"JavaScript references (like MDN) usually say that .slice() requires at least one argument, the start index. Calling .slice() with no arguments is like saying .slice(undefined).
		In the ECMAScript Language Spec, step 5 in the .slice() algorithm says "Let relativeStart be ToInteger(start)".
		If you look at the algorithm for the abstract operation ToInteger(), which in turn uses ToNumber(), you'll see that it ends up converting undefined to 0."
		*/
		const lines = data.lines.slice(0);
		const defaultLines = data.defaultLines.slice(0);
		const typingDelay = data.typewriterTypingDelay;
		const readingDelay = data.typewriterReadingDelay;

		// typewriter
		let tw = new TypeWriter(typewriterElement, lines, defaultLines, typingDelay, readingDelay, true);
		tw.start();

	});
}

function initProjectCarousel() {

	$(document).ready(function() {
		
		var carousel = $(".owl-carousel");

		carousel.owlCarousel({

			// animateOut : "",
			// animateIn : "",

			loop : true,
			smartSpeed : 800,
			autoplay : true,
			autoplayTimeout : 20000,
			autoplayHoverPause : true,
			nav: true,
            navText:["<img src='../assets/img/arrow_left.svg' class='slide__button' aria-hidden='true'>","<img src='../assets/img/arrow_right.svg' class='slide__button' aria-hidden='true'>"],

			items : 1, 
			itemsDesktop : false,
			itemsDesktopSmall : false,
			itemsTablet: false,
			itemsMobile : false,

			// making carousel aria accessible
			onInitialized: function (event) {

				$(".owl-carousel").find(".owl-item").attr("role", "option").attr("aria-selected", "false");
				$(".owl-carousel").find(".owl-item.active").attr("role", "option").attr("aria-selected", "true");

				$(".owl-carousel").find(".owl-prev").attr("role", "button").attr("title", "previous carousel slide");
				$(".owl-carousel").find(".owl-next").attr("role", "button").attr("title", "next carousel slide");
				$(".owl-carousel, .owl-prev, .owl-next").attr("tabindex", "0");

				$('.owl-carousel').each(function() {
					$(this).find('.owl-dot').each(function(index) {
						$(this).attr('aria-label', index + 1);
					});
				});

			},

			// updating aria attributes when the carousel state changes
			onChange: function() {

				$(".owl-carousel").find(".owl-item").attr("role", "option").attr("aria-selected", "false");
				$(".owl-carousel").find(".owl-item.active").attr("role", "option").attr("aria-selected", "true");

			}
		});

		// key bindings, to use left and right keyboard keys in carousel navigation. I know you dgaf, I just wanted to add this.
		$(document.documentElement).keyup(function(event) {  

			if (event.keyCode == 37) { // left key
				carousel.trigger("prev.owl.carousel", [700]);
			} else if (event.keyCode == 39) { // right key
				carousel.trigger("next.owl.carousel", [700]);
			}
			
		});

	});
}

function jQueryPassiveListenersFix() {
	jQuery.event.special.touchstart = {
		setup: function( _, ns, handle ) {
			this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
		}
	};
	jQuery.event.special.touchmove = {
		setup: function( _, ns, handle ) {
			this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
		}
	};
	jQuery.event.special.wheel = {
		setup: function( _, ns, handle ){
			this.addEventListener("wheel", handle, { passive: true });
		}
	};
	jQuery.event.special.mousewheel = {
		setup: function( _, ns, handle ){
			this.addEventListener("mousewheel", handle, { passive: true });
		}
	};
}