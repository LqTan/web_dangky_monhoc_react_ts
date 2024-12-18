import axios from 'axios';

const API_URL = 'http://course-management.lndo.site/api/scores';

export interface ScoreInfo {
  title: string;
  field_average: string;
  field_final: string;
  field_midterm: string;
  field_course_code: string;
  field_state: string;
  field_user_fullname: string;
  uid: string;
}

export const fetchScores = async () => {
  try {
    const response = await axios.get<ScoreInfo[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error;
  }
};