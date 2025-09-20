# Firebase Studio - Civic Lens Prototype

This is a Next.js application created in Firebase Studio. It is a fully functional front-end prototype of a civic issue reporting platform.

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
