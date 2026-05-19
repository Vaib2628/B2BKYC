const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");
const formData = new FormData();
formData.append("apikey", process.env.OCR_SPACE_API_KEY);
formData.append("language", "eng");
formData.append("isOverlayRequired", "true");
formData.append("scale", "true");
formData.append("OCREngine", "2");

module.exports = async (file) => {
    formData.append("file", fs.createReadStream(file.path));
    
    return axios.post("https://api.ocr.space/parse/image", formData, {
        headers: formData.getHeaders()
    }).then(res => res.data);
}

