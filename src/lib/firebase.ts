import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfigJson from "../../firebase-applet-config.json";
import { UserProfile } from "../types";

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db =
  firebaseConfigJson.firestoreDatabaseId &&
  firebaseConfigJson.firestoreDatabaseId !== "(default)"
    ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
    : getFirestore(app);

export const auth = getAuth(app);

// Save or Update User Profile in Firebase Firestore
export async function saveUserProfileToFirestore(user: UserProfile): Promise<void> {
  if (!user.email) return;
  try {
    // Sanitize document ID by replacing special characters
    const docId = user.email.toLowerCase().trim().replace(/[^a-z0-9]/g, "_");
    const userRef = doc(db, "users", docId);

    await setDoc(
      userRef,
      {
        ...user,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Firestore save profile offline/unavailable, using local cache:", err);
  }
}

// Get User Profile from Firebase Firestore
export async function getUserProfileFromFirestore(email: string): Promise<UserProfile | null> {
  if (!email) return null;
  try {
    const docId = email.toLowerCase().trim().replace(/[^a-z0-9]/g, "_");
    const userRef = doc(db, "users", docId);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.warn("Firestore fetch profile offline/unavailable:", err);
  }
  return null;
}

// Save Chat Message to Firebase Firestore
export async function saveChatMessageToFirestore(
  email: string,
  role: "user" | "model" | "assistant",
  content: string
): Promise<void> {
  if (!email) return;
  try {
    const chatRef = collection(db, "chat_messages");
    await addDoc(chatRef, {
      userId: email.toLowerCase().trim(),
      role,
      content,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Firestore save message offline/unavailable:", err);
  }
}

// Get Recent Chat History from Firebase Firestore
export async function getChatHistoryFromFirestore(
  email: string
): Promise<Array<{ role: "user" | "model" | "assistant"; content: string }>> {
  if (!email) return [];
  try {
    const chatRef = collection(db, "chat_messages");
    const q = query(
      chatRef,
      where("userId", "==", email.toLowerCase().trim()),
      orderBy("createdAt", "asc")
    );
    const snap = await getDocs(q);
    const messages: Array<{ role: "user" | "model" | "assistant"; content: string }> = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      messages.push({
        role: data.role,
        content: data.content,
      });
    });
    return messages;
  } catch (err) {
    console.warn("Firestore fetch chat history offline/unavailable:", err);
    return [];
  }
}
