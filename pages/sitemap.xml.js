export async function getServerSideProps({ res }) {
	const baseUrl = 'https://redhowlcollections.netlify.app';
	const staticUrls = [
		'/',
		'/shop',
		'/about',
		'/contact',
		// Red Howl Brand Pages
		'/brand/red-howl/sarees/kota-doria/under-1500/basavanagudi',
		'/brand/red-howl/jackets/denim/under-500/bangalore',
		'/brand/red-howl/shirts/hand-painted/under-800/mumbai',
		'/brand/red-howl/tshirts/normal/under-400/delhi',
		'/brand/red-howl/kurtas/designer/under-1200/chennai',
		'/brand/red-howl/blouses/embroidered/under-600/hyderabad',
		'/brand/red-howl/handbags/leather/under-1000/pune',
		'/brand/red-howl/shoes/casual/under-800/kolkata',
		// Blog SEO Pages - Shirts
		'/blog/shirts/hand-painted/under-500/bangalore',
		'/blog/shirts/normal/under-300/mumbai',
		'/blog/tshirts/hand-painted/under-400/delhi',
		'/blog/tshirts/normal/under-250/chennai',
		// Blog SEO Pages - Jackets & Outerwear
		'/blog/jackets/denim/under-500/bangalore',
		'/blog/jackets/hand-painted/under-800/mumbai',
		'/blog/jackets/male/under-600/delhi',
		'/blog/jackets/female/under-700/chennai',
		// Blog SEO Pages - Sarees
		'/blog/sarees/pattu/under-2000/mumbai',
		'/blog/sarees/kalamkari/under-1500/delhi',
		'/blog/sarees/banjara/under-1800/chennai',
		'/blog/sarees/hand-painted/under-2200/bangalore',
		// Blog SEO Pages - Other Clothing
		'/blog/kurtas/designer/under-1000/mumbai',
		'/blog/blouses/embroidered/under-500/delhi',
		'/blog/handbags/leather/under-800/chennai',
		'/blog/shoes/casual/under-600/bangalore'
	];

	const urls = staticUrls
		.map((u) => `<url><loc>${baseUrl}${u}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`) 
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${urls}
		</urlset>`;

	res.setHeader('Content-Type', 'application/xml');
	res.write(xml);
	res.end();

	return { props: {} };
}

export default function Sitemap() {
	return null;
}


