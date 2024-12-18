import axios from 'axios';

const API_URL = 'http://course-management.lndo.site/api/semesters';

export interface Semester {
  tid: string;
  name: string;
}

export const fetchSemesters = async () => {
  try {
    const response = await axios.get<Semester[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching semesters:', error);
    throw error;
  }
};