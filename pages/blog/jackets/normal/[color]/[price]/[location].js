import SeoLanding from '../../../../../../components/SeoLanding';
import { LOCATIONS, COLORS, getPriceBands, buildShopUrl, buildTitle, buildDescription, buildContent } from '../../../../../../lib/seoLanding';

export default function Page(props) {
	return <SeoLanding {...props} />;
}

export async function getStaticPaths() {
	const paths = [];
	const prices = getPriceBands(5000, 500);
	COLORS.forEach((color) => {
		prices.forEach((p) => {
			LOCATIONS.forEach((loc) => {
				paths.push({ params: { color, price: `under-${p}`, location: loc } });
			});
		});
	});
	return { paths, fallback: false };
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
	return { props: { seo: { title, description, canonical, og: { title, description } }, shopUrl, content } };
}


