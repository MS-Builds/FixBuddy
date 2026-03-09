import multer from 'multer';

// Configure multer for memory storage since we will upload to Cloudinary directly from memory buffer
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

export default upload;
