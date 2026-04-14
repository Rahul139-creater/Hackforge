import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                // Verify the token with backend
                await axios.get("http://localhost:3000/api/auth/verify", {
                    headers: {
                        "x-auth-token": token
                    }
                });
                setIsAuthenticated(true);
            } catch (err) {
                // Token is invalid or expired
                localStorage.removeItem("token");
                setIsAuthenticated(false);
            }
        };

        verifyToken();
    }, []);

    if (isAuthenticated === null) {
        // Still loading/verifying
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#0d1117]">
                <div className="w-8 h-8 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}
