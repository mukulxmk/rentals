import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.MODE === "production"
    ? "https://wander-list-backend.vercel.app/api"
    : "http://localhost:8080/api",
  withCredentials: true,
  timeout: 30000,
});


API.interceptors.response.use(null, async (error) => {
  const { config, message } = error;
  if (!config || !config.retry) {
    config.retry = 0;
  }


  if (config.retry < 3 && (message === "Network Error" || error.code === "ECONNABORTED" || error.response?.status >= 500)) {
    config.retry += 1;
    console.log(`Retrying request... (${config.retry}/3)`);

    const backoff = new Promise(resolve => setTimeout(resolve, 1000 * config.retry));
    await backoff;

    return API(config);
  }

  return Promise.reject(error);
});

export default API;