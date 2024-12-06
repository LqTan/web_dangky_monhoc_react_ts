import axios from 'axios';

const API_URL = 'http://localhost:3000/api/user-profiles';

export interface UserProfile {
  id: string;
  fullName: string;
  dateOfBirth: string | null;
  gender: string;
  occupation: string;
  workplace: string;
  phoneNumber: string;
  citizenId: string;
  avatar: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const getUserProfile = async (userId: string) => {
  console.log(userId)
  try {
    const response = await axios.get<UserProfile>(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};