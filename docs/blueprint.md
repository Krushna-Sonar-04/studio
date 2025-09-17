# **App Name**: CivitasConnect

## Core Features:

- Citizen Issue Reporting: Allows citizens to report civic issues with details like location, description, and photos, uploaded from their computer.
- Multi-Role Dashboards: Provides separate dashboards for citizens, Head of Department, Engineers, Fund Managers, Approving Managers, and Contractors to manage their respective tasks.
- Issue Tracking Timeline: Displays a step-by-step timeline for each reported issue, showing its progress from submission to resolution.
- Verification Report Generation: Generates an Issue Verification Report tool, with technical comments, and an optional verification photo (generative AI isn't necessary). The LLM should decide if any fields in a previous step need confirmation by a user.
- Cost Estimation Reporting: Allows Fund Managers to submit cost estimation reports for verified issues, including estimated costs and detailed notes.
- Approval Workflow: Enables Approving Managers to review issue reports, Engineer verification, and Fund Manager estimates before approving or rejecting projects.
- Contractor Job Management: Facilitates Contractors in managing assigned jobs, updating statuses, and submitting before-and-after photos to mark job completion.

## Style Guidelines:

- Primary color: Teal (#008080) evokes trust and efficiency. We should avoid literal cliches (like green for money), and instead hint at the user's goal; government *of, by, and for* the citizens.
- Background color: Light gray (#F0F8FF), creating a clean and professional backdrop. Same hue as primary, but highly desaturated.
- Accent color: Lavender (#E6E6FA) is used for interactive elements and highlights, such as buttons and selected options.
- Font pairing: 'Playfair' (serif) for headlines and 'PT Sans' (sans-serif) for body text to combine elegance with readability.
- Use a consistent set of modern, minimalist icons from a library like Phosphor Icons, focusing on clarity and ease of recognition.
- Employ a clean, card-based layout with clear visual hierarchy, leveraging ShadCN UI components for consistency.
- Incorporate subtle transitions and animations for UI elements (e.g., dialogs, notifications) to enhance user experience.