# Secure Web Application — Cybersecurity Internship (Weeks 4–6)

## Overview
A Node.js/Express application demonstrating real-world security implementations
covering intrusion detection, API hardening, ethical hacking, and security audits.

## Technologies Used
- Node.js + Express
- Fail2Ban (Intrusion Detection)
- OWASP ZAP, Nikto, Lynis (Security Audits)
- SQLMap, Burp Suite (Penetration Testing)
- Docker + Trivy (Container Security)
- Helmet.js, CSRF, Rate Limiting (Middleware)

## Security Features Implemented

### Week 4 — API Security & Threat Detection
- Rate limiting (100 requests/15 min per IP)
- API Key authentication
- CORS restricted to trusted origins
- Content Security Policy (CSP) headers
- HSTS (HTTP Strict Transport Security)
- Fail2Ban monitoring SSH for brute-force attempts

### Week 5 — Ethical Hacking & Fixes
- SQL Injection discovered via SQLMap on vulnerable route
- Fixed using prepared statements (parameterized queries)
- CSRF protection implemented using csurf middleware
- CSRF tested and confirmed blocked via Burp Suite
- Reconnaissance performed using Nmap and Whatweb

### Week 6 — Security Audits
- OWASP ZAP automated scan completed
- Nikto web server scan performed
- Lynis system hardening audit completed
- Docker image scanned with Trivy
- Dockerfile hardened (non-root user, minimal base image)

## How to Run
```bash
npm install
node server.js
```

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/data | GET | Protected by API Key |
| /api/user | GET | SQL injection safe (prepared statement) |
| /form | GET | Returns CSRF token |
| /submit | POST | CSRF protected form submission |

## Screenshots
(Add your screenshots here)

## Security Report
See `security-report.md` for full findings and analysis.
