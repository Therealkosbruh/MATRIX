import { useEffect, useRef } from 'react';

interface MatrixTransitionProps {
  scrollProgress: number;
}

export default function MatrixTransition({ scrollProgress }: MatrixTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    speed: number;
    char: string;
    opacity: number;
    wobble: number;
  }>>([]);

  const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 300; // Высота зоны перехода
    };

    // Инициализация частиц для эффекта перетекания
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = 100;
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          speed: Math.random() * 3 + 2,
          char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
          opacity: Math.random() * 0.5 + 0.5,
          wobble: Math.random() * Math.PI * 2
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fontSize = 16;
      const centerX = canvas.width / 2;
      const transitionActive = scrollProgress > 0.3;

      particlesRef.current.forEach((particle) => {
        if (transitionActive) {
          // Притягивание к центру
          const dx = centerX - particle.x;
          particle.x += dx * 0.02;
          
          // Волнообразное движение
          particle.wobble += 0.05;
          const wobbleX = Math.sin(particle.wobble) * 20 * scrollProgress;
          
          ctx.shadowBlur = 10 * scrollProgress;
          ctx.shadowColor = '#00ff00';
          ctx.fillStyle = `rgba(0, 255, 0, ${particle.opacity * scrollProgress})`;
          ctx.font = `${fontSize}px "Matrix Code NFI"`;
          ctx.fillText(particle.char, particle.x + wobbleX, particle.y);

          particle.y += particle.speed * (1 + scrollProgress * 2);

          if (particle.y > canvas.height + 50) {
            particle.y = -50;
            particle.x = Math.random() * canvas.width;
            particle.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          }
        }
      });

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [scrollProgress]);

  return (
    <div className="matrix-transition-wrapper">
      <canvas 
        ref={canvasRef} 
        className="matrix-transition-canvas"
        style={{ opacity: Math.min(1, scrollProgress * 2) }}
      />
    </div>
  );
}