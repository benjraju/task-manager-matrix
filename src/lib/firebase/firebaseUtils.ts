import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  DocumentData,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { Task } from '@/lib/types/task';

// Test database connection
export const testDatabaseConnection = async () => {
  try {
    const testDoc = await addDoc(collection(db, 'test_connection'), {
      timestamp: serverTimestamp(),
      message: 'Test connection successful'
    });
    console.log('Database connection successful, test document ID:', testDoc.id);
    await deleteDoc(doc(db, 'test_connection', testDoc.id));
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Authentication functions
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Task management functions
export const addTask = async (taskData: Omit<Task, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      userId: auth.currentUser?.uid,
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

export const updateTask = async (taskId: string, taskData: Partial<Task>) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, taskData);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getUserTasks = async (userId: string) => {
  try {
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(tasksQuery);
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tasks.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        startedAt: data.startedAt?.toDate(),
        completedAt: data.completedAt?.toDate(),
      } as Task);
    });
    return { tasks, error: null };
  } catch (error: any) {
    return { tasks: [], error: error.message };
  }
};
