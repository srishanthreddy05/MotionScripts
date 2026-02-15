import { ref, push, set } from "firebase/database";
import { database } from "./firebase";
import type { EventType } from "./types";

/**
 * Save an event to Firebase Realtime Database
 * @param type - Event type (visit, script_paste, like, dislike, feedback_submit, email_submit)
 * @param metadata - Optional additional data
 */
export async function saveEvent(type: EventType, metadata?: object): Promise<void> {
  try {
    const eventsRef = ref(database, "validation/events");
    const newEventRef = push(eventsRef);
    
    await set(newEventRef, {
      type,
      timestamp: Date.now(),
      ...(metadata && { metadata }),
    });
  } catch (error) {
    console.error("Error saving event:", error);
  }
}

/**
 * Save feedback to Firebase Realtime Database
 * @param message - Feedback message
 */
export async function saveFeedback(message: string): Promise<void> {
  try {
    const feedbackRef = ref(database, "validation/feedback");
    const newFeedbackRef = push(feedbackRef);
    
    await set(newFeedbackRef, {
      message,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    throw error;
  }
}

/**
 * Save email to Firebase Realtime Database
 * @param email - User email
 */
export async function saveEmail(email: string): Promise<void> {
  try {
    const emailsRef = ref(database, "validation/emails");
    const newEmailRef = push(emailsRef);
    
    await set(newEmailRef, {
      email,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error saving email:", error);
    throw error;
  }
}
