import {Link} from 'react-router-dom';
import {FacebookIcon, InstagramIcon} from '~/components/Icons/Icons.tsx';
import {socialLinks} from '~/util/routes.ts';
import styles from './SocialLinks.module.scss';

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
