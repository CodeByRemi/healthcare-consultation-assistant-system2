import { functions } from "./firebase";
import { httpsCallable } from "firebase/functions";

export const sendVerificationEmail = async (to: string, userName: string) => {
  try {
    const sendVerif = httpsCallable(functions, 'sendVerificationEmail');
    const result = await sendVerif({ to, userName });
    return (result.data as any)?.success === true;
  } catch (err) {
    console.error("Error sending SendGrid email via Cloud Function:", err);
    return false;
  }
};
