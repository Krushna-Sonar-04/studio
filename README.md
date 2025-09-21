# Firebase Studio - Civic Lens Prototype

This is a Next.js application created in Firebase Studio. It is a fully functional front-end prototype of a civic issue reporting platform designed to connect citizens with municipal authorities to resolve local issues efficiently.

## Features

- **Role-Based Dashboards**: Separate, tailored dashboards for Citizens, Administrators, Engineers, Managers, and Contractors.
- **Issue Reporting & Tracking**: Citizens can report issues with details, photos, and locations. They can track the status from submission to resolution via a timeline view.
- **AI-Assisted Verification**: Engineers use an AI-powered assistant to generate preliminary verification reports, speeding up the assessment process.
- **Dynamic Workflow Management**: A multi-step approval process involving different municipal roles to verify, estimate costs for, approve, and assign work.
- **Notifications System**: Users receive real-time notifications about new assignments, status changes, and escalations.
- **Multilingual Support**: The user interface supports English, Hindi, and Marathi.
- **Light/Dark Mode**: The application includes a theme switcher for user preference.

## User Roles & Workflow

The application simulates a complete workflow with the following user roles:

1.  **Citizen**: Reports new issues, tracks their progress, and receives notifications.
2.  **Head of Department (Admin)**: Oversees all issues, assigns them to engineers for verification, and assigns approved jobs to contractors.
3.  **Engineer**: Verifies the technical details of a reported issue and submits a report.
4.  **Fund Manager**: Estimates the cost required for resolving a verified issue.
5.  **Approving Manager**: Gives the final approval for the work based on the engineer's report and the fund manager's estimate.
6.  **Contractor**: Executes the work on the ground and submits a completion report with before/after photos.

## Tech Stack

This prototype is built with a modern, frontend-focused technology stack:

- **Framework**: [Next.js](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) (for the engineer's verification assistant)
- **State Management**: React Context API & Hooks

## Current Status: Prototype

This application currently operates **without a real backend**. It uses mock data and the browser's `localStorage` to simulate database and user authentication functionality.

This means:
- All data (issues, users, etc.) is temporary and stored only in your browser.
- Data is not shared between different users or browsers.
- Clearing your browser data will reset the application.

## Next Steps: Connecting to a Backend

To turn this prototype into a production-ready application, the next step is to connect it to a backend service like Firebase. This would involve:

1.  **Initializing Firebase** in the project.
2.  **Setting up Firestore** to replace the mock data for issues, users, and notifications.
3.  **Implementing Firebase Authentication** for a secure login system.
4.  **Using Cloud Storage for Firebase** to handle real image uploads.

## Getting Started with the Prototype

To run the prototype locally, first install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
