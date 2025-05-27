function checkRateLimit(e) {
  const MAX_REQUESTS = 3;
  const WINDOW_MINUTES = 10;
  const BLOCK_MINUTES = 60;
  const ip = (e.headers && e.headers["X-Forwarded-For"]) || "unknown";
  const email = (e.parameter && e.parameter.email || "").trim().toLowerCase();
  const now = new Date();
  const props = PropertiesService.getUserProperties();
  const ipBlockKey = `block_ip_${ip}`;
  const emailBlockKey = `block_email_${email}`;
  const ipBlockedUntil = props.getProperty(ipBlockKey);
  const emailBlockedUntil = props.getProperty(emailBlockKey);
  // 1. Check if IP or email is blocked
  const blockedUntil = [ipBlockedUntil, emailBlockedUntil]
    .map(ts => ts ? new Date(ts) : null)
    .filter(d => d && d > now)
    .sort((a, b) => b - a)[0];
  if (blockedUntil) {
    const retryAfter = Math.ceil((blockedUntil - now) / 1000 / 60);
    return { limited: true, retryAfter, reason: "blocked" };
  }
  // 2. Check recent submissions from same IP/email
  const sheetId = PropertiesService.getScriptProperties().getProperty("BOOKING_LOG_SHEET_ID");
  const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  const rows = sheet.getDataRange().getValues().slice(1); // skip header
  let recentCount = 0;
  const cutoff = new Date(now.getTime() - WINDOW_MINUTES * 60 * 1000);
  for (let row of rows.reverse()) { // reverse to scan recent first
    const [timestampStr, loggedIp, loggedEmail] = row;
    const ts = new Date(timestampStr);
    if (ts < cutoff) break;
    if (loggedIp === ip || loggedEmail.toLowerCase() === email) {
      recentCount++;
    }
    // 3. Block both IP and email for BLOCK_MINUTES
    if (recentCount >= MAX_REQUESTS) { 
      const blockUntil = new Date(now.getTime() + BLOCK_MINUTES * 60 * 1000);
      props.setProperty(ipBlockKey, blockUntil.toISOString());
      props.setProperty(emailBlockKey, blockUntil.toISOString());
      return { limited: true, retryAfter: BLOCK_MINUTES, reason: "too-many-requests" };
    }
  }
  return { limited: false };
}