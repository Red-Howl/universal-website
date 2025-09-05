import SeoLanding from '../../../../../../components/SeoLanding';
import { LOCATIONS, COLORS, getPriceBands, buildShopUrl, buildTitle, buildDescription, buildContent } from '../../../../../../lib/seoLanding';

export default function Page(props) {
	return <SeoLanding {...props} />;
}

export async function getStaticPaths() {
	return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
	const price = Number(String(params.price).replace('under-', ''));
	const location = params.location;
	const color = params.color;
	const category = 'jackets';
	const style = 'normal';
	const priceBand = params.price;
	const title = buildTitle({ category, style, price, location, color });
	const description = buildDescription({ category, style, price, location, color });
	const canonical = `https://www.kalamkar.art/blog/${category}/${style}/${color}/${priceBand}/${location}`;
	const shopUrl = buildShopUrl({ category, style, price, location, color });
	const content = buildContent({ category, style, price, location, shopUrl, title, description, canonical, color });
	return { props: { seo: { title, description, canonical, og: { title, description } }, shopUrl, content }, revalidate: 86400 };
}


