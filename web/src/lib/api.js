const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function api(path, { method = "GET", body } = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        method,
        credentials: "include",
        headers: body ? { "Content-Type:": "application/json" } : undefined,
        body: body ? JSON.stringify.body : undefined
    });

    let data = null;

    try {
        data = await res.json()
    } catch {

    }

    if (!res.ok) {
        const error = new Error(data?.message || "something went wrong");
        error.status = res.status;
        error.fieldErrors = data?.errors || [];
        throw error;

    }
    return data;
}