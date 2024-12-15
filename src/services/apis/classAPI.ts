import axios from "axios";

const API_URL = 'http://course-management.lndo.site/api/classes';

export interface Class {
    title: string;
    field_class_start_time: string;
    field_class_end_time: string;
    field_class_open_date: string;
    field_class_end_date: string;
    field_class_weekdays: string[];
    field_current_num_of_participant: boolean | number;
    field_max_num_of_participant: string;
    field_room: string;
    field_course_code: string;
    field_teacher_fullname: string;
    // field_class_code?: string;
}

export const fetchClasses = async () => {
    try {
        const response = await axios.get<Class[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
}

export const fetchClassByCode = async (classCode: string) => {
    try {
        const response = await axios.get<Class[]>(`${API_URL}/${classCode}`);
        return response.data[0];
    } catch (error) {
        console.error('Error fetching class:', error);
        throw error;
    }
}
