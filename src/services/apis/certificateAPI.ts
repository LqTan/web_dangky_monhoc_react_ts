import axios from 'axios';

const API_URL = 'http://course-management.lndo.site/api/certificates';

export interface Certificate {
  title: string;
  field_issue_date: string;
  field_certificate_file: string;
  field_rating_name: string;
  field_rating_id: string;
  field_user_fullname: string;
  field_user_id: string;
  field_certificate_file_1: string;
}

export const fetchCertificates = async (userId: string) => {
  try {
    const response = await axios.get<Certificate[]>(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};