
export type UserRole =
  | "Citizen"
  | "Head of Department"
  | "Engineer"
  | "Fund Manager"
  | "Approving Manager"
  | "Contractor";

export type User = {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  // Adding more details for user management
  email?: string;
  phone?: string;
  department?: 'Water' | 'Roads' | 'Sanitation' | 'Electrical';
  zone?: 'North' | 'South' | 'East' | 'West';
  active?: boolean;
};

export type IssueStatus =
  | "Submitted"
  | "PendingVerificationAndEstimation"
  | "Verified"
  | "Estimated"
  | "PendingApproval"
  | "Approved"
  | "Rejected"
  | "AssignedToContractor"
  | "InProgress"
  | "Resolved"
  | "PendingFinalVerification"
  | "Closed"
  | "Escalated";

export type IssueType = "Pothole" | "Streetlight" | "Garbage" | "Water Leakage" | "Obstruction" | "Broken Sidewalk" | "Fallen Tree" | "Illegal Dumping" | "Stray Animal" | "Damaged Public Property" | "Traffic Signal Malfunction" | "Parking Violation";

export type StatusUpdate = {
  status: IssueStatus;
  date: string;
  updatedBy: string; // User's name
  notes?: string;
};

export type VerificationReport = {
  comments: string;
  verificationPhotoUrl?: string;
  submittedAt: string;
};

export type EstimationReport = {
  estimatedCost: number;
  notes: string;
  submittedAt: string;
};

export type ContractorReport = {
  beforeImageUrl?: string;
  afterImageUrl?: string;
  notes: string;
  submittedAt: string;
};

export type Issue = {
  id: string;
  title: string;
  type: IssueType;
  location: string;
  description:string;
  imageUrl?: string;
  reportedBy: string; // User ID
  reportedAt: string;
  status: IssueStatus;
  statusHistory: StatusUpdate[];
  currentRoles: UserRole[]; // Who needs to act on it now
  assignedEngineerId?: string;
  assignedFundManagerId?: string;
  assignedContractorId?: string;
  verificationReport?: VerificationReport;
  estimationReport?: EstimationReport;
  contractorReport?: ContractorReport;
  upvotes: number;
  upvotedBy: string[];
  slaDays?: number;
  slaDeadline?: string;
  escalated?: boolean;
};

export type AnnouncementPriority = "Low" | "Medium" | "High";

export type Announcement = {
  id: string;
  title: string;
  message: string;
  priority: AnnouncementPriority;
  createdAt: string;
};

export type NotificationType = "new_assignment" | "sla_alert" | "escalation" | "status_update";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  issueId: string;
  timestamp: string;
  read: boolean;
  userId: string; // The user this notification is for
  imageUrl?: string; // Optional: for notifications with images
};
