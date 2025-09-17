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
};

export type IssueStatus =
  | "Submitted"
  | "AssignedForVerification"
  | "Verified"
  | "PendingApproval"
  | "Approved"
  | "Rejected"
  | "AssignedToContractor"
  | "InProgress"
  | "Resolved"
  | "Closed";

export type IssueType = "Pothole" | "Streetlight" | "Garbage" | "Water Leakage";

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
  description: string;
  imageUrl?: string;
  reportedBy: string; // User ID
  reportedAt: string;
  status: IssueStatus;
  statusHistory: StatusUpdate[];
  assignedEngineerId?: string;
  assignedFundManagerId?: string;
  assignedContractorId?: string;
  verificationReport?: VerificationReport;
  estimationReport?: EstimationReport;
  contractorReport?: ContractorReport;
};
