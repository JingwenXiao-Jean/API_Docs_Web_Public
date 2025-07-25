import React from "react";
import Layout from "../components/Layout";
import { Typography, Box } from "@mui/material";

const IndexPage = () => (
	<Layout>
		<Box sx={{ textAlign: "center", mt: 20 }}>
			<Typography variant="h3" sx={{ fontWeight: 700 }}>Welcome to API Documentation</Typography>
			<Typography sx={{ mt: 2, color: "#94a3b8" }}>Select an API from the sidebar to view details</Typography>
		</Box>
	</Layout>
);

export default IndexPage;
