import React, { useState } from 'react';
import { Typography, Box, Alert } from '@mui/material';
import { Form, Input, Button, Spin } from 'antd';
import { Mail, Lock, User, DollarSign } from 'lucide-react';
import useSignup from 'hooks/useSignup';
import { Link } from 'react-router-dom'; 


const Register = () => {
    const { loading, error, registerUser } = useSignup();
    const [isOpen, setIsOpen] = useState(false);
    
    const handleRegister = (values) => {
        registerUser(values);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', p: 4 }}>
            {/* Logo at the very top center */}
            <Box sx={{ width: '100%', maxWidth: 400 }}>
                <Box sx={{ bgcolor: '#2aae51', borderRadius: 5, boxShadow: 10, overflow: 'hidden', transition: 'all 0.5s ease-in-out', fontFamily: 'Poppins, sans-serif' }}> {/* Bright green form */}
                    <Box 
                        sx={{ height: 128, position: 'relative', cursor: 'pointer', transition: 'all 0.5s ease-in-out' }}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#2E8B57' }}>
                            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 96, height: 96, bgcolor: '#99ffcc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 4, borderColor: '#32CD32' }}>
                                <DollarSign style={{ color: '#2c6e49', fontSize: 48 }} />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ bgcolor: '#82d79b', p: 3, transition: 'all 0.5s ease-in-out', maxHeight: isOpen ? 500 : 0, opacity: isOpen ? 1 : 0, overflow: 'hidden', fontFamily: 'Roboto, sans-serif' }}> {/* Form inner color */}
                    <Box 
                        sx={{
                            position: 'relative',
                            p: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'Roboto, sans-serif',
                            textAlign: 'center',
                            bgcolor: '#82d79b'
                        }}
                    >
                        <Typography     
                            variant="h3" 
                            component="h2" 
                            textAlign="center" 
                            color="#006400" // Darker green
                            fontWeight="bold" // Make it bold
                            gutterBottom>
                            Finance at Your Fingertips
                        </Typography>
                    </Box>

                        {error && <Typography color="error">{error}</Typography>} {/* Display error if any */}

                        <Form layout='vertical' onFinish={handleRegister} autoComplete="off">
                            <Form.Item label="Name" name="fullName" rules={[
                                {
                                required: true,
                                message: "This is a required field"
                                },
                            ]}
                            >
                                <Input size='medium' placeholder="John Doe" prefix={<User style={{ marginRight: 8, fontSize:15}} />} autoComplete="name"/>

                            </Form.Item>
                            <Form.Item label="Email" name="email" rules={[
                                {
                                required: true,
                                message: "This is a required field"
                                },
                                {
                                    type: 'email',
                                    message: 'Invalid Email',
                                },
                            ]}
                            >
                                <Input size="medium" placeholder="johndoe@gmail.com" prefix={<Mail style={{ marginRight: 8, fontSize:15 }} />}/>

                            </Form.Item>
                            <Form.Item label="Password" name="password" rules={[
                                {
                                required: true,
                                message: "This is a required field"
                                },
                            ]}
                            >
                                <Input.Password size='medium' placeholder="Enter your password" prefix={<Lock style={{ marginRight: 8, fontSize:15 }} />}/>

                            </Form.Item>
                            
                            {error &&(
                                <Alert
                                description={error}
                                typr="error"
                                showIcon
                                closable
                                className='alert'
                                />
                            )}
                            
                            <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button type={`${loading ? '' : 'primary'}`} 
                                htmlType='submit' 
                                size='large' 
                                className='btn'
                                style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', color: '#fff' }}
                                >
                                    {loading ? <Spin/>:'Register'}
                                </Button>
                            </Form.Item>
                        </Form>

                        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: '#006400', textDecoration: 'underline' }}>
                                Login
                            </Link>
                        </Typography>
                    </Box>

                    <Box sx={{ height: 32, bgcolor: '#2E8B57', position: 'relative' }}>
                        <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 64, height: 32, bgcolor: '#006400', borderTopLeftRadius: '50%', borderTopRightRadius: '50%' }}></Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Register;
