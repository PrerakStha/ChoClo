const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function api(path, { method = "GET", body } = {}) {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include",
      // for files, the browser must set Content-Type itself (it adds the multipart boundary)
      headers: body && !isForm ? { "Content-Type": "application/json" } : undefined,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    const error = new Error("Cannot reach the server. Please try again.");
    error.fieldErrors = [];
    throw error;
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // response had no JSON body
  }

  if (!res.ok) {
    const error = new Error(data?.message || "Something went wrong");
    error.status = res.status;
    error.fieldErrors = data?.errors || [];
    throw error;
  }

  return data;
}