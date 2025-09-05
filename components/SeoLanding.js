import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function SeoLanding({ seo, shopUrl, content }) {
	const router = useRouter();

	useEffect(() => {
		router.replace(shopUrl);
	}, [shopUrl, router]);

	return (
		<>
			<Head>
				<title>{seo.title}</title>
				<meta name="description" content={seo.description} />
				<link rel="canonical" href={seo.canonical} />
				{seo.og && (
					<>
						<meta property="og:title" content={seo.og.title} />
						<meta property="og:description" content={seo.og.description} />
						<meta property="og:type" content="article" />
						<meta property="og:url" content={seo.canonical} />
					</>
				)}
				{content?.schema && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify(content.schema) }}
					/>
				)}
				{content?.breadcrumbs && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify(content.breadcrumbs) }}
					/>
				)}
				<meta name="robots" content="index,follow" />
			</Head>

			<main style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem' }}>
				<h1 style={{ margin: 0, fontSize: '2rem' }}>{content.h1}</h1>
				<p style={{ marginTop: '0.75rem', lineHeight: 1.7 }}>{content.intro}</p>

				<section style={{ marginTop: '1.25rem', lineHeight: 1.8 }}>
					<h2 style={{ fontSize: '1.25rem' }}>Why choose us</h2>
					<ul>
						{content.points.map((pt) => (
							<li key={pt}>{pt}</li>
						))}
					</ul>
				</section>

				{content.relatedLinks?.length ? (
					<section style={{ marginTop: '1.25rem' }}>
						<h2 style={{ fontSize: '1.25rem' }}>Explore related</h2>
						<ul>
							{content.relatedLinks.map((rl) => (
								<li key={rl.href}>
									<a href={rl.href}>{rl.label}</a>
								</li>
							))}
						</ul>
					</section>
				) : null}

				<section style={{ marginTop: '1.25rem' }}>
					<h2 style={{ fontSize: '1.25rem' }}>Popular questions</h2>
					{content.faq.map((f) => (
						<details key={f.q} style={{ margin: '0.5rem 0' }}>
							<summary>{f.q}</summary>
							<div style={{ marginTop: '0.5rem' }}>{f.a}</div>
						</details>
					))}
				</section>

				<noscript>
					<p>
						Continue to our shop: <a href={shopUrl} rel="nofollow">{shopUrl}</a>
					</p>
				</noscript>
			</main>
		</>
	);
}


