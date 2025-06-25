import { useAuth } from "contexts/AuthContext";
import { useState } from "react";
import { message } from 'antd';

const useLogin = () => {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const loginUser = async (values) => {
        try {
            setError(null);
            setLoading(true);

            const res = await fetch('http://localhost:9000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (res.status === 200) { // Updated status code
                message.success(data.message);
                login(data.token, data.user); // Pass user data if needed
            } else if (res.status === 400) {
                const errorMessage = data.message || 'Invalid credentials. Please try again.';
                setError(errorMessage);
            } else {
                message.error('Login failed.');
            }
        } catch (error) {
            message.error(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, loginUser };
};

export default useLogin;
