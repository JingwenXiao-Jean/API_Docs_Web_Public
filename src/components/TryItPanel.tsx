import React, { useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { Send } from "@mui/icons-material";

const TryItPanel = ({ endpoint }: { endpoint: any }) => {
	const [requestBody, setRequestBody] = useState(endpoint.examples?.request || "{}");
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSend = async () => {
		setLoading(true);
		setResponse(""); // 清空旧结果

		// 模拟网络延迟
		setTimeout(() => {
			const fakeResponse = endpoint.examples?.response || "{ \"message\": \"No example response provided\" }";
			setResponse(fakeResponse);
			setLoading(false);
		}, 1000); // 模拟 1 秒延迟
	};

	return (
		<Box sx={{ backgroundColor: "#0f172a", color: "#f8fafc", borderRadius: "8px", p: 2 }}>
			{/* Request Editor */}
			<Typography sx={{ mb: 1, fontWeight: 600 }}>Request</Typography>
			<TextField
				multiline
				minRows={4}
				fullWidth
				value={requestBody}
				onChange={(e) => setRequestBody(e.target.value)}
				sx={{
					mb: 2,
					"& textarea": { fontFamily: "monospace", color: "#f8fafc" },
					backgroundColor: "#1e293b",
					borderRadius: "6px"
				}}
			/>
			<Button
				fullWidth
				variant="contained"
				startIcon={<Send />}
				sx={{ backgroundColor: "#3b82f6" }}
				onClick={handleSend}
				disabled={loading}
			>
				{loading ? "Sending..." : "Try it"}
			</Button>

			{/* Response Viewer */}
			<Typography sx={{ mt: 2, mb: 1, fontWeight: 600 }}>Response</Typography>
			<Box
				sx={{
					backgroundColor: "#1e293b",
					p: 2,
					borderRadius: "6px",
					whiteSpace: "pre-wrap",
					minHeight: "100px",
					display: "flex",
					alignItems: "center",
					justifyContent: loading ? "center" : "flex-start"
				}}
			>
				{loading ? <CircularProgress size={24} sx={{ color: "#3b82f6" }} /> : (response || "(Click Try it to see response)")}
			</Box>
		</Box>
	);
};

export default TryItPanel;
