import React from "react";

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
	return (
		<pre
			style={{
				background: "#0f172a",
				color: "#f8fafc",
				padding: "16px",
				borderRadius: "8px",
				overflowX: "auto"
			}}
		>
			<code>{code}</code>
		</pre>
	);
};

export default CodeBlock;
