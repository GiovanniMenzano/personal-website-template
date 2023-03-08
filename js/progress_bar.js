$(function() {

	// element is not visible in case JS is disabled, making it visible before starting this script
	$("#read-progress").css("display", "unset");

	$(window).scroll(function() {
	
		let offset = $(window).scrollTop();
		let windowHeight = $(window).height();
		let height = $(document).height();
		let progress = (offset / (height - windowHeight)) * 100;
	
		$("#read-progress .progress-bar").css("width", progress + "%");
		
	});
});