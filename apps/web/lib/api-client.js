import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // sends/receives the httpOnly auth cookie — replaces the old Authorization header + localStorage token entirely
});

// A 401 here means the session cookie is missing/expired server-side.
// There's nothing to "clear" client-side anymore (no token in localStorage
// to remove) — just redirect to login and let the browser drop the
// already-invalid cookie on its own.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const onLoginPage = window.location.pathname === "/admin/login";
      if (!onLoginPage) window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;
