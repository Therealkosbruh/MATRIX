import React from 'react';

interface FilmPlayerProps {
  title: string;
}

const FilmPlayer: React.FC<FilmPlayerProps> = ({ title }) => {
  return (
    <div className="filmPlayerPlaceholder">
      <div className="placeholderContent">
        <h3>Видеоплеер</h3>
        <p>{title}</p>
        <span className="comingSoon">Скоро будет доступен</span>
      </div>
    </div>
  );
};

export default FilmPlayer;