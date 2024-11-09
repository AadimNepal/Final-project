# HealthLog Portal

## Overview

**HealthLog Portal** is a web-based application designed for managing and tracking patient encounters within a hospital environment. The portal offers a secure, role-based system where doctors can log in to add encounter records for patients, capturing details like visit reasons, diagnoses, and prescriptions. Patients can log in to view a personal history of their encounters, while an admin oversees user accounts and manages encounter data, ensuring comprehensive and efficient data handling for healthcare facilities. Built using Express, MongoDB, and Mongoose, HealthLog Portal emphasizes streamlined access, data security, and easy-to-use interfaces tailored to each user role.

---

## Data Model

The HealthLog Portal application will store data for **Users**, **Encounters**, and **Prescriptions**, with relationships structured to support role-based access and efficient data retrieval.

- **Users** have different roles: `admin`, `doctor`, or `patient`.
- **Encounters** are linked to both patients and doctors, with detailed information on each patient visit.
- **Prescriptions** are associated with encounters and include medication information.

### Relationships

- **Users** can be associated with multiple encounters (via references).
- **Encounters** link a **doctor** to a **patient** (via references).
- **Prescriptions** are embedded within encounters to maintain relevant details for each visit.

### Sample Documents

An Example **User**:

```javascript
{
  name: "John Doe",
  email: "johndoe@example.com",
  passwordHash: "hashedpassword123",
  role: "doctor", // could be "admin" or "patient"
  encounters: [/* array of references to Encounter documents */]
}
```

An Example **Encounter** with Embedded Prescriptions and Messages:

```javascript
{
  patientId: /* reference to a User object with role 'patient' */,
  doctorId: /* reference to a User object with role 'doctor' */,
  encounterDate: "2024-10-31T14:30:00Z",
  reasonForVisit: "Annual Checkup",
  diagnosis: "Hypertension",
  prescriptions: [
    {
      medication: "Lisinopril",
      dosage: "10 mg",
      frequency: "Once daily",
      instructions: "Take with water, preferably at the same time each day.",
      issuedAt: "2024-10-31T00:00:00Z",
      validUntil: "2025-10-31T00:00:00Z"
    }
  ],
  messages: [
    { sender: "doctor", message: "Patient advised to reduce salt intake.", sentAt: "2024-10-31T15:00:00Z" }
  ]
}
```

An Example **Prescription**:

```javascript
{
  medication: "Amoxicillin",
  dosage: "500 mg",
  frequency: "Twice daily",
  instructions: "Take after meals.",
  issuedAt: "2024-10-31T00:00:00Z",
  validUntil: "2024-11-30T00:00:00Z",
  scanImages: [/* array of image URLs for reference */]
}
```


Here’s an adapted version of the proposal for the **HealthLog Portal** project:

---

## [Link to Commented First Draft Schema](Project/db.mjs)

## Wireframes

Below are wireframes representing the main pages for the HealthLog Portal.

### `/login` - Login Page for Users

![login](documentation/login.png)

This page allows users (patients, doctors, and the admin) to enter their credentials to access the portal.

### `/encounters` - Encounter Log Page for Patients

![encounters](documentation/encounters.png)

This page displays a list of past encounters for the logged-in patient, each with details on the date, doctor, diagnosis, and prescriptions.

### `/encounter/create` - Encounter Creation Page for Doctors

![encounter create](documentation/encounter-create.png)

Doctors can access this page to create a new encounter for a patient, filling out fields like the reason for visit, diagnosis, and adding prescriptions.

### `/admin/manage-users` - User Management Page for Admin

![admin manage users](documentation/admin-manage-users.png)

The admin uses this page to manage users, create new accounts, and assign roles (doctor, patient). The admin can also view and manage encounter records.

---


## Site map

![Site-map](documentation/site-map.png)


## User Stories or Use Cases

1. **As a non-registered user, I can register** 
2. **As an admin, I can log in to the site** to manage users and encounter records.
3. **As an admin, I can create accounts for doctors and patients** and manage their information.
4. **As an admin, I can view and manage all patient encounters** to ensure data accuracy and oversight.
5. **As a doctor, I can log in to the site** to create and view patient encounter records.
6. **As a doctor, I can create a new encounter for a patient**, specifying details like reason for visit, diagnosis, and prescriptions.
7. **As a doctor, I can view all encounters associated with my patients** to review patient history and continuity of care.
8. **As a patient, I can log in to the site** to view my personal medical history.
9. **As a patient, I can view a list of all my past encounters**, including details like the date, reason for visit, diagnosis, and prescriptions.

---

### Suggested Research Topics (Total: 10 Points)

1. **(5 points) Automated Functional Testing for All Routes**
   - **Tool**: Selenium or Headless Chrome
   - **Description**: Implement automated functional tests to validate the main routes for each user role (Admin, Doctor, Patient). This will ensure that each role has the correct access permissions and can only perform allowed actions:
     - **Admin** can manage users and encounters.
     - **Doctor** can create new encounters and view patient histories.
     - **Patient** can view only their own encounter history.

2. **(2 points) Integrate ESLint into Workflow**
   - **Tool**: ESLint
   - **Description**: Use ESLint to enforce consistent code style and catch potential issues in your JavaScript codebase. This will improve the maintainability of the HealthLog Portal and ensure code quality across all modules, such as user authentication, encounter management, and API interactions.

3. **(2 points) Use a CSS Framework**
   - **Framework**: Tailwind CSS or Bootstrap
   - **Description**: Customize a CSS framework to create a clean, responsive UI for the HealthLog Portal. This will ensure the portal is accessible across devices and provide a user-friendly interface for patients, doctors, and the admin.

4. **(1 point) Configuration Management with `nconf`**
   - **Tool**: `nconf`
   - **Description**: Use `nconf` for configuration management to separate environment settings (e.g., database connections, API keys) from the application code. This will add a layer of security and flexibility to the HealthLog Portal, making it easier to manage different environments (development, production).

---


## [Link to Initial Main Project File](Project/app.mjs) 

## Annotations / References Used

1. [JS MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
2. [Express JS Documentation](https://expressjs.com)

