import {ReactNode, useEffect} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import classNames from 'classnames';
import styles from './PopupLayout.module.scss';
import CancelButton from '~/components/CancelButton/CancelButton.tsx';

const getStyle = (position?: PopupLayoutProps['position']): React.CSSProperties => {
  if (typeof position === 'object') {
    return {position: 'absolute', insetBlockStart: position.top, insetInlineStart: position.left};
  }

  switch (position) {
    case 'center':
      return {margin: 'auto'};
    case 'top center':
      return {margin: 'auto', marginBlockStart: 0};
    case 'top left':
      return {marginBlock: '0 auto', marginInline: '0 auto'};
    case 'top right':
      return {marginBlock: '0 auto', marginInline: 'auto 0'};
    case 'bottom center':
      return {margin: 'auto', marginBlockEnd: 0};
    case 'bottom left':
      return {marginBlock: 'auto 0', marginInline: '0 auto'};
    case 'bottom right':
      return {marginBlock: 'auto 0', marginInline: 'auto 0'};
    default:
      return {};
  }
};

interface AnimationStyle {
  fromDirection?: 'top' | 'bottom' | 'left' | 'right';
  distance?: number;
}

interface PopupLayoutProps {
  className?: string;
  containerClassNames?: string;
  closeButton?: boolean;
  position?:
    | 'center'
    | 'top center'
    | 'bottom center'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'
    | {top: number; left: number};
  onClose: () => void;
  children: ReactNode;
  animationStyle?: AnimationStyle;
}

export default function PopupLayout({
  className,
  containerClassNames,
  closeButton,
  position,
  onClose,
  children,
  animationStyle,
}: PopupLayoutProps) {
  const style = getStyle(position);

  const getInitialTranslate = () => {
    if (!animationStyle) return {x: 0, y: 0};

    const {fromDirection, distance = 100} = animationStyle;
    switch (fromDirection) {
      case 'top':
        return {x: 0, y: -distance};
      case 'bottom':
        return {x: 0, y: distance};
      case 'left':
        return {x: -distance, y: 0};
      case 'right':
        return {x: distance, y: 0};
      default:
        return {x: 0, y: 0};
    }
  };

  const handleOpeningState = () => {
    const popupRoot = document.querySelector('.popup-root') as HTMLElement | null;

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollBarWidth !== 0) {
      document.body.style.setProperty('--removed-scroll-width', `${scrollBarWidth}px`);
    }
    document.body.classList.add('is-locked');

    if (popupRoot) {
      popupRoot.addEventListener('click', handleClickOnOverlay);
    }
  };

  const handleClosingState = () => {
    const popupRoot = document.querySelector('.popup-root') as HTMLElement | null;

    document.body.classList.remove('is-locked');
    document.body.style.removeProperty('--removed-scroll-width');
    onClose();

    if (popupRoot) {
      popupRoot.removeEventListener('click', handleClickOnOverlay);
    }
  };

  const handleClickOnOverlay = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClosingState();
    }
  };

  const handleCloseClick = () => {
    handleClosingState();
  };

  const removeAdditionalProperties = () => {
    document.body.classList.remove('is-locked');
    document.body.style.removeProperty('--removed-scroll-width');
  };

  useEffect(() => {
    handleOpeningState();
  }, []);

  useEffect(() => {
    return () => {
      removeAdditionalProperties();
    };
  }, []);

  const initialTranslate = getInitialTranslate();

  const showVariants = {
    idle: {
      opacity: 0,
      x: initialTranslate.x,
      y: initialTranslate.y,
      transition: {
        duration: 0.3,
      },
    },
    loading: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className={classNames('popup-root', styles.overlay, className)}
        data-close
        initial='idle'
        animate='loading'
        exit='idle'
        variants={showVariants}>
        <div className={styles.wrap}>
          <div className={classNames(containerClassNames, styles.content)} role='dialog' style={style}>
            {closeButton && (
              <div className={styles.cancelButton}>
                <CancelButton onCancel={handleCloseClick} />
              </div>
            )}
            {children}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
