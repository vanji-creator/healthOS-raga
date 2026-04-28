import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import type { AuthUser } from '../types';

const DEMO_EMAIL = 'test@demo.com';
const DEMO_PASSWORD = 'demo1234';

const googleProvider = new GoogleAuthProvider();

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMock: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  setInitialized: () => void;
  clearError: () => void;
}

const mapFirebaseError = (code: string): string => {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by the browser. Please allow pop-ups and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return 'Authentication failed. Please try again.';
  }
};

const fbUserToAuthUser = (fb: { uid: string; email: string | null; displayName: string | null }, fallbackEmail = ''): AuthUser => ({
  uid: fb.uid,
  email: fb.email ?? fallbackEmail,
  displayName: fb.displayName ?? (fb.email ?? fallbackEmail).split('@')[0],
  role: 'admin',
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      initialized: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          if (isFirebaseConfigured && auth) {
            const result = await signInWithEmailAndPassword(auth, email, password);
            set({ user: fbUserToAuthUser(result.user, email), isLoading: false });
          } else {
            if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
              await new Promise((r) => setTimeout(r, 800));
              set({ user: { uid: 'mock-uid-001', email, displayName: 'Dr. Admin', role: 'admin' }, isLoading: false });
            } else {
              await new Promise((r) => setTimeout(r, 600));
              throw { code: 'auth/invalid-credential' };
            }
          }
        } catch (err: unknown) {
          const code = (err as { code?: string }).code ?? '';
          set({ error: mapFirebaseError(code), isLoading: false });
        }
      },

      signUp: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          if (isFirebaseConfigured && auth) {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, { displayName: name });
            set({
              user: { uid: result.user.uid, email: result.user.email ?? email, displayName: name, role: 'admin' },
              isLoading: false,
            });
          } else {
            await new Promise((r) => setTimeout(r, 800));
            set({ user: { uid: 'mock-uid-002', email, displayName: name, role: 'admin' }, isLoading: false });
          }
        } catch (err: unknown) {
          const code = (err as { code?: string }).code ?? '';
          set({ error: mapFirebaseError(code), isLoading: false });
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          if (isFirebaseConfigured && auth) {
            const result = await signInWithPopup(auth, googleProvider);
            set({ user: fbUserToAuthUser(result.user), isLoading: false });
          } else {
            await new Promise((r) => setTimeout(r, 800));
            set({
              user: { uid: 'mock-google-001', email: 'demo@gmail.com', displayName: 'Demo User', role: 'admin' },
              isLoading: false,
            });
          }
        } catch (err: unknown) {
          const code = (err as { code?: string }).code ?? '';
          set({ error: mapFirebaseError(code), isLoading: false });
        }
      },

      loginWithMock: async () => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 600));
        set({ user: { uid: 'mock-uid-001', email: DEMO_EMAIL, displayName: 'Dr. Admin', role: 'admin' }, isLoading: false });
      },

      logout: async () => {
        if (isFirebaseConfigured && auth) {
          await signOut(auth);
        }
        set({ user: null });
      },

      setUser: (user) => set({ user }),
      setInitialized: () => set({ initialized: true }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

if (isFirebaseConfigured && auth) {
  onAuthStateChanged(auth, (fbUser) => {
    const store = useAuthStore.getState();
    if (fbUser) {
      store.setUser(fbUserToAuthUser(fbUser));
    } else {
      store.setUser(null);
    }
    store.setInitialized();
  });
}
