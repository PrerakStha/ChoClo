export function imageUrl(url, width = 300) {
  if (!url) return "";

  // If it's a Cloudinary URL, safely inject transformation options right after /upload/
  if (url.includes("/upload/")) {
    const [base, path] = url.split("/upload/");
    // Clean up any leading slashes from the path if they exist
    const cleanPath = path.replace(/^\/+/, "");
    return `${base}/upload/w_${width},c_limit,f_auto,q_auto/${cleanPath}`;
  }

  return url;
}