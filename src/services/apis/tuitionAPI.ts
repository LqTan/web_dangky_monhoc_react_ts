import axios from 'axios';

const API_URL = 'http://localhost:3000/api/tuitions';

export interface TuitionFee {
  id: string;
  classCode: string;
  studentId: string;
  amount: string;
  dueDate: string;
  status: string;
  paymentDate: string | null;
  createdAt: string;
  updatedAt: string;
  class: {
    classCode: string;
    startTime: string;
    endTime: string;
    room: string;
    Course: {
      courseCode: string;
      name: string;
    }
  }
}

export const getUnpaidTuitions = async (): Promise<TuitionFee[]> => {
  try {
    const response = await axios.get(`${API_URL}/unpaid`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching unpaid tuitions:', error);
    throw error;
  }
};