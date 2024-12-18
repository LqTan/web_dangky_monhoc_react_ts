import axios from 'axios';

const API_URL = 'http://course-management.lndo.site/api/user-exams';

export interface ExamInfo {
  title: string;
  field_date_exam: string;
  field_end_exam: string;
  field_start_exam: string;
  field_exam_location: string;
  field_class_code: string;
  field_course_code: string;
}

export const fetchExams = async () => {
  try {
    const response = await axios.get<ExamInfo[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching exams:', error);
    throw error;
  }
};