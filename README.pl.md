**[English](./README.md) | [Polski](./README.pl.md)**

# Cinelog - Aplikacja do śledzenia filmów

Pełnowartościowa aplikacja do śledzenia filmów, która pozwala użytkownikom zarządzać swoją kolekcją filmów i odkrywać nowe treści. Zbudowana z frontendem React Native (Expo) i backendem ASP.NET Core.

## Funkcje

### Funkcjonalność podstawowa

- **Uwierzytelnianie użytkownika**: Bezpieczne uwierzytelnianie oparte na JWT z rejestracją/logowaniem
- **Zarządzanie filmami**:
  - Dodawanie filmów do listy obserwacyjnej
  - Oznaczanie filmów jako obejrzane
  - Polubienie/niepolubienie filmów
  - Niestandardowe oceny
- **Wiele list**: Lista obserwacyjna, Polubione, Niepolubione, Obejrzane filmy
- **Szczegóły filmu**:
  - Pełne informacje o filmie (tytuł, opis, oceny, data wydania)
  - Informacje o gatunkach
  - Czas trwania i język
  - Integracja z TMDB w celu uzyskania danych o filmach

### Funkcje natywne

- **Udostępnianie filmów**: Natywne udostępnianie na iOS/Android (WhatsApp, Telegram, Email, itp.)
- **Odświeżanie przeciągnięciem**: Płynne odświeżanie listy za pomocą kontrolek natywnych
- **Nawigacja kartami**: Bezproblemowe przełączanie kart z animacjami
- **Obsługa bezpiecznego obszaru**: Prawidłowe zarządzanie obszarami dla wycięć i bezpiecznych regionów

## Architektura

### Frontend (React Native - Expo)

```
app/
├── (tabs)/
│   ├── index.tsx           # Ekran główny
│   ├── liked.tsx           # Lista polubionych filmów
│   ├── disliked.tsx        # Lista niepolubionych filmów
│   ├── watchlist.tsx       # Lista obserwacyjna
│   ├── watched.tsx         # Obejrzane filmy
│   ├── movie/
│   └── [id].tsx            # Ekran szczegółów filmu
└── auth/
    ├── login.tsx           # Ekran logowania
    └── register.tsx        # Ekran rejestracji
```

**Stos technologiczny:**

- **Framework**: React Native z Expo Router
- **Zarządzanie stanem**: React Context
- **Stylowanie**: Tailwind CSS (NativeWind)
- **Ikony**: lucide-react-native
- **Pobieranie danych**: Niestandardowa otoka API
- **Animacje**: Wbudowane przejścia Expo Router

### Backend (ASP.NET Core)

```
api/
├── Models/
│   ├── User.cs             # Encja użytkownika
│   ├── Movie.cs            # Encja filmu
│   ├── Genre.cs            # Encja gatunku
│   ├── UserMovie.cs        # Relacja użytkownik-film
│   └── MovieGenre.cs       # Relacja film-gatunek
├── Dtos/
│   ├── AddToListRequestDto.cs      # Żądanie dodania filmu do listy
│   ├── AuthResponseDto.cs          # Odpowiedź uwierzytelniania
│   ├── GenreDto.cs                 # Obiekt transferu danych gatunku
│   ├── LoginRequestDto.cs          # Żądanie logowania
│   ├── MovieResponseDto.cs         # Odpowiedź danych filmu
│   ├── RateMovieDto.cs             # Żądanie oceny filmu
│   ├── RegisterRequestDto.cs       # Żądanie rejestracji użytkownika
│   └── UserResponseDto.cs          # Odpowiedź danych użytkownika
└── Program.cs                      # Punkty końcowe API
```

**Stos technologiczny:**

- **Framework**: ASP.NET Core 10
- **Baza danych**: PostgreSQL
- **Uwierzytelnianie**: JWT (JSON Web Tokens)
- **ORM**: Entity Framework Core
- **Walidacja**: BCrypt do szyfrowania haseł

## Pierwsze kroki

### Wymagania wstępne

- Node.js 18+ (Frontend)
- .NET 10 SDK (Backend)
- PostgreSQL 14+
- Expo CLI
- Git

### Konfiguracja frontendu

```bash
# Przejdź do katalogu mobilnego
cd mobile

# Zainstaluj zależności
npm install

# Zainstaluj moduły natywne
npx expo prebuild

# Uruchom serwer programistyczny
npx expo start

# Uruchom na symulatorze iOS
i

# Uruchom na emulatorze Android
a

# Uruchom na urządzeniu fizycznym
s  # (skanuj kod QR aplikacją Expo Go)
```

### Konfiguracja backendu

```bash
# Przejdź do katalogu backendu
cd api

# Zainstaluj zależności
dotnet restore

# Skonfiguruj połączenie z bazą danych
# Zaktualizuj appsettings.json za pomocą parametrów połączenia PostgreSQL

# Uruchom migracje
dotnet ef database update

# Uruchom serwer API
dotnet run

# API działa na: https://localhost:7290
```

## Uzyskanie klucza API TMDB

### Kroki:

1. **Przejdź do TMDB**

   - Otwórz [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Zaloguj się (lub utwórz konto)

2. **Poproś o klucz API**

   - Kliknij "Create" → "Developer"
   - Zgódź się na Warunki Świadczenia Usług
   - Wypełnij formularz (wspomnij, że to dla projektu osobistego)
   - Zaakceptuj Warunki Świadczenia Usług

3. **Skopiuj swój klucz API**

   - Na stronie Ustawień API skopiuj swój **API Read Access Token (v4 auth)**
   - Wygląda to jak długi ciąg: `eyJhbGciOiJIUzI1NiJ9...`

4. **Dodaj do .env (Frontend)**

   ```
   EXPO_PUBLIC_TMDB_API_TOKEN=your_tmdb_api_key
   ```

## Zmienne środowiskowe

**.env** (Frontend):

```
EXPO_PUBLIC_TMDB_API_TOKEN=your_tmdb_api_key
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

**appsettings.json** (Backend):

Wygeneruj JWT secret key

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

## Punkty końcowe API

### Uwierzytelnianie

```
POST   /api/auth/register          # Zarejestruj nowego użytkownika
POST   /api/auth/login             # Zaloguj użytkownika
GET    /api/auth/validate          # Sprawdź token
```

### Filmy

```
POST   /api/movies/watchlist       # Dodaj/Usuń film z listy obserwacyjnej
POST   /api/movies/like            # Dodaj/Usuń polubienie filmu
POST   /api/movies/dislike         # Dodaj/Usuń niepolubienie filmu
POST   /api/movies/watched         # Dodaj/Usuń film z obejrzanych
POST   /api/movies/{movieId}/rate  # Dodaj ocenę do filmu

GET    /api/movies/watchlist       # Pobierz listę obserwacyjną
GET    /api/movies/liked           # Pobierz polubione filmy
GET    /api/movies/disliked        # Pobierz niepolubiome filmy
GET    /api/movies/watched         # Pobierz obejrzane filmy
GET    /api/movies/{tmdbId}/status # Pobierz status filmu
GET    /api/movies/counts          # Pobierz liczby list
```

## Bezpieczeństwo

- **Uwierzytelnianie JWT**: Bezpieczne uwierzytelnianie oparte na tokenach
- **Szyfrowanie haseł**: Szyfrowanie BCrypt
- **Chronione trasy**: Autoryzacja wymagana dla wszystkich punktów końcowych użytkownika
- **Walidacja danych wejściowych**: Walidacja formatu poczty e-mail i nazwy użytkownika

## Schemat bazy danych

### Użytkownicy

- `id` (PK)
- `username` (unikalne)
- `email` (unikalne)
- `passwordHash`
- `createdAt`

### Filmy

- `id` (PK)
- `tmdbId` (unikalne)
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

### Gatunki

- `id` (PK)
- `tmdbId` (unikalne)
- `name`

## Przepływ danych

```
Frontend (Szczegóły filmu)
    ↓
POST /api/movies/watchlist (AddToListDto)
    ↓
Backend: GetOrCreateMovie()
    ├─ Sprawdź, czy film istnieje pod względem TmdbId
    ├─ Utwórz film + gatunki, jeśli nowy
    └─ Przełącz status UserMovie
    ↓
Odpowiedź: { movieId, tmdbId, inWatchlist }
    ↓
Frontend: useFocusEffect odświeżenie przy powrocie karty
    ↓
GET /api/movies/watchlist
    ↓
Zaktualizowana lista wyświetlana
```

Zrzuty ekranu aplikacji:

![Ekran logowania](/assets/login-screen.jpg)
![Ekran główny](/assets/main-screen.jpg)
![Ekran polubień](/assets/liked-screen.jpg)
![Ekran profilu](/assets/profile-screen.jpg)
![Ekran szczegółów filmu](/assets/movie-detail-screen.jpg)
![Natywna funkcja udostępniania](/assets/native-share-feature.jpg)

**Wersja**: 0.0.1
