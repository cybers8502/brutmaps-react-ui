import styles from './Hamburger.module.scss';

interface HamburgerProps {
  onClick: () => void;
}

export default function Hamburger({onClick}: HamburgerProps) {
  return (
    <button className={styles.hamburger} onClick={onClick}>
      <span></span>
    </button>
  );
}
