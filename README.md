# InstaVerse

InstaVerse is a full-stack social media application inspired by modern photo-sharing platforms. Users can create accounts, log in securely, share posts, like and save content, view their feed, manage profiles, and connect with other users through follow requests.

## Features

- User registration and login
- JWT authentication using HTTP-only cookies
- Protected routes for authenticated users
- Create posts with images and captions
- Personalized feed
- Like and unlike posts
- Save and unsave posts
- Add and view comments
- View and update user profiles
- Upload profile images
- Follow and unfollow users
- Discover other users
- Follow request management
- Automatic redirect when the authentication token expires
- Responsive frontend interface

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Sass
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens
- Bcrypt.js
- Multer
- ImageKit

## Project Structure

```text
InstaVerse/
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       └── routes/
│
└── Frontend/
    ├── package.json
    └── src/
        ├── features/
        ├── App.jsx
        ├── AppRoutes.jsx
        └── main.jsx
