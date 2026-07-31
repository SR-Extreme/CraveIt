const getApiUrl = () => {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:4000";
  return String(raw).trim().replace(/\/+$/, "");
};

export default getApiUrl;
