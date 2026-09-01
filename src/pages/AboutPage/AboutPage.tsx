import {useAboutPage} from '@brutmaps/api';
import classNames from 'classnames';
import parse from 'html-react-parser';
import {useTranslation} from 'react-i18next';
import Button from '~/components/Button/Button.tsx';
import PageTitle from '~/components/PageTitle/PageTitle.tsx';
import {useSetPageLoading} from '~/context/PageLoadingContext.tsx';
import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import routes from '~/util/routes.ts';
import styles from './AboutPage.module.scss';

export default function AboutPage() {
  const {t} = useTranslation();
  const {aboutPage, isLoading, error} = useAboutPage();

  useSetPageLoading(isLoading);

  if (isLoading) return null;
  if (error || !aboutPage) return <p>{t('common.serverError')}</p>;

  const stats = [
    {value: aboutPage.buildingsCount, label: t('about.buildings')},
    {value: aboutPage.countriesCount, label: t('about.countries')},
    {value: aboutPage.architectsCount, label: t('about.architects')},
    {value: aboutPage.launchYear, label: t('about.launched')},
  ].filter((stat) => stat.value !== null);

  return (
    <SiteLayout>
      <PageTitle>{t('about.title')}</PageTitle>

      <div className={styles.grid}>
        {aboutPage.portraitUrl && (
          <img
            className={styles.portrait}
            src={aboutPage.portraitUrl}
            alt={aboutPage.portraitAlt ?? aboutPage.founderName ?? ''}
          />
        )}

        <div className={styles.information}>
          {aboutPage.founderName && <p className={styles.name}>{aboutPage.founderName}</p>}
          {aboutPage.founderRole && <p className={styles.role}>{aboutPage.founderRole}</p>}
          {aboutPage.body && (
            <div className={classNames(styles.body, 'article')}>{parse(aboutPage.body)}</div>
          )}
        </div>
      </div>

      {stats.length > 0 && (
        <div className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      <Button href={routes.commonMap} variant={'fillRed'} className={styles.cta}>
        {t('about.exploreMap')}
      </Button>
    </SiteLayout>
  );
}
