import {useArchitect, useSightsList, useSightsMap} from '@brutmaps/api';
import parse from 'html-react-parser';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import ArchitectBuildingItem from '~/components/ArchitectDetail/ArchitectBuildingItem/ArchitectBuildingItem.tsx';
import ArchitectMap from '~/components/ArchitectDetail/ArchitectMap/ArchitectMap.tsx';
import {ArrowLeftIcon} from '~/components/Icons/Icons.tsx';
import PageContentLoader from '~/components/PageContentLoader/PageContentLoader.tsx';
import routes from '~/util/routes.ts';
import styles from './ArchitectDetail.module.scss';

interface ArchitectDetailProps {
  slug: string;
}

export default function ArchitectDetail({slug}: ArchitectDetailProps) {
  const {t} = useTranslation();
  const {architect, isLoading, error} = useArchitect(slug);

  const architectId = architect ? String(architect.id) : undefined;

  const {result: buildings, isLoading: isLoadingBuildings} = useSightsList({
    architects: architectId ? [architectId] : undefined,
    perPage: 200,
  });

  const {featureCollection} = useSightsMap({
    architects: architectId ? [architectId] : undefined,
  });

  if (isLoading) return <PageContentLoader />;
  if (error || !architect) return <p>{t('common.serverError')}</p>;

  const name = architect.fullName || architect.title;

  return (
    <div className={styles.wrap}>
      <div className={styles.info}>
        <Link to={routes.architects} className={styles.backLink}>
          <ArrowLeftIcon size={16} />
          {t('architects.backToList')}
        </Link>

        <div className={styles.header}>
          <picture className={styles.picture}>
            {architect.image?.url ? (
              <img src={architect.image.url} alt={architect.image.alt || name} />
            ) : (
              <span className={styles.pictureFallback} aria-hidden='true' />
            )}
          </picture>
          <h1 className={styles.title}>{name}</h1>
        </div>

        {architect.description && <div className={styles.description}>{parse(architect.description)}</div>}

        {architect.wikiLink && (
          <a href={architect.wikiLink} target='_blank' rel='noreferrer' className={styles.wikiLink}>
            {t('architects.wikiLink')}
          </a>
        )}

        <h2 className={styles.buildingsTitle}>{t('architects.buildingsTitle', {count: architect.count})}</h2>

        {!isLoadingBuildings && buildings && buildings.items.length > 0 && (
          <div className={styles.buildingsList}>
            {buildings.items.map((item) => (
              <ArchitectBuildingItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.mapWrap}>
        <ArchitectMap featureCollection={featureCollection} />
      </div>
    </div>
  );
}
