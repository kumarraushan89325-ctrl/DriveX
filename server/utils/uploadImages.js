const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const uploadImageFile = async (file) => {
  if (isCloudinaryConfigured()) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'drivenow/cars',
      resource_type: 'image',
    });
    fs.unlink(file.path, () => {});
    return result.secure_url;
  }
  return `/uploads/${file.filename}`;
};

const uploadImageFiles = async (files = []) => {
  const urls = [];
  for (const file of files) {
    urls.push(await uploadImageFile(file));
  }
  return urls;
};

module.exports = { uploadImageFile, uploadImageFiles };
