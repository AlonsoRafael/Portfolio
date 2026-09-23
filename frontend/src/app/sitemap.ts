import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://alonsotech.vercel.app"
	const currentDate = new Date()

	return [
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/projeto`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/experiencia`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.8,
		},
	]
}
