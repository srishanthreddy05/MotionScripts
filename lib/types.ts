// Validation event types
export type EventType = 
  | "visit"
  | "script_paste"
  | "like"
  | "dislike"
  | "feedback_submit"
  | "email_submit";

// Database structure types
export interface ValidationEvent {
  type: EventType;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface Feedback {
  message: string;
  timestamp: number;
}

export interface Email {
  email: string;
  timestamp: number;
}
