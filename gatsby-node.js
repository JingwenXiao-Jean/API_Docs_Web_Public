const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

exports.createPages = async ({ actions }) => {
	const { createPage } = actions;

	let data;

	if (process.env.USE_REMOTE_API === "true") {
		console.log("Fetching API docs from remote server...");
		const response = await fetch("http://your-backend-server/api/docs");
		data = await response.json();
	} else {
		console.log("Using local api-docs.json...");
		const filePath = path.resolve("./static/api-docs.json");
		const rawData = fs.readFileSync(filePath, "utf-8");
		data = JSON.parse(rawData);
	}

	data.endpoints.forEach((endpoint) => {
		createPage({
			path: `/endpoint/${endpoint.id}`,
			component: path.resolve("./src/templates/EndpointTemplate.tsx"),
			context: { id: endpoint.id }
		});
	});
};
