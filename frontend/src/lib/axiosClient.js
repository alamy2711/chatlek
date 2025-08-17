import axios from "axios";

const axiosClient = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? `${import.meta.env.VITE_API_BASE_URL}/api`
            : `/api`,
    withCredentials: true,
});

export default axiosClient;
