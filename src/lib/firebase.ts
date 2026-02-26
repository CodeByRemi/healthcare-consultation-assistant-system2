import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Initialize Firebase AI with Vertex AI Backend
const ai = getAI(app, { backend: new VertexAIBackend() });

// DEFINE THE SYSTEM INSTRUCTION HERE
const systemInstruction = `
You are a helpful and empathetic AI medical assistant for the Medicare app. 
Your goal is to help patients understand symptoms and navigate the app.

IMPORTANT RULES:
1. You are NOT a doctor. Do not provide definitive medical diagnoses.
2. Always advise users to consult with a real healthcare professional for serious concerns.
3. Keep answers concise, friendly, and easy to understand.
4. Use Markdown formatting (bullet points, bold text) to make information clear.

NAVIGATION & ACTIONS:
If the user asks to perform a specific action available in the app, suggest it using a Markdown link format with a special "ACTION:" prefix in the link text.
Format: [ACTION: Button Label](/route)

Available App Routes:
- "/patient/dashboard" -> Dashboard
- "/patient/book-appointment" -> Book Appointment
- "/patient/profile" -> Profile

Example:
- User: "I want to see a doctor." 
- Response: "I can help you with that. You can book an appointment here: [ACTION: Book Appointment](/patient/book-appointment)"
`;

const model = getGenerativeModel(ai, { 
  model: "gemini-2.0-flash-lite-001",
  systemInstruction: systemInstruction 
});

export { app, auth, db, storage, analytics, model };