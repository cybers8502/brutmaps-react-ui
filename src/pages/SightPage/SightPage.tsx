import SiteLayout from '~/layouts/SiteSimpleLayout/SiteLayout.tsx';
import SightBlogArticle from '~/components/SightBlogArticle/SightBlogArticle.tsx';
import {useNavigate, useParams} from 'react-router-dom';

export default function SightPage() {
  const {slug} = useParams();
  const navigate = useNavigate();

  if (!slug) {
    navigate('/404');
    return;
  }

  return (
    <SiteLayout>
      <SightBlogArticle sightSlug={slug} />
    </SiteLayout>
  );
}
