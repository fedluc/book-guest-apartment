# Guest Apartment Booking System

This project is a web-based booking system for managing reservations for a guest apartment. It consists of a frontend for users to submit booking requests and a backend to process and manage these requests.

## Features

### Frontend
- **Booking Form**: Users can fill out a form to book the guest apartment, specifying their name, email, address, apartment number, and desired dates.
- **Date Restrictions**: Ensures valid date selection for bookings, with rules for minimum and maximum dates.
- **reCAPTCHA Integration**: Protects the form from spam submissions using Google reCAPTCHA.
- **Honeypot Field**: Additional spam prevention mechanism.

### Backend
- **Booking Validation**: Ensures no double bookings and checks availability for the selected dates.
- **Google Calendar Integration**: Adds confirmed bookings to a Google Calendar.
- **Email Confirmation**: Sends a confirmation email to the user upon successful booking.
- **Logging**: Logs booking submissions to a Google Sheet for record-keeping.
- **Log Cleanup**: Removes old log entries after a specified number of days.

## Project Structure

### Frontend
- **`booking-form.html`**: HTML file for the booking form.
- **`booking-submit.js`**: Handles form submission and communicates with the backend.
- **`date-restrictions.js`**: Implements date validation logic for the form.
- **`on-recaptcha-load-callback.js`**: Initializes Google reCAPTCHA.

### Backend
- **`main.js`**: Processes booking requests and integrates with Google Calendar and Gmail.
- **`verify-recaptcha.js`**: Verifies reCAPTCHA tokens.
- **`log-submission.js`**: Logs booking submissions to a Google Sheet.
- **`cleanup-logs.js`**: Cleans up old log entries from the Google Sheet.

## Setup

### Frontend
1. Place the frontend files on a web server.

### Backend
1. Deploy the backend scripts using Google Apps Script.
2. Set up script properties:
   - `RECAPTCHA_SECRET_KEY`: Your reCAPTCHA secret key.
   - `CALENDAR_ID`: The ID of the Google Calendar for bookings.
   - `BOOKING_LOG_SHEET_ID`: The ID of the Google Sheet for logging submissions.

### Deployment
1. Use `clasp` to deploy the backend scripts.
2. Host the frontend files on a web server.

## Usage
1. Open the booking form in a browser.
2. Fill out the required fields and submit the form.
3. Check your email for a booking confirmation.