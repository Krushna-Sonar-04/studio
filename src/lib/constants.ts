import { UserRole } from './types';

export const APP_NAME = "CivitasConnect";

export const ROLES: UserRole[] = [
  "Citizen",
  "Head of Department",
  "Engineer",
  "Fund Manager",
  "Approving Manager",
  "Contractor",
];

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  "Citizen": "/citizen/dashboard",
  "Head of Department": "/admin/dashboard",
  "Engineer": "/engineer/dashboard",
  "Fund Manager": "/fund-manager/dashboard",
  "Approving Manager": "/approving-manager/dashboard",
  "Contractor": "/contractor/dashboard",
};
