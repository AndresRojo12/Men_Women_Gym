# Men & Women Gym

A comprehensive gym management application designed for both men and women, featuring workout routines, exercise tracking, categories, and user authentication. Built with a NestJS backend and React Native frontend.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Exercise Management**: Create, update, and manage exercises with categories
- **Workout Routines**: Build and customize workout routines with exercises
- **Category Organization**: Organize exercises by categories (e.g., strength, cardio, flexibility)
- **Image Uploads**: Upload and manage images for exercises and categories
- **Role-based Access**: Different user roles with appropriate permissions
- **Cross-platform Mobile App**: Available on iOS and Android via React Native

## Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: Class Validator and Class Transformer
- **File Upload**: Multer
- **Testing**: Jest

### Frontend
- **Framework**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **UI Components**: GluStack UI
- **State Management**: Zustand
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **Validation**: Zod

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Expo CLI (for mobile development)

## Installation

### Backend Setup

1. Navigate to the root directory:
   ```bash
   cd /home/andres/Documentos/Men_Women_Gym
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=men_women_gym
   JWT_SECRET=your_jwt_secret
   ```

4. Run database migrations:
   ```bash
   npm run migration:run
   ```

5. Start the development server:
   ```bash
   npm run start:dev
   ```

The backend will be running on `http://localhost:3000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   - For Android: `npm run android`
   - For iOS: `npm run ios`
   - For Web: `npm run web`

## Usage

1. Start the backend server as described above.
2. Start the frontend app using Expo.
3. Register a new user or log in with existing credentials.
4. Explore categories, create exercises, and build workout routines.

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create a new category
- `PUT /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category

### Exercises
- `GET /exercises` - Get all exercises
- `POST /exercises` - Create a new exercise
- `PUT /exercises/:id` - Update an exercise
- `DELETE /exercises/:id` - Delete an exercise

### Routines
- `GET /routines` - Get all routines
- `POST /routines` - Create a new routine
- `PUT /routines/:id` - Update a routine
- `DELETE /routines/:id` - Delete a routine

### Users
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Project Structure

```
Men_Women_Gym/
├── src/                          # Backend source code
│   ├── auth/                     # Authentication module
│   ├── categories/               # Categories module
│   ├── exercises/                # Exercises module
│   ├── routines/                 # Routines module
│   ├── users/                    # Users module
│   ├── database/                 # Database configuration
│   └── common/                   # Shared utilities
├── frontend/                     # React Native app
│   ├── features/                 # Feature-based modules
│   ├── components/               # Reusable components
│   ├── config/                   # Configuration files
│   └── assets/                   # Static assets
├── test/                         # End-to-end tests
├── uploads/                      # File uploads directory
└── README.md                     # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Testing

### Backend
```bash
npm run test
npm run test:cov  # With coverage
npm run test:e2e  # End-to-end tests
```

### Frontend
```bash
cd frontend
npm test
```

## License

This project is licensed under the UNLICENSED License - see the package.json file for details.

## Notes

- The `pruebas` branch is used for code testing and recommendations.
- Ensure your PostgreSQL database is running before starting the backend.
- For mobile development, make sure you have Android Studio or Xcode set up appropriately.
