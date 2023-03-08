document.addEventListener("DOMContentLoaded", init);

function init() {

	// using fetch to get config data from server
	fetch("../js/config.json")
	.then(response => response.json())
	.then(data => {

		emailjs.init(data.emailjspk);

	});

    document.getElementById("contact-form").addEventListener("submit", function(event) {

		console.log("form submit event received");
	
		document.getElementById("submit-button").setAttribute("disabled", true); // since I'm making the call to the email service, I disable the submit button...
		document.getElementById("submit-button").classList.add("button--loading"); // ...and add a loading animation because emailjs takes fuckin' forever to respond
        
		event.preventDefault(); // allow customized form submit

		/*
		added this check in case you want to enable/disable recaptcha. It runs the callback method,
		that tipically is called by the google api, if no recaptcha element is found
		*/
		 if(document.getElementById("g-recaptcha")) {
			grecaptcha.reset(); // the recaptcha token can only be used once, I can't send it again to emailjs, so I reset the widget to let the user reuse the form, if needed
			grecaptcha.execute();
		} else {
			recaptchaCallback(null);
		}

	});
}

function recaptchaCallback(token) {

	/*
	first paramenter is the service id, you can set it by adding an email service here "https://dashboard.emailjs.com/admin",
	second one is the template id, set it by creating an email template here "https://dashboard.emailjs.com/admin/templates",
	third one is your html form id,
	last one is the public key used to initialize emailjs, you get it right after registering here "https://dashboard.emailjs.com/admin/account"
	*/
	emailjs.sendForm("contact_service_placeholder", "contact_form_placeholder", "#contact-form")
	.then(function(response) {
	
		console.log(response.status, response.text, "message sent");
		document.getElementById("contact-form").reset(); // clean the form after the message has been sent
		showResult("button", "success");
	
	}, function(error) {
	
		console.log(error.status, error.text, "message not sent");
		showResult("button", "error");
	
	});

}

function showResult(mode, result) { // TODO need to rewrite because it makes me throw up

	document.getElementById("submit-button").classList.remove("button--loading");
	if (mode === "button") { // this animate the submit button, informing the user about the result by changing the button text to a success or error string...

		if (result === "success") {

			document.getElementById("submit-button").classList.add("button--success");
			setTimeout(function() { document.getElementById("submit-button").classList.remove("button--success"); }, 3000);

		} else if (result === "error") {

			document.getElementById("submit-button").classList.add("button--error");
			setTimeout(function() { document.getElementById("submit-button").classList.remove("button--error"); }, 3000);

		}
	} else if (mode === "message") { // ...while this shows a message, colored either in green or red

		document.getElementById("result-message").classList.remove("result-message--active", "result-message--ok", "result-message--ko"); // removing result message to show the new one

		if (result === "success") {

			document.getElementById("result-message").innerHTML = "Message sent";
			document.getElementById("result-message").classList.add("result-message--active", "result-message--ok");

		} else if (result === "error") {
			
			document.getElementById("result-message").innerHTML = "An error occurred, try again later";
			document.getElementById("result-message").classList.add("result-message--active", "result-message--ko");
		
		}
	}

	setTimeout(function() { document.getElementById("submit-button").removeAttribute("disabled"); }, 3000); // finally I enable the submit button again, after 3 seconds to match the button result animation

}

function addClass (elementId, classToAdd) {

}

function checkInputValidity(element) {

	const input = document.getElementById(element);
	const validityState = input.validity;
	
	if (validityState.valueMissing) {
		input.setCustomValidity("mandatory field");
	} else {
		input.setCustomValidity("please check your entries");
	}
	
	input.reportValidity();

}

function isNotEmpty(value) {

	if (value == null || typeof value == "undefined" ) return false;
	return (value.length > 0);

}

function isEmail(email) {

	let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	return regex.test(String(email).toLowerCase());

}