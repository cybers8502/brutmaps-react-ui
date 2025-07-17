import {Link} from 'react-router-dom';
import styles from './SocialLinks.module.scss';
import {socialLinks} from '~/util/routes.ts';
import {FacebookIcon, InstagramIcon} from '~/components/Icons/Icons.tsx';

export default function SocialLinks() {
  return (
    <div className={styles.container}>
      <Link to={socialLinks.instagram} target='_blank'>
        <FacebookIcon />
      </Link>
      <Link to={socialLinks.facebook} target='_blank'>
        <InstagramIcon />
      </Link>
    </div>
  );
}
