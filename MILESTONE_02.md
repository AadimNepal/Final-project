Milestone 02
===

Repository Link
---
https://github.com/AadimNepal/Final-project

### Special Instructions for Using Form and / or Login
---
- **Authentication Required**: Both doctors and patients must register and log in to access their respective dashboards.
  
- **Doctor Registration**: Doctors must register with an `@nyu.edu` email. Upon successful login, they will gain access to the **Doctor Dashboard**.

- **Patient Registration**: Patients can register with any email. After logging in, patients are directed to the **Patient Dashboard**, where they can view encounter logs submitted by doctors.

- **Doctor Dashboard**: Doctors can select a registered patient from a dropdown list and complete a form to submit an encounter log for that patient. Once the form is submitted, the information is saved to the patient’s account.

- **Patient Dashboard**: Patients can view the details submitted by doctors, including encounter dates, descriptions, and the doctor’s name.

- **Example Accounts**:
    - **Doctor**: `awahan@nyu.edu` with password `awahan`
    - **Patient**: `aadim@gmail.com` with password `aadim`

You may also create your own test accounts to explore the functionalities of both the doctor and patient dashboards.

URL for Deployed Site 
---
http://linserv1.cims.nyu.edu:22229

### URL for Form
---
- **Login and Registration**: [http://linserv1.cims.nyu.edu:22229](http://linserv1.cims.nyu.edu:22229)
- **Doctor Dashboard (Add Encounter Info)**: [http://linserv1.cims.nyu.edu:22229/doctor-dashboard](http://linserv1.cims.nyu.edu:22229/doctor-dashboard)

### URL for Form Result
---
- **Patient Dashboard (View Encounter Logs)**: [http://linserv1.cims.nyu.edu:22229/patient-dashboard](http://linserv1.cims.nyu.edu:22229/patient-dashboard)

### URL to GitHub that Shows Line of Code Where Research Topic(s) are Used / Implemented
--- 
I did research on Tailwind CSS, and all of my `.hbs` files integrate the Tailwind CSS CDN.

- **Tailwind CSS in index.hbs**: [Link to index.hbs](https://github.com/AadimNepal/Final-project/blob/main/views/index.hbs#L6)
- **Tailwind CSS in doctor-dashboard.hbs**: [Link to doctor-dashboard.hbs](https://github.com/AadimNepal/Final-project/blob/main/views/doctor-dashboard.hbs#L6)
- **Tailwind CSS in patient-dashboard.hbs**: [Link to patient-dashboard.hbs](https://github.com/AadimNepal/Final-project/blob/main/views/patient-dashboard.hbs#L6)


References 
---
1. **Nodemailer Documentation** - Used for email functionality during registration: [Nodemailer Guide](https://nodemailer.com/about/)
2. **MongoDB Atlas Documentation** - Configured MongoDB Atlas connection string: [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
3. **PM2 Setup Guide** - For managing the application as a daemon: [PM2 Documentation](https://pm2.keymetrics.io/)
