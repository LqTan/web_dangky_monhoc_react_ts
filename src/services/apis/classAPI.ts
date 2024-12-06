import axios from "axios";

const API_URL = 'http://localhost:3000/api/classes';

export interface Class {
    classCode: string;
    teacherId: string;
    courseId: string;
    schedule: number[];
    startTime: string;
    endTime: string;
    room: string;
    currentStudents: number;
    maxStudents: number;
    startDate: Date;
    endDate: Date;
    teacher?: {
        id: string;
        email: string;
        UserProfile?: {
            id: string;
            fullName: string;
        }
    };
    Course?: {
        courseCode: string;
        name: string;
    }
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
        const response = await axios.get<Class>(`${API_URL}/${classCode}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching class:', error);
        throw error;
    }
}
