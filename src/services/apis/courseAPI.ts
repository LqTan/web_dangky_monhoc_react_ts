import axios from 'axios';

const API_URL = 'http://localhost:3000/api/courses';

export interface Course {
  courseCode: string;
  name: string;
  price: number;
  categoryId: string;
  description: string;
  imageUrl: string;
}

export const fetchCourses = async () => {
  try {
    const response = await axios.get<Course[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const fetchCourseByCode = async (courseCode: string) => {
  try {
    const response = await axios.get<Course>(`${API_URL}/${courseCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};