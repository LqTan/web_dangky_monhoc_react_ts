import axios from "axios";

const API_URL = "http://course-management.lndo.site/api/training-programs";

export interface CategoryData {
    name: string;
    tid: string;
}

export const fetchCourseCategories = async () => {
    try {
        const response = await axios.get<CategoryData[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching course categories:", error);
        throw error;
    }
}