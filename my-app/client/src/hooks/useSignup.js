import { useAuth } from "contexts/AuthContext";
import { useState } from "react";
import { message } from 'antd';

const useSignup = () => {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const registerUser = async (values) => {
        try {
            setError(null);
            setLoading(true);

            const res = await fetch("http://localhost:9000/api/auth/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (res.status === 201) {
                message.success(data.message);
                login(data.token, data.user); // Pass user data as needed
            } else if (res.status === 400) {
                setError(data.message);
            } else {
                message.error('Registration failed.');
            }
        } catch (error) {
            message.error('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerUser };
};

export default useSignup;
