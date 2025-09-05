export async function getServerSideProps({ res }) {
	const baseUrl = 'https://redhowlcollections.netlify.app';
	const staticUrls = [
		'/',
		'/shop',
		'/about',
		'/contact',
		'/brand/red-howl/sarees/kota-doria/under-1500/basavanagudi',
		'/brand/red-howl/jackets/denim/under-500/bangalore',
		'/blog/sarees/pattu/under-2000/mumbai',
		'/blog/jackets/denim/under-500/bangalore'
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


