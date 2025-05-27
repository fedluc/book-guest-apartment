function verifyRecaptcha(token) {
    const secretKey = PropertiesService.getScriptProperties().getProperty("RECAPTCHA_SECRET_KEY");
    const response = UrlFetchApp.fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "post",
      payload: {
        secret: secretKey,
        response: token
      }
    });
    const json = JSON.parse(response.getContentText());
    return json.success === true;
  }