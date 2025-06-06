# Guest Apartment Booking System

This project is a web-based system for managing reservations for a shared guest apartment. It includes a user-facing frontend for submitting booking requests and a backend that handles validation, logging, and request processing.

[![Deploy](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen?style=flat&logo=github)](https://fedluc.github.io/book-guest-apartment/)

## 🚀 Live Demo

You can explore a live demo of the booking form at the link below:

👉 [Visit the live booking page](https://fedluc.github.io/book-guest-apartment/)

> ⚠️ **Note:** This is a demo version in which not all configuration variables are fully set. As a result, some features — such as form submission — may not work as expected.  
> 👉 See the [Configuration](#️-configuration) section below to learn how to set up a fully functional booking form.

---

## ⚙️ Configuration

The project is organized into two parts:

- **Backend**: Implemented as a [Google Apps Script](https://developers.google.com/apps-script), deployed as a web app.
- **Frontend**: A static site that can be deployed to any platform (e.g., GitHub Pages). It uses a `env.js` file for runtime configuration.

To run both components correctly, you must define the following environment variables.

---

### 🔐 Backend Environment Variables

These are configured in your **Google Apps Script project** under **Script Properties**.

| Variable | Description |
|----------|-------------|
| `RECAPTCHA_SECRET_KEY` | Secret key used to verify reCAPTCHA responses. [Get it from Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create) |
| `CALENDAR_ID` | The ID of the Google Calendar that manages booking events. [Find it in your calendar settings](https://support.google.com/calendar/answer/37083?hl=en) |
| `BOOKING_LOG_SHEET_ID` | The ID of the Google Sheet used to log booking submissions. [How to get a Google Sheet ID](https://spreadsheet.dev/how-to-find-the-id-of-a-google-spreadsheet) |

---

### 🌐 Frontend Environment Variables

These are defined in the `env.js` file and injected at deploy time (e.g., using GitHub Actions).

| Variable | Description |
|----------|-------------|
| `BACKEND_URL` | The deployed URL of the Google Apps Script web app that handles submissions. [Guide to deploying Apps Script as a web app](https://developers.google.com/apps-script/guides/web) |
| `RECAPTCHA_SITE_KEY` | The public site key for Google reCAPTCHA (used on the frontend). [Get it from Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create) |
