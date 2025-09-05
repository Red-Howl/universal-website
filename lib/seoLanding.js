export const LOCATIONS = [
	'bangalore', 'karnataka', 'tumkur', 'hubli', 'hampi', 'mysore', 'mangalore', 'belagavi', 'dharwad', 'udupi',
	'koramangala', 'mg-road', 'indiranagar', 'jayanagar', 'whitefield', 'hsr-layout', 'banashankari', 'rajajinagar', 'hebbal', 'yelahanka',
	'electronic-city', 'btm-layout', 'marathahalli', 'malleswaram', 'basavanagudi', 'kamanahalli', 'rt-nagar', 'frazer-town', 'halasuru', 'sadashivanagar'
];

export function getPriceBands(max, step) {
	const bands = [];
	for (let p = step; p <= max; p += step) bands.push(p);
	return bands;
}

export const COLORS = ['blue', 'black', 'white', 'red', 'green', 'yellow'];

// Expanded saree kinds and additional fashion categories
export const SAREE_KINDS = [
	'kalamkari', 'pattu', 'banarasi', 'kanjivaram', 'mysore-silk', 'tussar', 'chanderi', 'pochampally-ikat', 'paithani', 'bandhani', 'kota-doria', 'linen', 'organza', 'cotton', 'georgette', 'chiffon', 'banjara'
];

export const CATEGORY_STYLES = {
	// category: array of styles/subtypes for breadth
	'kurtas': ['hand-painted', 'cotton', 'linen'],
	'blouses': ['hand-painted', 'embroidered'],
	'handbags': ['hand-painted', 'leather', 'canvas'],
	'shoes': ['hand-painted', 'sneakers', 'loafers']
};

export function displayLabel(str) {
	return (str || '').replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

export function buildShopUrl({ category, style, price, location, color }) {
	const params = new URLSearchParams();
	if (category) params.set('category', category);
	if (style) params.set('style', style);
	if (price) params.set('price_max', String(price));
	if (location) params.set('location', location);
	if (color) params.set('color', color);
	return `/shop?${params.toString()}`;
}

export function buildTitle({ brand = 'Red Howl', category, style, price, location, color }) {
	const c = displayLabel(category || '');
	const s = style ? `${displayLabel(style)} ` : '';
	const l = location ? ` in ${displayLabel(location)}` : '';
	const p = price ? ` Under ₹${price}` : '';
	const col = color ? ` ${displayLabel(color)}` : '';
	return `${s}${c}${col}${p}${l} | Hand Painted & Kalamkari | ${brand}`;
}

export function buildDescription({ category, style, price, location, color }) {
	const c = displayLabel(category || '');
	const s = style ? `${displayLabel(style)} ` : '';
	const l = location ? ` in ${displayLabel(location)}` : '';
	const p = price ? ` under ₹${price}` : '';
	const col = color ? ` ${displayLabel(color)}` : '';
	return `Explore ${s}${c}${col}${p}${l}. Premium hand painted apparel including Kalamkari. Free consultations, custom designs, fast delivery across ${displayLabel(location || 'Bangalore')}.`;
}

export function buildContent({ category, style, price, location, shopUrl, title, description, canonical, color }) {
	const h1 = title.replace(/ \| Hand Painted & Kalamkari .*$/, '');
	const intro = `${description} Discover curated picks, sizing guidance, and care tips below. You’ll be redirected to our shop filters automatically.`;
	const points = [
		'Authentic hand-painted craftsmanship',
		'Kalamkari and traditional techniques available',
		`Curated picks${price ? ` under ₹${price}` : ''}${location ? ` for ${displayLabel(location)}` : ''}${color ? ` in ${displayLabel(color)}` : ''}`,
		'Secure checkout and easy returns',
		'Made in India, shipped fast'
	];
	const faq = [
		{ q: 'Do you deliver in my area?', a: `Yes, we ship across Karnataka and pan-India, including ${displayLabel(location || 'Bangalore')}.` },
		{ q: 'Can I customize designs?', a: 'Absolutely. We offer custom artwork, text, and colorways on request.' },
		{ q: 'What sizes are available?', a: 'We stock standard sizes and offer tailored adjustments for select items.' }
	];
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: h1,
		description,
		url: canonical,
		isPartOf: { '@type': 'WebSite', name: 'Red Howl', url: 'https://www.kalamkar.art' },
		about: ['Hand Painted', 'Kalamkari', displayLabel(category || ''), displayLabel(style || ''), displayLabel(location || ''), displayLabel(color || '')].filter(Boolean),
		potentialAction: {
			'@type': 'SearchAction',
			target: `${canonical}{?q}`,
			'query-input': 'required name=q'
		}
	};

	const breadcrumbs = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.kalamkar.art/' },
			{ '@type': 'ListItem', position: 2, name: displayLabel(category || 'Shop'), item: `https://www.kalamkar.art/shop?category=${encodeURIComponent(category || '')}` },
			style ? { '@type': 'ListItem', position: 3, name: displayLabel(style), item: canonical } : null
		].filter(Boolean)
	};

	const relatedLinks = [];
	if (price) {
		relatedLinks.push({ href: buildShopUrl({ category, style, price: Math.max(price - 500, 500), location }), label: `Under ₹${Math.max(price - 500, 500)}` });
		relatedLinks.push({ href: buildShopUrl({ category, style, price: Math.min(price + 500, price + 500), location }), label: `Under ₹${price + 500}` });
	}
	LOCATIONS.slice(0, 5).forEach((loc) => {
		relatedLinks.push({ href: buildShopUrl({ category, style, price, location: loc, color }), label: `${displayLabel(category)} in ${displayLabel(loc)}` });
	});

	return { h1, intro, points, faq, schema, breadcrumbs, relatedLinks };
}


