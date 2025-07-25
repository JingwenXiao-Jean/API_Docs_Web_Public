import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Drawer, Switch, CircularProgress } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [darkMode, setDarkMode] = useState(true);
	const [loading, setLoading] = useState(true);
	const [navData, setNavData] = useState<{ tree: any[]; endpoints: any[] }>({ tree: [], endpoints: [] });

	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

	useEffect(() => {
		const apiUrl =
			process.env.GATSBY_USE_REMOTE_API === "true"
				? "http://your-backend-server/api/docs"
				: "/api-docs.json";

		fetch(apiUrl)
			.then((res) => res.json())
			.then((data) => {
				setNavData(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Failed to load API docs:", error);
				setLoading(false);
			});
	}, []);


	return (
		<Box sx={{ display: "flex", minHeight: "100vh", background: darkMode ? "#0f172a" : "#f8fafc" }}>
			{/* Topbar */}
			<Box
				sx={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					height: 64,
					background: darkMode ? "rgba(15,23,42,0.9)" : "#fff",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					px: 3,
					zIndex: 1000
				}}
			>
				<IconButton onClick={handleDrawerToggle} sx={{ color: "#94a3b8", display: { sm: "none" } }}>
					<MenuIcon />
				</IconButton>
				<Typography sx={{ fontWeight: 700, color: darkMode ? "#38bdf8" : "#1e3a8a" }}>API Docs</Typography>
				<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
			</Box>

			{/* Sidebar */}
			<Box sx={{ width: 260, display: { xs: "none", sm: "block" }, mt: 8 }}>
				{loading ? (
					<Box sx={{ p: 4, color: "#94a3b8", textAlign: "center" }}>
						<CircularProgress size={24} sx={{ color: "#38bdf8" }} />
					</Box>
				) : (
					<Sidebar tree={navData?.tree || []} darkMode={darkMode} />
				)}
			</Box>

			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: 260 } }}
			>
				{loading ? (
					<Box sx={{ p: 4, textAlign: "center" }}>
						<CircularProgress size={24} sx={{ color: "#38bdf8" }} />
					</Box>
				) : (
					<Sidebar tree={navData?.tree || []} darkMode={darkMode} />
				)}
			</Drawer>

			{/* Main Content */}
			<Box sx={{ flex: 1, p: 4, mt: 8, color: darkMode ? "#e2e8f0" : "#334155" }}>
				{children}
			</Box>
		</Box>
	);
};

export default Layout;
