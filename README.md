# Budowa aplikacji mobilnych z użyciem technologii frontendowych - projekt zaliczeniowy

## Cel projektu

Projekt skupia się na stworzeniu aplikacji mobilnej typu CRUD z jednej z technologii frontendowej wymienionej w wymaganiach. Szblon repozytorium aplikacji będzie stworzone przy pomocy Github Classroom, a gotowa aplikacja pobrana z repozytorium w formie pliku zip i zaimportowana na platformę moodle. 

> Uwaga, zapoznaj się!
> [React severe security vulnerability](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)


## Wymagania technologiczne

1. Technologia podstawowa:
    - React native
    - Flutter
    - Native script
2. System kontroli wersji (VCS) *Git*
    - Sklonowanie repozytorium
    - Tworzenie branchy
    - Rozwiązywanie konfliktów
    - Łączenie branchy (merge)
3. Podstawowe CI/CD (Continous Integration and Continous Development) przy użyciu Github actions
    - Pull request przy merge
    - (może testowanie przy commit)
    - (może deploy do firebase)
4. Figma
    - Projekt graficzny stworzony w Figmie
5. Baza danych własnego wyboru do zapisywania danych użytkowników i danych aplikacji
6. Połączenie z API (Rest API albo GraphQL)

## Wymagania biznesowe

### API (REST)

Minimum:
- GET (lista)
- GET (szczegóły)
- POST (tworzenie)
- PUT/PATCH (aktualizacja)
- DELETE (usuwanie)


### Funkcja natywna

Warianty do wyboru:
- aparat (zdjęcia)
- lokalizacja GPS
- powiadomienia lokalne
- skaner kodów QR / barcode
- mapa + geotracking
- biometria (odcisk palca / twarz)
- akcelerometr / żyroskop


### CI/CD

Pipeline GitHub Actions:
- lint
- test
- build na emulator (lub flutter build apk / npx expo build)

Pipeline musi uruchamiać się:
- przy PR → feature → main
- przy pushu na main



### Git (Github)

Każdy projekt MUSI zawierać:
- branch main
- branch develop
- minimum 5 feature branchy:
- feature/ui
- feature/api
- feature/native
- feature/storage
- feature/tests

Obowiązkowo:
- co najmniej 2 Pull Requesty na develop
- finalny merge develop → main
- README (dokumentacja projektu)

### Dokumentacja końcowa

W folderze /docs:
- opis API
- opis funkcji natywnej
- screeny aplikacji
