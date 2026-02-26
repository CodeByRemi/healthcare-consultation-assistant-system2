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
3. If a user asks about booking an appointment, guide them to the "Book Appointment" section of the dashboard.
4. Keep answers concise, friendly, and easy to understand.
5. Use Markdown formatting (bullet points, bold text) to make information clear.
`;

const model = getGenerativeModel(ai, { 
  model: "gemini-2.0-flash-lite-001",
  systemInstruction: systemInstruction 
});

export { app, auth, db, storage, analytics, model };