import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Dialog, DialogContent } from '@mui/material';
import { QRCodeCanvas } from "qrcode.react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [invoice, setInvoice] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/invoices', {
                amount: parseInt(amount) * 1000,
                description: description
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            setInvoice(response.data.invoice);
            setOpen(true);
            // Start polling for payment status
            pollStatus(response.data.paymentHash);
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    };

    const pollStatus = (paymentHash) => {
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(`/api/transactions/${paymentHash}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`
                    }
                });
                if (res.data.state === 'settled') {
                    clearInterval(interval);
                    setOpen(false);
                    navigate('/success');
                } else if (res.data.state === 'failed') {
                    clearInterval(interval);
                    setOpen(false);
                    alert('支付失败');
                }
            } catch (error) {
                console.error('Error fetching transaction status:', error);
            }
        }, 3000);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>收款</Typography>
                <TextField
                    label="金额"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <TextField
                    label="备注"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                    提交
                </Button>
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>请扫描二维码支付</Typography>
                    {invoice && <QRCodeCanvas value={invoice} size={256} />}
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default Home;
