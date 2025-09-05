import SeoLanding from '../../../../../../components/SeoLanding';
import { LOCATIONS, CATEGORY_STYLES, SAREE_KINDS, getPriceBands, buildShopUrl, buildTitle, buildDescription, buildContent, displayLabel } from '../../../../../../lib/seoLanding';

function buildLongDescription({ category, style, price, location }) {
	const brand = 'Red Howl';
	const c = displayLabel(category);
	const s = style ? displayLabel(style) : '';
	const l = displayLabel(location);
	const p = price ? `under ₹${price}` : '';
	const parts = [];
	parts.push(`${brand} ${s} ${c} ${p} in ${l}: Discover premium-quality craftsmanship, contemporary silhouettes, and India-western aesthetics designed for comfort and statement-making presence. Every piece is curated to feel luxurious, look refined, and perform effortlessly in daily life and special occasions.`);
	parts.push(`Fabric and Finish: At ${brand}, we prioritize breathable cottons, rich silks, and advanced blends selected for drape, durability, and colorfastness. Expect meticulous stitching, balanced weights, and finishes that resist pilling while staying soft on skin. Subtle sheen and structured fall create a tailored yet fluid look.`);
	parts.push(`Designed for India: Cuts and fits are tuned to Indian body profiles. Shoulder seams, sleeve widths, and lengths are refined across sizes to avoid tightness at the biceps and ensure easy arm mobility. Vent placements and hemlines are optimized for seated and standing comfort in hot, humid climates.`);
	parts.push(`Occasion Versatility: Style ${brand} ${s} ${c} for work, evenings out, weddings, or travel. Layer with minimalist outerwear, add handcrafted accessories, or keep it sleek with tonal pairings. The collection complements sneakers, loafers, kolhapuris, and heels without losing its premium edge.`);
	parts.push(`Color Story: Our palette spans timeless neutrals to saturated jewel tones. We test colors across indoor LEDs and bright daylight to ensure they remain rich and flattering. Limited drops feature seasonal shades inspired by architecture, monsoon skies, coastal sands, and city nights.`);
	parts.push(`Care & Longevity: Most items are easy-care—gentle machine wash or dry clean as labeled. Follow our care guide to maintain surface luster, structure, and true hues. With proper care, ${brand} pieces retain their shape and finish for seasons, not just weeks.`);
	parts.push(`Sustainability Focus: We source from audited partners, streamline cutting to reduce waste, and focus on timeless designs that outlast micro-trends. Packaging is compact and recyclable where possible, helping reduce footprint from factory to your wardrobe.`);
	parts.push(`Fit Guidance: If between sizes, consider your preferred silhouette—size down for a sharper profile or up for relaxed drape. Our size chart reflects realistic measurements. Chat support can advise on sleeve length, shoulder breadth, and rise based on your height and build.`);
	parts.push(`Why ${brand}: Elevated materials, modern tailoring, and an India-western identity—built for today’s pace and aesthetics. From airport looks to festival nights, ${brand} keeps you refined, relevant, and ready.`);
	return parts.join('\n\n');
}

export default function Page(props) {
	return <SeoLanding {...props} />;
}

export async function getStaticPaths() {
	const paths = [];
	const prices = getPriceBands(10000, 500);
	const categories = ['sarees', 'kurtas', 'blouses', 'handbags', 'shoes'];
	categories.forEach((category) => {
		let styles = [];
		if (category === 'sarees') {
			styles = SAREE_KINDS;
		} else {
			styles = CATEGORY_STYLES[category] || [];
		}
		styles.forEach((style) => {
			prices.forEach((p) => {
				LOCATIONS.forEach((loc) => {
					paths.push({ params: { category, style, price: `under-${p}`, location: loc } });
				});
			});
		});
	});
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	const brand = 'Red Howl';
	const price = Number(String(params.price).replace('under-', ''));
	const location = params.location;
	const category = params.category;
	const style = params.style;
	const priceBand = params.price;
	const title = buildTitle({ brand, category, style, price, location });
	const description = buildDescription({ category, style, price, location });
	const canonical = `https://www.kalamkar.art/brand/red-howl/${category}/${style}/${priceBand}/${location}`;
	const shopUrl = buildShopUrl({ category, style, price, location });
	const baseContent = buildContent({ category, style, price, location, shopUrl, title, description, canonical });
	const longDescription = buildLongDescription({ category, style, price, location });
	const heroImage = `/replit.svg`; // placeholder image available in public
	const content = { ...baseContent, longDescription, heroImage };
	return { props: { seo: { title, description, canonical, og: { title, description } }, shopUrl, content } };
}


