import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import FilmPlayer from '../components/FilmPlayer';
import FilmInfo from '../components/FilmInfo';
import { getContent } from '../helpers/getContent';

interface Film {
  title: string;
  poster: string;
  description: string;
  rate: {
    imdb: string;
    kinopoisk: string;
    roten: string;
  };
  meta: {
    title: string;
    description: string;
  };
  video: string;
}

const FilmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadFilm = async () => {
      const filmData = await getContent('films', id as string);
      if (filmData) {
        setFilm(filmData);
      }
    };
    loadFilm();
  }, [id]);

  if (!film) {
    return <div>Фильм не найден</div>;
  }

  return (
    <section className="filmPage">
      <Helmet>
        <title>{film.meta.title}</title>
        <meta name="description" content={film.meta.description} />
      </Helmet>
      <FilmPlayer title={film.title} />
      <FilmInfo film={film} />
    </section>
  );
};

export default FilmPage;