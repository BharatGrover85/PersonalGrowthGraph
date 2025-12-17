    import {initializeApp} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
    import {
        getAuth,
        onAuthStateChanged,
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        setPersistence,
        browserLocalPersistence
    } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

    import {
        getFirestore,
        doc,
        setDoc,
        getDoc,
        onSnapshot
    } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

    const firebaseConfig = {
        apiKey: "AIzaSyAUX0h5k5gJ7XdlhdAoOi5r-cNZxr4mKfs",
    authDomain: "personal-growth-3bd92.firebaseapp.com",
    projectId: "personal-growth-3bd92",
};

    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);

    // 🔒 Persistent login

    export async function initAuthPersistence() {
        await setPersistence(auth, browserLocalPersistence);
    }

    // 🔁 Auth watcher
    // watchAuth removed (no longer used; breaks iframe UI)

    // 🌍 Multi‑browser / multi‑tab login sync
    export function multiBrowserLoginInit(onLogin, onLogout) {
        onAuthStateChanged(auth, user => {
            if (user) {
                onLogin(user);
            } else {
                if (onLogout) onLogout();
            }
        });
    }

    // 🔐 Login
    export async function login(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            alert(e.message);
            console.error(e);
        }
    }

    // 🆕 Signup
    export async function signup(email, password) {
        if (!email || !password) {
            alert("Email aur password required hai");
            return;
        }
        if (password.length < 6) {
            alert("Password kam se kam 6 characters ka hona chahiye");
            return;
        }
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            return res.user;
        } catch (e) {
            alert(e.message);
            console.error(e);
        }
    }

    // 📥 Fetch full data ONCE
    export async function fetchUserData(uid) {
  const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
}

    // 📤 Save full state (called on every interaction)
    export async function saveUserData(uid, payload) {
        await setDoc(doc(db, "users", uid), payload, { merge: true });
}

    // 🔴 Realtime sync (multi-browser)
    export function realtimeSync(uid, cb) {
  return onSnapshot(doc(db, "users", uid), snap => {
    if (snap.exists()) cb(snap.data());
  });
}
