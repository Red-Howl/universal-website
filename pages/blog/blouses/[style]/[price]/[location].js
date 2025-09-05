import SeoLanding from '../../../../../components/SeoLanding';
import { LOCATIONS, CATEGORY_STYLES, getPriceBands, buildShopUrl, buildTitle, buildDescription, buildContent } from '../../../../../lib/seoLanding';

export default function Page(props) { return <SeoLanding {...props} />; }

export async function getStaticPaths() {
	return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
	const price = Number(String(params.price).replace('under-', ''));
	const location = params.location;
	const category = 'blouses';
	const style = params.style;
	const priceBand = params.price;
	const title = buildTitle({ category, style, price, location });
	const description = buildDescription({ category, style, price, location });
	const canonical = `https://www.kalamkar.art/blog/${category}/${style}/${priceBand}/${location}`;
	const shopUrl = buildShopUrl({ category, style, price, location });
	const content = buildContent({ category, style, price, location, shopUrl, title, description, canonical });
	return { props: { seo: { title, description, canonical, og: { title, description } }, shopUrl, content }, revalidate: 86400 };
}


