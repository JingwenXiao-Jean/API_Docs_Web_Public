const path = require("path");
const fetch = require("node-fetch");

exports.createPages = async ({ actions }) => {
	const { createPage } = actions;

	const apiBaseUrl = "http://192.168.15.3:5078/api/APIDoc/Search/≽^•༚• ྀི≼ﾐ🎀・◦・ﾐ♡𝓗𝓮𝓵𝓵𝓸 𝓴𝓲𝓽𝓽𝔂";
	const useRemoteApi = "true";

	let data;

	if (useRemoteApi) {
		console.log(`Fetching API docs from ${apiBaseUrl}...`);
		const response = await fetch(`${apiBaseUrl}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch data from backend: ${response.status}`);
		}
		data = await response.json();
	} else {
		console.log("Using local api-docs.json...");
		const filePath = path.resolve("./static/api-docs.json");
		const rawData = require(filePath);
		data = rawData;
	}

	// Create dynamic pages for each endpoint
	data.endpoints.forEach((endpoint) => {
		createPage({
			path: `/endpoint/${endpoint.id}`,
			component: path.resolve("./src/templates/EndpointTemplate.tsx"),
			context: { id: endpoint.id }
		});
	});
};
