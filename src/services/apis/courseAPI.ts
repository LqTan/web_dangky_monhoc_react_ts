import axios from 'axios';

const API_URL = 'http://course-management.lndo.site/api/courses';

export interface Course {
  title: string;
  field_course_code: string;
  field_course_description: string | boolean;
  field_course_thumbnail: string;
  field_course_tuition_fee: string;
  field_course_training_program: string;
  training_program_tid: string;
  training_program_vocabulary: string;
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
    const response = await axios.get<Course[]>(`${API_URL}/${courseCode}`);
    return response.data[0];
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};