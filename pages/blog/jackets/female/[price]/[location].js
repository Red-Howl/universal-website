import SeoLanding from '../../../../../components/SeoLanding';
import { LOCATIONS, getPriceBands, buildShopUrl, buildTitle, buildDescription, buildContent } from '../../../../../lib/seoLanding';

export default function Page(props) {
	return <SeoLanding {...props} />;
}

export async function getStaticPaths() {
	const paths = [];
	const prices = getPriceBands(5000, 500);
	prices.forEach((p) => {
		LOCATIONS.forEach((loc) => {
			paths.push({ params: { price: `under-${p}`, location: loc } });
		});
	});
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	const price = Number(String(params.price).replace('under-', ''));
	const location = params.location;
	const category = 'jackets';
	const style = 'female';
	const priceBand = params.price;
	const title = buildTitle({ category, style, price, location });
	const description = buildDescription({ category, style, price, location });
	const canonical = `https://www.kalamkar.art/blog/${category}/${style}/${priceBand}/${location}`;
	const shopUrl = buildShopUrl({ category, style, price, location });
	const content = buildContent({ category, style, price, location, shopUrl, title, description, canonical });
	return { props: { seo: { title, description, canonical, og: { title, description } }, shopUrl, content } };
}


