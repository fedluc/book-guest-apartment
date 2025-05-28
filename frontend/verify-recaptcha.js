function verifyRecaptcha() {
  if (window.ENV && window.ENV.RECAPTCHA_SITE_KEY) {
    grecaptcha.render('recaptcha-container', {
      sitekey: window.ENV.RECAPTCHA_SITE_KEY
    });
  } else {
    console.error("reCAPTCHA site key missing in env.js");
    document.getElementById('message').textContent = "reCAPTCHA configuration error.";
  }
}