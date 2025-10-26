import { useEffect, useRef, useState } from 'react';

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  opacity: number[];
}

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  opacity: number[];
}

export default function MatrixHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const columnsRef = useRef<MatrixColumn[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [decryptProgress, setDecryptProgress] = useState(0);

  // Матричные символы (катакана, латиница, цифры)
  const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const encryptedText = 'ｗａｋｅ ｕｐ, ﾈｅｏ...';
  const decryptedText = 'Follow the white rabbit';

  // Генерация случайного зашифрованного символа
  const getRandomChar = () => {
    return matrixChars[Math.floor(Math.random() * matrixChars.length)];
  };

  // Получение текста на основе прогресса расшифровки
  const getDisplayText = () => {
    const numCharsToReveal = Math.floor(decryptedText.length * decryptProgress);
    let result = '';
    
    for (let i = 0; i < decryptedText.length; i++) {
      if (i < numCharsToReveal) {
        result += decryptedText[i];
      } else if (decryptedText[i] === ' ') {
        result += ' ';
      } else {
        result += getRandomChar();
      }
    }
    
    return result;
  };

  // Отслеживание движения мыши над субтитром
  useEffect(() => {
    const subtitle = subtitleRef.current;
    if (!subtitle) return;

    let mouseEnterX = 0;
    let isTracking = false;

    const handleMouseEnter = (e: MouseEvent) => {
      mouseEnterX = e.clientX;
      isTracking = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isTracking) return;

      const deltaX = Math.abs(mouseEnterX - e.clientX); // Движение в любую сторону
      
      if (deltaX > 0) {
        // Пользователь двигает мышь в любую сторону
        const progress = Math.min(deltaX / 200, 1); // 200px для полной расшифровки
        setDecryptProgress(progress);
      }
    };

    const handleMouseLeave = () => {
      isTracking = false;
      // Плавно возвращаем в зашифрованное состояние
      setDecryptProgress(0);
    };

    subtitle.addEventListener('mouseenter', handleMouseEnter);
    subtitle.addEventListener('mousemove', handleMouseMove);
    subtitle.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      subtitle.removeEventListener('mouseenter', handleMouseEnter);
      subtitle.removeEventListener('mousemove', handleMouseMove);
      subtitle.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Установка размеров canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initColumns();
    };

    // Инициализация колонок символов
    const initColumns = () => {
      const fontSize = 16;
      const columns = Math.floor(canvas.width / fontSize);
      columnsRef.current = [];

      for (let i = 0; i < columns; i++) {
        const column: MatrixColumn = {
          x: i * fontSize,
          y: Math.random() * canvas.height * -1,
          speed: Math.random() * 2 + 1,
          chars: [],
          opacity: []
        };

        // Генерация символов для колонки
        const length = Math.floor(Math.random() * 20) + 10;
        for (let j = 0; j < length; j++) {
          column.chars.push(matrixChars[Math.floor(Math.random() * matrixChars.length)]);
          column.opacity.push(1 - j / length);
        }

        columnsRef.current.push(column);
      }
    };

    // Анимация
    const animate = () => {
      // Полупрозрачный черный фон для эффекта следа
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fontSize = 16;

      columnsRef.current.forEach((column) => {
        column.chars.forEach((char, index) => {
          const y = column.y + index * fontSize;

          // Рассчитываем расстояние от курсора
          const dx = column.x - mouseRef.current.x;
          const dy = y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          // Эффект выпирания при наведении мыши
          let offsetX = 0;
          let glowIntensity = 0;
          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            offsetX = (dx / distance) * force * 20;
            glowIntensity = force;
          }

          // Цвет и свечение
          const opacity = column.opacity[index];
          const isHead = index === 0;
          
          if (glowIntensity > 0) {
            // Свечение при наведении
            ctx.shadowBlur = 20 * glowIntensity;
            ctx.shadowColor = '#00ff00';
          } else {
            ctx.shadowBlur = isHead ? 10 : 0;
            ctx.shadowColor = '#00ff00';
          }

          if (isHead) {
            ctx.fillStyle = '#ffffff';
          } else {
            ctx.fillStyle = `rgba(0, 255, 0, ${opacity * 0.8})`;
          }

          ctx.font = `${fontSize}px "Matrix Code NFI"`;
          ctx.fillText(char, column.x + offsetX, y);
        });

        // Движение колонки
        column.y += column.speed;

        // Сброс колонки при достижении низа
        if (column.y - column.chars.length * fontSize > canvas.height) {
          column.y = Math.random() * -500;
          column.speed = Math.random() * 2 + 1;
          
          // Обновление символов
          column.chars = [];
          column.opacity = [];
          const length = Math.floor(Math.random() * 20) + 10;
          for (let j = 0; j < length; j++) {
            column.chars.push(matrixChars[Math.floor(Math.random() * matrixChars.length)]);
            column.opacity.push(1 - j / length);
          }
        }

        // Случайное изменение символов
        if (Math.random() > 0.98) {
          const randomIndex = Math.floor(Math.random() * column.chars.length);
          column.chars[randomIndex] = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }
      });

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Отслеживание мыши
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="matrix-hero">
      <canvas ref={canvasRef} className="matrix-canvas" />
      <div className="matrix-content">
        <h1 className="matrix-title">
          <span className="matrix-letter">M</span>
          <span className="matrix-letter">A</span>
          <span className="matrix-letter">T</span>
          <span className="matrix-letter">R</span>
          <span className="matrix-letter">I</span>
          <span className="matrix-letter">X</span>
        </h1>
        <p 
          ref={subtitleRef} 
          className="matrix-subtitle"
          data-progress={decryptProgress}
        >
          {decryptProgress > 0 ? getDisplayText() : encryptedText}
        </p>
      </div>
    </div>
  );
}