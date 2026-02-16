// const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// export const login = async (email: string, password: string) => {
//   if (!BASE_URL) {
//     throw new Error("Backend URL is missing. Check your .env file.");
//   }

//   try {
//     const res = await fetch(`${BASE_URL}/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Login failed");

//     return data;
//   } catch (err: any) {
//     throw new Error(err.message || "Network error");
//   }
// };



const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const login = async (
  email: string,
  password: string,
  org_code: string
) => {
  if (!BASE_URL) {
    throw new Error("Backend URL is missing. Check your .env file.");
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        org_code,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    return data;
  } catch (err: any) {
    throw new Error(err.message || "Network error");
  }
};
