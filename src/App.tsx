import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import FilmPage from './pages/WatchPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/film/:id" element={<FilmPage />} />
    </Routes>
  );
};

export default App;