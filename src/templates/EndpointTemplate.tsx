import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
	Box,
	Typography,
	Chip,
	Tooltip,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Paper,
	CircularProgress,
	Collapse,
	Button
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TryItPanel from "../components/TryItPanel";

const EndpointTemplate = ({ pageContext }: { pageContext: { id: string } }) => {
	const { id } = pageContext;
	const [endpoint, setEndpoint] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		fetch("/api-docs.json")
			.then((res) => res.json())
			.then((data) => {
				const ep = data.endpoints.find((e: any) => e.id === id);
				setEndpoint(ep);
				setLoading(false);
			});
	}, [id]);

	const handleCopy = () => {
		if (!endpoint) return;
		navigator.clipboard.writeText(endpoint.path);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	/**  JSON 视图组件 */
	const JsonViewer = ({ data }: { data: Record<string, any> }) => {
		const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});
		const toggle = (key: string) =>
			setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));

		return (
			<Box sx={{ width: "100%" }}>
				{Object.entries(data).map(([key, value]) => {
					if (typeof value === "object" && value !== null) {
						const displayValue = Array.isArray(value) && value.length > 0 ? value[0] : value;

						return (
							<Box
								key={key}
								sx={{
									py: 1,
									borderBottom: "1px solid rgba(255,255,255,0.08)"
								}}
							>
								{/* 主行 */}
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center"
									}}
								>
									<Box sx={{ color: "#38bdf8", fontWeight: 600 }}>{key}</Box>
									<Button
										size="small"
										onClick={() => toggle(key)}
										sx={{
											color: "#38bdf8",
											textTransform: "none",
											"&:hover": { color: "#0ea5e9" }
										}}
										startIcon={openKeys[key] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
									>
										{openKeys[key]
											? "Hide properties"
											: `Show ${Object.keys(displayValue).length} properties`}
									</Button>
								</Box>

								{/* 展开部分 */}
								<Collapse in={openKeys[key]} timeout="auto" unmountOnExit sx={{ width: "100%", mt: 1 }}>
									<Box
										sx={{
											width: "100%",
											backgroundColor: "#1e293b",
											borderRadius: "8px",
											p: 2,
											display: "flex",
											flexDirection: "column",
											gap: 1
										}}
									>
										{Object.entries(displayValue).map(([subKey, subValue]) => (
											<Box
												key={subKey}
												sx={{
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center",
													py: 1,
													px: 2,
													borderBottom: "1px solid rgba(255,255,255,0.08)",
													"&:last-child": { borderBottom: "none" }
												}}
											>
												<Box sx={{ color: "#38bdf8", fontWeight: 600 }}>{subKey}</Box>
												<Box sx={{ color: "#f8fafc", fontWeight: 500 }}>{String(subValue)}</Box>
											</Box>
										))}
									</Box>
								</Collapse>
							</Box>
						);
					} else {
						return (
							<Box
								key={key}
								sx={{
									display: "flex",
									justifyContent: "space-between",
									py: 1,
									px: 2,
									borderBottom: "1px solid rgba(255,255,255,0.08)"
								}}
							>
								<Box sx={{ color: "#38bdf8", fontWeight: 500 }}>{key}</Box>
								<Box sx={{ color: "#f8fafc" }}>{String(value)}</Box>
							</Box>
						);
					}
				})}
			</Box>
		);
	};

	/**  渲染 JSON */
	const renderJsonAsBox = (jsonStr: string) => {
		if (!jsonStr) return <Typography sx={{ color: "#94a3b8" }}>No data</Typography>;
		let parsed: Record<string, any>;
		try {
			parsed = JSON.parse(jsonStr);
		} catch {
			return <Typography color="error">Invalid JSON format</Typography>;
		}

		return (
			<Box
				sx={{
					backgroundColor: "#0f172a",
					color: "#f1f5f9",
					borderRadius: "8px",
					p: 2,
					mb: 4
				}}
			>
				<JsonViewer data={parsed} />
			</Box>
		);
	};

	if (loading) {
		return (
			<Layout>
				<Box sx={{ textAlign: "center", mt: 10 }}>
					<CircularProgress sx={{ color: "#38bdf8" }} />
				</Box>
			</Layout>
		);
	}

	if (!endpoint) {
		return (
			<Layout>
				<Box sx={{ textAlign: "center", mt: 10 }}>
					<Typography color="error">Endpoint not found</Typography>
				</Box>
			</Layout>
		);
	}

	return (
		<Layout>
			<Box sx={{ display: "flex", gap: 4 }}>
				{/* 左侧内容 */}
				<Box sx={{ flex: 1, p: 4 }}>
					{/* 顶部 Header */}
					<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
						<Chip
							label={endpoint.method}
							sx={{
								fontWeight: 700,
								textTransform: "uppercase",
								background:
									endpoint.method === "GET"
										? "#3b82f6"
										: endpoint.method === "POST"
											? "#10b981"
											: endpoint.method === "PUT"
												? "#f59e0b"
												: "#ef4444",
								color: "#fff"
							}}
						/>
						<Typography sx={{ ml: 2, fontFamily: "monospace", fontSize: "1.1rem" }}>
							{endpoint.path}
						</Typography>
						<Tooltip title={copied ? "Copied!" : "Copy"}>
							<IconButton onClick={handleCopy} sx={{ color: copied ? "#10b981" : "#94a3b8", ml: 1 }}>
								{copied ? <CheckIcon /> : <ContentCopyIcon />}
							</IconButton>
						</Tooltip>
					</Box>

					<Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
						{endpoint.title}
					</Typography>
					<Typography sx={{ color: "#94a3b8", mb: 4 }}>{endpoint.description}</Typography>

					{/* Request Parameters */}
					<Typography variant="h6" sx={{ mb: 2 }}>
						Request Parameters
					</Typography>
					<TableContainer
						component={Paper}
						sx={{
							mb: 4,
							backgroundColor: "#0f172a",
							borderRadius: "8px",
							overflow: "hidden"
						}}
					>
						<Table size="small">
							<thead>
								<TableRow sx={{ backgroundColor: "#1e293b" }}>
									<TableCell sx={{ color: "#f8fafc", fontWeight: 700 }}>Name</TableCell>
									<TableCell sx={{ color: "#f8fafc", fontWeight: 700 }}>Type</TableCell>
									<TableCell sx={{ color: "#f8fafc", fontWeight: 700 }}>Required</TableCell>
									<TableCell sx={{ color: "#f8fafc", fontWeight: 700 }}>Description</TableCell>
								</TableRow>
							</thead>
							<TableBody>
								{endpoint.parameters.length > 0 ? (
									endpoint.parameters.map((p: any) => (
										<TableRow
											key={p.name}
											sx={{ cursor: "pointer", "&:hover td": { color: "#38bdf8" } }}
										>
											<TableCell sx={{ color: "#f1f5f9", fontWeight: 600 }}>{p.name}</TableCell>
											<TableCell sx={{ color: "#38bdf8", fontFamily: "monospace" }}>{p.type}</TableCell>
											<TableCell sx={{ color: p.required ? "#ef4444" : "#10b981", fontWeight: 700 }}>
												{p.required ? "Yes" : "No"}
											</TableCell>
											<TableCell sx={{ color: "#94a3b8" }}>{p.description}</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={4} sx={{ textAlign: "center", color: "#94a3b8" }}>
											No parameters
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>

					{/* Example Request */}
					<Typography variant="h6" sx={{ mb: 1 }}>
						Example Request
					</Typography>
					{renderJsonAsBox(endpoint.examples.request)}

					{/* Example Response */}
					<Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
						Example Response
					</Typography>
					{renderJsonAsBox(endpoint.examples.response)}
				</Box>

				{/* 右侧悬浮 Try It */}
				<Box sx={{ width: "30%", position: "sticky", top: 80 }}>
					<TryItPanel endpoint={endpoint} />
				</Box>
			</Box>
		</Layout>
	);
};

export default EndpointTemplate;
