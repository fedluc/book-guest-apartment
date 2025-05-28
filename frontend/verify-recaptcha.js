document.addEventListener('DOMContentLoaded', () => {
  const siteKey = window.ENV?.RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    console.error('Missing reCAPTCHA site key');
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadCallback&render=explicit';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  window.onRecaptchaLoadCallback = function () {
    grecaptcha.render('recaptcha-container', {
      sitekey: siteKey
    });
  };
});