
import { useEffect, useState } from "react";

const KEY = "f84fc31d";

export default function App() {
  const [query, setQuery] = useState("Ali");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${encodeURIComponent(query)}`
          );

          if (!res.ok) {
            throw new Error("مشکل در ارتباط با سرور");
          }

          const data = await res.json();

          if (data.Response === "False") {
            setMovies([]);
            throw new Error(data.Error || "فیلمی پیدا نشد");
          }

          setMovies(data.Search || []);
        } catch (err) {
          setError(err.message);
          setMovies([]);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.trim().length < 3) {
        setMovies([]);
        setError("");
        setIsLoading(false);
        return;
      }

      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <p>در حال بارگذاری فیلم‌ها...</p>}
          {error && <p>{error}</p>}
          {!isLoading && !error && (
            <MovieList movies={movies} />
          )}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img" aria-label="popcorn">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "بستن فهرست" : "باز کردن فهرست"}
      >
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

function MovieList({ movies }) {
  return (
    <ul className="list">
      {movies.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li>
      <img
        src={
          movie.Poster && movie.Poster !== "N/A"
            ? movie.Poster
            : "https://placehold.co/100x150?text=No+Poster"
        }
        alt={`${movie.Title} poster`}
      />

      <h3>{movie.Title}</h3>

      <div>
        <p>
          <span>🗓 </span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
