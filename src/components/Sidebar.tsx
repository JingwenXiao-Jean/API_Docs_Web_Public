import React, { useState } from "react";
import { Box, List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link } from "gatsby";

const Sidebar = ({ tree, darkMode }: { tree: any[]; darkMode: boolean }) => {
	const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});
	const [selectedId, setSelectedId] = useState<string>("");

	const toggleNode = (id: string) =>
		setOpenNodes((prev) => ({ ...prev, [id]: !prev[id] }));

	const renderTree = (nodes: any[], depth = 0) => (
		<List disablePadding>
			{nodes.map((node) => {
				const hasChildren = node.children && node.children.length > 0;
				const endpointId = node.endPointId; 

				return (
					<Box key={node.id} sx={{ ml: depth * 1, mb: 0.5 }}>
						<ListItemButton
							onClick={() => {
								if (hasChildren) {
									toggleNode(node.id);
								} else if (endpointId) {
									setSelectedId(endpointId);
								}
							}}
							component={endpointId ? Link : "div"}
							to={endpointId ? `/endpoint/${endpointId}` : undefined}
							sx={{
								borderRadius: "6px",
								transition: "color 0.2s ease",
								"&:hover .MuiListItemText-primary": {
									color: "#38bdf8", // hover 改字体颜色
								},
							}}
						>
							<ListItemText
								primary={node.name}
								primaryTypographyProps={{
									fontWeight: selectedId === endpointId ? 700 : 400,
									color:
										selectedId === endpointId
											? "#38bdf8" // 选中高亮
											: darkMode
												? "#f1f5f9"
												: "#111827",
									fontSize: "0.9rem",
								}}
							/>
							{hasChildren && (openNodes[node.id] ? <ExpandLess /> : <ExpandMore />)}
						</ListItemButton>
						{hasChildren && (
							<Collapse in={openNodes[node.id]} timeout="auto" unmountOnExit>
								{renderTree(node.children, depth + 1)}
							</Collapse>
						)}
					</Box>
				);
			})}
		</List>
	);

	return (
		<Box sx={{ width: 280, p: 2 }}>
			{renderTree(tree)}
		</Box>
	);
};

export default Sidebar;
