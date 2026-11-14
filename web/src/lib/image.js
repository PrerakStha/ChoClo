export function imageUrl(url, width=600){
    if(!url){
        return null; 
    }

    const marker = "/upload";
    if(!url.includes("res.cloudinary.com") || !url.includes(marker)) return url;

    return url.replace(marker,`${marker}w_${width},c_limit,f_auto,q_auto/`);


}