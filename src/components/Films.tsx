import React from 'react';
import { Link } from 'react-router-dom';

interface Film {
  title: string;
  poster: string;
  shortDescription: string;
}

interface FilmsProps {
  title: string;
  films: Film[];
}

const Films: React.FC<FilmsProps> = ({ title, films }) => {
  const filmIds = ['matrix', 'reloaded', 'revolution', 'resurection'];

  return (
    <section>
      <h2>{title}</h2>
      <div className="filmsContainer">
        {films.map((film, index) => (
          <Link
            key={index}
            to={`/film/${filmIds[index]}`}
            className="filmCardLink"
          >
            <div className="filmCard">
              <div className="posterWrapper">
                <img
                  src={film.poster}
                  alt={film.title}
                  width="300"
                  height="450"
                  className="poster"
                />
              </div>
              <div className="text">
                <h3>{film.title}</h3>
                <p>{film.shortDescription}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Films;