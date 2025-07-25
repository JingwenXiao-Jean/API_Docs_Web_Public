import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Box, Typography, IconButton, Switch, CircularProgress } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import useStores from '../hooks/use-stores';
// 例如： export const useStore = () => React.useContext(RootStoreContext);

const Layout: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
    const { documentStore } = useStores();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [darkMode, setDarkMode] = React.useState(true);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    // 初始化加载 Tree + Endpoints
    useEffect(() => {
		documentStore.fetchEndpoints();
	}, [documentStore]);

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
                {documentStore.loading ? (
                    <Box sx={{ p: 4, color: "#94a3b8", textAlign: "center" }}>
                        <CircularProgress size={24} sx={{ color: "#38bdf8" }} />
                    </Box>
                ) : (
                    <Sidebar tree={documentStore.tree || []} darkMode={darkMode} />
                )}
            </Box>

            {/* 移动端 Drawer 可选（如需要可恢复） */}
            {/* <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: 260 } }}
            >
                {documentStore.loading ? (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <CircularProgress size={24} sx={{ color: "#38bdf8" }} />
                    </Box>
                ) : (
                    <Sidebar tree={documentStore.tree || []} darkMode={darkMode} />
                )}
            </Drawer> */}

            {/* Main Content */}
            <Box sx={{ flex: 1, p: 4, mt: 8, color: darkMode ? "#e2e8f0" : "#334155" }}>
                {children}
            </Box>
        </Box>
    );
});

export default Layout;
