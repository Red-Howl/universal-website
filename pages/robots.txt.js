export async function getServerSideProps({ res }) {
	const lines = [
		'User-agent: *',
		'Allow: /',
		'Sitemap: https://www.kalamkar.art/sitemap.xml'
	];
	res.setHeader('Content-Type', 'text/plain');
	res.write(lines.join('\n'));
	res.end();
	return { props: {} };
}

export default function Robots() { return null; }


