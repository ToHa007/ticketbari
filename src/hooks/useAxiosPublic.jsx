import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://ticketbari-server123.vercel.app",
});


axiosPublic.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;