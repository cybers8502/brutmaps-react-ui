import {useEffect, useState} from 'react';

export default function useMobileState() {
  const [isMobile, setIsMobile] = useState(() => !window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    function windowSizeHandler() {
      const isMobileNow = !window.matchMedia('(min-width: 1024px)').matches;
      setIsMobile(isMobileNow);
    }

    // Подписываемся на событие resize
    window.addEventListener('resize', windowSizeHandler);

    // Обновляем значение при монтировании
    windowSizeHandler();

    return () => {
      window.removeEventListener('resize', windowSizeHandler);
    };
  }, []); // Указываем пустой массив зависимостей, так как нам нужно установить обработчик только один раз

  return isMobile;
}
