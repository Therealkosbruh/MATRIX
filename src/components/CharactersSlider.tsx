import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useSwipeable } from 'react-swipeable';
import Model3D from './Model3D';
import charactersData from '../assets/texts/characters.json';

interface Character {
  name: string;
  description: string;
  figure: string;
  color: string;
}

export default function Characters() {
  const characters = charactersData.characters as Record<string, Character>;
  const characterKeys = Object.keys(characters);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentKey = characterKeys[currentIndex];
  const currentCharacter = characters[currentKey];
  const sliderRef = useRef<HTMLDivElement>(null);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isAnimating) handleNext(); 
    },
    onSwipedRight: () => {
      if (!isAnimating) handlePrev(); 
    },
    delta: 10, 
    preventScrollOnSwipe: true, 
    trackMouse: true, 
  });

  const setSliderRef = (element: HTMLDivElement | null) => {
    if (swipeHandlers.ref && typeof swipeHandlers.ref === 'function') {
      swipeHandlers.ref(element);
    }
    sliderRef.current = element;
  };

  const { ref: swipeRef, ...swipeHandlersWithoutRef } = swipeHandlers;
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let currentChar = 0;
    const text = currentCharacter.description;

    const typingInterval = setInterval(() => {
      if (currentChar < text.length) {
        setDisplayedText(text.slice(0, currentChar + 1));
        currentChar++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentIndex, currentCharacter.description]);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? characterKeys.length - 1 : prev - 1));
      setIsAnimating(false);
    }, 300);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === characterKeys.length - 1 ? 0 : prev + 1));
      setIsAnimating(false);
    }, 300);
  };

  return (
    <section className="characters-section">
      <div className="characters-slider">
        <div
          ref={setSliderRef} 
          {...swipeHandlersWithoutRef} 
          className={`slider-content ${isAnimating ? 'animating' : ''}`}
          style={{
            background: `radial-gradient(circle at center, ${currentCharacter.color}15 0%, transparent 70%)`,
          }}
        >
          <div className="model-container">
            <Canvas shadows>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
              <directionalLight position={[-5, -5, 5]} intensity={0.5} />
              <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />
              <spotLight
                position={[0, 10, 0]}
                angle={0.3}
                penumbra={1}
                intensity={0.7}
                castShadow
                color={currentCharacter.color}
              />

              <Suspense fallback={null}>
                <Model3D modelPath={currentCharacter.figure} />
              </Suspense>

              <OrbitControls
                enableZoom={true}
                minDistance={3}
                maxDistance={8}
                enablePan={false}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 1.3}
              />
            </Canvas>

            <div
              className="model-glow"
              style={{
                background: `radial-gradient(circle, ${currentCharacter.color}40 0%, transparent 70%)`,
              }}
            ></div>
          </div>

          <div className="content-container">
            <span className="title">{currentCharacter.name}</span>
            <p className="description">
              {displayedText}
              {isTyping && <span className="cursor">|</span>}
            </p>
          </div>
        </div>

        <div className="slider-controls">
          <button className="slider-btn prev" onClick={handlePrev} disabled={isAnimating}>
            <span>‹</span>
          </button>
          <div className="slider-dots">
            {characterKeys.map((key, index) => (
              <button
                key={key}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  if (!isAnimating && index !== currentIndex) {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setCurrentIndex(index);
                      setIsAnimating(false);
                    }, 300);
                  }
                }}
                disabled={isAnimating}
              />
            ))}
          </div>
          <button className="slider-btn next" onClick={handleNext} disabled={isAnimating}>
            <span>›</span>
          </button>
        </div>
      </div>
    </section>
  );
}