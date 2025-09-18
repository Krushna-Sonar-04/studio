import {
  AlertTriangle,
  CheckCircle,
  Circle,
  CircleDot,
  HelpCircle,
  ShieldAlert,
  ShieldQuestion,
  XCircle,
  Play,
  Clock,
  ThumbsUp,
  CircleCheck,
} from "lucide-react"

export const issueTypes = [
  { value: "Pothole", label: "Pothole" },
  { value: "Streetlight", label: "Streetlight" },
  { value: "Garbage", label: "Garbage" },
  { value: "Water Leakage", label: "Water Leakage" },
]

export const issueStatuses = [
  { value: "Submitted", label: "Submitted", icon: ThumbsUp },
  { value: "PendingVerificationAndEstimation", label: "Pending Verification", icon: HelpCircle },
  { value: "Verified", label: "Verified", icon: CheckCircle },
  { value: "Estimated", label: "Estimated", icon: CircleCheck },
  { value: "PendingApproval", label: "Pending Approval", icon: ShieldQuestion },
  { value: "Approved", label: "Approved", icon: ThumbsUp },
  { value: "Rejected", label: "Rejected", icon: XCircle },
  { value: "AssignedToContractor", label: "Assigned", icon: CircleDot },
  { value: "InProgress", label: "In Progress", icon: Play },
  { value: "Resolved", label: "Resolved", icon: CircleCheck },
  { value: "PendingFinalVerification", label: "Pending Final Verification", icon: HelpCircle },
  { value: "Closed", label: "Closed", icon: CheckCircle },
  { value: "Escalated", label: "Escalated", icon: ShieldAlert },
]

export const escalationOptions = [
    { value: "yes", label: "Yes", icon: ShieldAlert },
    { value: "no", label: "No", icon: Circle },
]
