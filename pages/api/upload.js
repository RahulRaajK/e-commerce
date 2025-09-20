import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public', 'uploads'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      filter: ({ mimetype }) => {
        return mimetype && mimetype.includes('image');
      },
    });

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const [fields, files] = await form.parse(req);
    
    if (!files.image || !files.image[0]) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const file = files.image[0];
    const fileName = `product_${Date.now()}_${file.originalFilename}`;
    const newPath = path.join(uploadDir, fileName);
    
    // Move file to final location
    fs.renameSync(file.filepath, newPath);
    
    // Return the public URL
    const imageUrl = `/uploads/${fileName}`;
    
    res.status(200).json({ 
      success: true, 
      imageUrl,
      fileName 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}
