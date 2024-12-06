import axios from 'axios';

const API_URL = 'http://localhost:3000/api/payments';

interface PaymentRequest {
  amount: number;
  tuitionIds: string[];
}

export const createVNPayPayment = async (data: PaymentRequest) => {
  try {
    console.log(data)
    const response = await axios.post(`${API_URL}/vnpay/create`, data, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};