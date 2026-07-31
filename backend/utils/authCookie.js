const TOKEN_COOKIE = "token";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: SEVEN_DAYS_MS,
  path: "/",
});

const setAuthCookie = (res, token) => {
  res.cookie(TOKEN_COOKIE, token, getAuthCookieOptions());
};

const clearAuthCookie = (res) => {
  res.clearCookie(TOKEN_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
};

export { TOKEN_COOKIE, setAuthCookie, clearAuthCookie, getAuthCookieOptions };
