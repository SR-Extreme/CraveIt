import cloudinary from "../config/cloudinary.js";

/**
 * Upload a multer memory file buffer to Cloudinary.
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export const uploadImageBuffer = (file, folder = "craveit") => {
    return new Promise((resolve, reject) => {
        if (!file?.buffer) {
            return reject(new Error("No image file provided"));
        }

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        stream.end(file.buffer);
    });
};

/**
 * Extract Cloudinary public_id from a secure_url (or return as-is if already an id).
 */
export const getPublicIdFromUrl = (imageValue) => {
    if (!imageValue || typeof imageValue !== "string") return null;

    if (!imageValue.includes("cloudinary.com") && !imageValue.includes("/upload/")) {
        // Legacy local filename — nothing to destroy on Cloudinary
        return null;
    }

    const afterUpload = imageValue.split("/upload/")[1];
    if (!afterUpload) return null;

    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    return withoutVersion.replace(/\.[^/.]+$/, "");
};

export const deleteImageByUrl = async (imageValue) => {
    const publicId = getPublicIdFromUrl(imageValue);
    if (!publicId) return;

    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log("Cloudinary delete failed:", error.message);
    }
};
