import api from "./interceptors/axiosConfig"

export const adminLogin = async (data) => {
    const response = await api.post("/api/v1/auth/login", data)
    return response
}