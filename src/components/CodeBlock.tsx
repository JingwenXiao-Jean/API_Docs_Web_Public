import React, { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // 深色主题
import "prismjs/components/prism-json"; // JSON 高亮

type CodeBlockProps = {
	code: string;
	language?: string;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = "json" }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<Box
			sx={{
				position: "relative",
				backgroundColor: "#0f172a",
				borderRadius: "8px",
				overflow: "hidden",
				padding: "16px",
				fontFamily: "Fira Code, monospace",
				fontSize: "14px",
				color: "#f8fafc",
				border: "1px solid rgba(255, 255, 255, 0.1)"
			}}
		>
			{/* 复制按钮 */}
			<Tooltip title={copied ? "Copied!" : "Copy"}>
				<IconButton
					onClick={handleCopy}
					sx={{
						position: "absolute",
						top: 8,
						right: 8,
						color: copied ? "#10b981" : "#94a3b8"
					}}
				>
					{copied ? <CheckIcon /> : <ContentCopyIcon />}
				</IconButton>
			</Tooltip>

			<pre
				style={{
					margin: 0,
					whiteSpace: "pre-wrap",
					wordBreak: "break-word",
					overflowX: "auto"
				}}
				dangerouslySetInnerHTML={{
					__html: Prism.highlight(code, Prism.languages[language], language)
				}}
			/>
		</Box>
	);
};

export default CodeBlock;
