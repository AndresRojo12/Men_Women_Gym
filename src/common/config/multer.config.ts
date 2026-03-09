import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/categories',

    filename: (req, file, callback) => {

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      const ext = extname(file.originalname);

      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;

      callback(null, filename);
    },
  }),

  fileFilter: (req, file, callback) => {

    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return callback(new Error('Only image files are allowed'), false);
    }

    callback(null, true);
  },

  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
};