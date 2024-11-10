Milestone 02
===

Repository Link
---
https://github.com/AadimNepal/Final-project

Special Instructions for Using Form and / or Login
---
- **Authentication Required**: Both doctors and patients need to register and log in to access their respective dashboards.
- **Doctor Registration**: Doctors must use an `@nyu.edu` email to register successfully.
- **Email Verification**: Upon registration, a verification code will be sent via email to confirm the account. Ensure that SMTP credentials are set up in the `.env` file for this feature to work.
- **PM2 Setup**: The application is configured to run as a daemon using PM2, so it remains active even when logged out of the server.

URL for Deployed Site 
---
http://linserv1.cims.nyu.edu:22229

URL for Form
---
http://linserv1.cims.nyu.edu:22229/register

URL for Form Result
---
http://linserv1.cims.nyu.edu:22229/login

URL to GitHub that Shows Line of Code Where Research Topic(s) are Used / Implemented
--- 
(TODO: Add URL to specific lines in your GitHub repository where specific research topics or advanced features were implemented, if required by the assignment)

References 
---
1. **Nodemailer Documentation** - Used for email functionality during registration: [Nodemailer Guide](https://nodemailer.com/about/)
2. **MongoDB Atlas Documentation** - Configured MongoDB Atlas connection string: [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
3. **PM2 Setup Guide** - For managing the application as a daemon: [PM2 Documentation](https://pm2.keymetrics.io/)
