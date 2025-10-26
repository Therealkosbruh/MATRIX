import { useEffect, useState } from 'react';
import MatrixHero from '../components/MatrixHero';
import Characters from '../components/CharactersSlider';
import Films from '../components/Films';
import Footer from '../components/Footer';
import { getContent } from '../helpers/getContent';

interface Film {
  title: string;
  poster: string;
  shortDescription: string;
}

export default function MainPage() {
  const [title, setTitle] = useState<string>('');
  const [films, setFilms] = useState<Film[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const mainTitle = await getContent('films', 'mainPageTitle');
      const matrix = await getContent('films', 'matrix');
      const reloaded = await getContent('films', 'reloaded');
      const revolution = await getContent('films', 'revolution');
      const resurection = await getContent('films', 'resurection');

      if (mainTitle) setTitle(mainTitle);
      if (matrix && reloaded && revolution && resurection) {
        setFilms([matrix, reloaded, revolution, resurection]);
      }
    };

    loadData();
  }, []);

  return (
    <div className="main-page">
      <MatrixHero />
      <Characters />
      <Films title={title} films={films} />
      <Footer />
    </div>
  );
}