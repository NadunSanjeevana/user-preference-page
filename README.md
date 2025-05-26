# User Preference Management System

A full-stack web application for managing user preferences, built with Django and React.

## Project Structure

```
.
├── backend/           # Django backend
│   ├── preferences/   # Preferences app
│   ├── user_preferences/  # Main Django project
│   └── requirements.txt
└── frontend/         # React frontend
    ├── src/          # Source code
    └── package.json
```

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

The backend server will run at `http://localhost:8000`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

The frontend development server will run at `http://localhost:3000`

## Development

### Backend Development

- The backend is built with Django and follows Django's project structure
- API endpoints are RESTful and documented in the code
- Database migrations should be created for any model changes:
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```

### Frontend Development

- The frontend is built with React and uses modern JavaScript/TypeScript
- Code quality is maintained using ESLint and Prettier
- Testing is done with Jest
- Webpack is used for bundling

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
# or
yarn test
```

## Building for Production

### Backend
The Django backend is ready for production deployment. Make sure to:
- Set DEBUG=False in settings
- Configure proper database settings
- Set up proper security measures

### Frontend
```bash
cd frontend
npm run build
# or
yarn build
```

This will create optimized production builds in the `frontend/build` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 