const AUTH_KEY = "toms-samling-auth";

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export async function login(
  username: string,
  password: string,
): Promise<boolean> {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      sessionStorage.setItem(AUTH_KEY, "true");
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_KEY);
}
