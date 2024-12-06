import axios from 'axios';

interface Teacher {
  id: string;
  email: string;
}

interface RegisteredClass {
  classCode: string;
  teacherId: string;
  courseId: string;
  schedule: number[];
  startTime: string;
  endTime: string;
  room: string;
  currentStudents: number;
  maxStudents: number;
  startDate: string;
  endDate: string;
  teacher: Teacher;
}

interface UserRegistrations {
  id: string;
  email: string;
  registeredClasses: RegisteredClass[];
}

const API_URL = 'http://localhost:3000/api/class-registrations';

export const registerClass = async (userId: string, classCode: string) => {
  try {    
    const response = await axios.post(`${API_URL}/register`, {
      userId,
      classCode,
    }, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error registering class:', error);
    throw error;
  }
};

export const fetchMyRegistrations = async (): Promise<UserRegistrations> => {
  try {
    console.log(sessionStorage.getItem('token'))
    const response = await axios.get(`${API_URL}/my-registrations`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching registrations:', error);
    throw error;
  }
};