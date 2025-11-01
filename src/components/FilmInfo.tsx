import React from 'react';

interface Film {
  title: string;
  description: string;
  rate: {
    imdb: string;
    kinopoisk: string;
    roten: string;
  };
}

interface FilmInfoProps {
  film: Film;
}

const FilmInfo: React.FC<FilmInfoProps> = ({ film }) => {
  return (
    <div className="filmInfo">
      <h1>{film.title}</h1>
      <div className="ratings">
        <div className="rating">
          <img src="/assets/img/icons/imdb.svg" alt="IMDB" width={20} height={20} />
          <span>{film.rate.imdb}</span>
        </div>
        <div className="rating">
          <img src="/assets/img/icons/kinopoisk.svg" alt="Kinopoisk" width={20} height={20} />
          <span>{film.rate.kinopoisk}</span>
        </div>
        <div className="rating">
          <img src="/assets/img/icons/rotten-Tomato.svg" alt="Rotten Tomatoes" width={20} height={20} />
          <span>{film.rate.roten}</span>
        </div>
      </div>
      <p>{film.description}</p>
    </div>
  );
};

export default FilmInfo;