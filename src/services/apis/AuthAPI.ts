import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

interface RegisterProfile {
  fullName: string;
  gender: string;
  occupation: string;
  workplace: string;
  phoneNumber: string;
  citizenId: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  role: string;
  profile: RegisterProfile;
}

export const register = async (data: RegisterRequest) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  token: string;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};