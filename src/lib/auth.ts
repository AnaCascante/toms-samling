const AUTH_KEY = "toms-samling-auth";
const CREDENTIALS = {
  username: "Tomklatrer",
  password: "T'estimo2016",
};

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function login(username: string, password: string): boolean {
  if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}
