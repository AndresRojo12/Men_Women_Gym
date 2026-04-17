import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerExerciseConfig = {
  storage: diskStorage({
    destination: './uploads/exercises',

    filename: (req, file, callback) => {
      const uniqueSuffix =
        Date.now() + '-' + Math.round(Math.random() * 1e9);

      const ext = extname(file.originalname);

      const filename = `file-${uniqueSuffix}${ext}`;

      callback(null, filename);
    },
  }),

  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed'), false);
    }

    callback(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};