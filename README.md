**[English](./README.md) | [Polski](./README.pl.md)**

# Cinelog - Movie Tracking App

A full-stack movie tracking application that allows users to manage their collections of films, and discover new content. Built with React Native (Expo) frontend and ASP.NET Core backend.

## Features

### Core Functionality

- **User Authentication**: JWT-based secure authentication with register/login
- **Movie Management**:
  - Add movies to watchlist
  - Mark movies as watched
  - Like/dislike movies
  - Custom ratings
- **Multiple Lists**: Watchlist, Liked, Disliked, Watched movies
- **Movie Details**:
  - Full movie information (title, synopsis, ratings, release date)
  - Genre information
  - Runtime and language details
  - TMDB integration for movie data

### Native Features

- **Share Movies**: Native iOS/Android sharing (WhatsApp, Telegram, Email, etc.)
- **Pull-to-Refresh**: Smooth list refresh with native controls
- **Tab Navigation**: Seamless tab switching with animations
- **Safe Area Handling**: Proper viewport management for notches and safe areas

## Architecture

### Frontend (React Native - Expo)

```
app/
├── (tabs)/
│   ├── index.tsx           # Home screen
│   ├── liked.tsx           # Liked movies list
│   ├── disliked.tsx        # Disliked movies list
│   ├── watchlist.tsx       # Watchlist
│   ├── watched.tsx         # Watched movies
│   ├── movie/
│   └── [id].tsx            # Movie details screen
└── auth/
    ├── login.tsx           # Login screen
    └── register.tsx        # Register screen
```

**Tech Stack:**

- **Framework**: React Native with Expo Router
- **State Management**: React Context
- **Styling**: Tailwind CSS (NativeWind)
- **Icons**: lucide-react-native
- **Data Fetching**: Custom API wrapper
- **Animations**: Expo Router built-in transitions

### Backend (ASP.NET Core)

```
api/
├── Models/
│   ├── User.cs             # User entity
│   ├── Movie.cs            # Movie entity
│   ├── Genre.cs            # Genre entity
│   ├── UserMovie.cs        # User-movie relationship
│   └── MovieGenre.cs       # Movie-genre relationship
├── Dtos/
│   ├── AddToListRequestDto.cs      # Request to add movie to list
│   ├── AuthResponseDto.cs          # Authentication response
│   ├── GenreDto.cs                 # Genre data transfer object
│   ├── LoginRequestDto.cs          # Login request
│   ├── MovieResponseDto.cs         # Movie data response
│   ├── RateMovieDto.cs             # Movie rating request
│   ├── RegisterRequestDto.cs       # User registration request
│   └── UserResponseDto.cs          # User data response
└── Program.cs                      # API endpoints
```

**Tech Stack:**

- **Framework**: ASP.NET Core 10
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: Entity Framework Core
- **Validation**: BCrypt for password hashing

## Getting Started

### Prerequisites

- Node.js 18+ (Frontend)
- .NET 10 SDK (Backend)
- PostgreSQL 14+
- Expo CLI
- Git

### Frontend Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Install native modules
npx expo prebuild

# Start development server
npx expo start

# Run on iOS simulator
i

# Run on Android emulator
a

# Run on physical device
s  # (scan QR code with Expo Go app)
```

### Backend Setup

```bash
# Navigate to backend directory
cd api

# Install dependencies
dotnet restore

# Install Entity Framework Core
dotnet tool install --global dotnet-ef

# Configure database connection
# Update appsettings.json with PostgreSQL connection string

# Run migrations
dotnet ef database update

# Start API server
dotnet run

# API runs on: https://localhost:7290
```

## Getting TMDB API Key

### Steps:

1. **Go to TMDB**

   - Open https://www.themoviedb.org/settings/api
   - Sign in (or create an account)

2. **Request API Key**

   - Click "Create" → "Developer"
   - Agree to Terms of Service
   - Fill out the form (mention it's for a personal project)
   - Accept the Terms of Service

3. **Copy Your API Key**

   - On the API Settings page, copy your **API Read Access Token (v4 auth)**
   - It looks like a long string: `eyJhbGciOiJIUzI1NiJ9...`

4. **Add to .env (Frontend)**

### Environment Variables

**.env** (Frontend):

```
EXPO_PUBLIC_TMDB_API_TOKEN=your_tmdb_api_key
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

**appsettings.json** (Backend):

Generate JWT secret key

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=cinelog;Username=postgres;Password=password"
  },
  "Jwt": {
    "Key": "your-jwt-secret-key-min-32-characters",
    "Issuer": "cinelog",
    "Audience": "cinelog-users"
  }
}
```

## API Endpoints

### Authentication

```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/validate          # Validate token
```

### Movies

```
POST   /api/movies/watchlist       # Add/Remove movie watchlist
POST   /api/movies/like            # Add/Remove movie like
POST   /api/movies/dislike         # Add/Remove movie dislike
POST   /api/movies/watched         # Add/Remove movie to watched
POST   /api/movies/{movieId}/rate  # Add rating to movie

GET    /api/movies/watchlist       # Get watchlist
GET    /api/movies/liked           # Get liked movies
GET    /api/movies/disliked        # Get disliked movies
GET    /api/movies/watched         # Get watched movies
GET    /api/movies/{tmdbId}/status # Get movie status
GET    /api/movies/counts          # Get list counts
```

## Security

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt encryption
- **Protected Routes**: Authorization required for all user endpoints
- **Input Validation**: Email format and username validation

## Database Schema

### Users

- `id` (PK)
- `username` (unique)
- `email` (unique)
- `passwordHash`
- `createdAt`

### Movies

- `id` (PK)
- `tmdbId` (unique)
- `title`
- `originalTitle`
- `overview`
- `posterPath`
- `backdropPath`
- `releaseDate`
- `voteAverage`
- `voteCount`
- `popularity`
- `adult`
- `runtime`
- `originalLanguage`

### UserMovies

- `userId` (FK)
- `movieId` (FK)
- `isLiked`
- `isDisliked`
- `inWatchlist`
- `isWatched`
- `userRating`

### Genres

- `id` (PK)
- `tmdbId` (unique)
- `name`

## Data Flow

```
Frontend (Movie Details)
    ↓
POST /api/movies/watchlist (AddToListDto)
    ↓
Backend: GetOrCreateMovie()
    ├─ Check if movie exists by TmdbId
    ├─ Create movie + genres if new
    └─ Toggle UserMovie status
    ↓
Response: { movieId, tmdbId, inWatchlist }
    ↓
Frontend: useFocusEffect refresh on tab return
    ↓
GET /api/movies/watchlist
    ↓
Updated list displayed
```

Applications screenshots:

![Login screen](/assets/login-screen.jpg)
![Main screen](/assets/main-screen.jpg)
![Liked screen](/assets/liked-screen.jpg)
![Profile screen](/assets/profile-screen.jpg)
![Movie detail screen](/assets/movie-detail-screen.jpg)
![Native share feature](/assets/native-share-feature.jpg)

Division of labor:
Artem Pushkarov 144819 - Frontend, backend, documentation
Stanislav Bazyliak 143067 - Testing, CI, Figma

**Version**: 0.0.1
