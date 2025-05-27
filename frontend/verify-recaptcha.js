window.onload = function () {
    if (window.ENV && window.ENV.RECAPTCHA_SITE_KEY) {
      grecaptcha.render("recaptcha-container", {
        sitekey: window.ENV.RECAPTCHA_SITE_KEY
      });
    } else {
      console.error("reCAPTCHA site key missing.");
    }
  };