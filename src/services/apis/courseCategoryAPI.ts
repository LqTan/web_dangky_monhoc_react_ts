import axios from "axios";

const API_URL = "http://localhost:3000/api/course-categories";

export const fetchCourseCategories = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching course categories:", error);
        throw error;
    }
}