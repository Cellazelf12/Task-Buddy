import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth } from "../../services/firebase/firebaseConfig";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGithubRegister = async () => {
        try {
            await signInWithPopup(auth, githubProvider);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Register</h1>
            {error && <div className="bg-red-500 text-white p-2 mb-4">{error}</div>}
            <form onSubmit={handleEmailRegister}>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 font-bold">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="border rounded-md p-2 w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2 font-bold">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="border rounded-md p-2 w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4">
                    Register with Email
                </button>
            </form>
            <div className="flex gap-4">
                <button
                    className="bg-neutral-700 text-white py-2 px-4 rounded-md"
                    onClick={handleGithubRegister}
                >
                    Register with Github
                </button>
                <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md"
                    onClick={handleGoogleRegister}
                >
                    Register with Google
                </button>
                
            </div>
        </div>
    );
}

export default RegisterForm;
