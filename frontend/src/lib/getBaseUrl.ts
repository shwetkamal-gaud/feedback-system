const getBaseUrl = () => {
    if (typeof window === "undefined") return process.env.NEXT_PUBLIC_API_URL || "https://matchkin-kazv.onrender.com";

    return process.env.NODE_ENV === "development"
        ? "http://localhost:8000"
        : "https://matchkin-kazv.onrender.com";
};

export default getBaseUrl;
  