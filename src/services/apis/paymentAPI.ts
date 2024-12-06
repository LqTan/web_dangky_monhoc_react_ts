import axios from 'axios';

const API_URL = 'http://localhost:3000/api/payments';

interface PaymentRequest {
    amount: number;
  }
  
  export const createPayPalPayment = async (data: PaymentRequest) => {
    try {
      // Gọi API tạo order PayPal
      const response = await axios.post(`${API_URL}/create-payment`, {
        amount: data.amount
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
  
      // Response sẽ chứa orderId và approvalUrl
      return response.data;
    } catch (error) {
      console.error('Error creating PayPal payment:', error);
      throw error;
    }
  };
  
  export const capturePayPalPayment = async (orderId: string) => {
    try {
      const response = await axios.post(`${API_URL}/capture-payment/${orderId}`, {}, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      throw error;
    }
  };