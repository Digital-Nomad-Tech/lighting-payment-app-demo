import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();
    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>支付成功！</Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                    返回主页
                </Button>
            </Box>
        </Container>
    );
};

export default Success;
