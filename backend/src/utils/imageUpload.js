const fs = require("fs");
const path = require("path");

async function saveImage(
    image,
    folder = "general"
) {

    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB

    const buffer = Buffer.from(image, "base64");

    if (buffer.length > MAX_FILE_SIZE) {
        const error = new Error("Image exceeds 3 MB limit");
        error.statusCode = 413;
        throw error;
    }
    if (!image) return null;

    const matches = image.match(
        /^data:(image\/(jpeg|jpg|png|webp));base64,(.+)$/
    );

    if (!matches) {
        throw new Error("Invalid image format");
    }

    const mimeType = matches[1];
    const extension = matches[2] === "jpeg"
        ? "jpg"
        : matches[2];

    const imageData = matches[3];

    const fileName =
        `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${extension}`;

    const uploadDir = path.join(
        process.cwd(),
        "src/uploads",
        folder
    );

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, {
            recursive: true,
        });
    }

    const filePath = path.join(
        uploadDir,
        fileName
    );

    try {
        fs.writeFileSync(
            filePath,
            Buffer.from(imageData, "base64")
        );
    } catch (err) {
        console.log(err);
    }

    return {
        fileName,
        path: `src/uploads/${folder}/${fileName}`,
        mimeType,
    };
}

module.exports = {
    saveImage,
};