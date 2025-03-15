import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import "../styles/VerifyEmail.css";

const VerifyEmail = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await api.get(`/api/verify-email/${uidb64}/${token}/`);
                if (res.status === 200) {
                    toast.success(res.data.detail || "Email verified successfully!");
                    setTimeout(() => {
                        navigate("/login"); // Redirect to login page
                    }, 2000);
                }
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.detail || "Failed to verify email. Please try again.");
                setTimeout(() => {
                    navigate("/register"); // Redirect to register page only on error
                }, 2000);
            }
        };

        if (uidb64 && token) {
            verifyEmail();
        }
    }, [uidb64, token, navigate]);

    return (
        <div className="verify-email-container">
            <h2>Verifying your email...</h2>
        </div>
    );
};

export default VerifyEmail;