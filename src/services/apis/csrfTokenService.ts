import axios from 'axios';

const BASE_URL = 'http://course-management.lndo.site';

export const getCsrfToken = async (): Promise<string> => {
  const response = await axios.get(`${BASE_URL}/session/token`);
  return response.data;
};

export const getAuthenticatedCsrfToken = async (loginResponse: any): Promise<string> => {
  return loginResponse.csrf_token;
};