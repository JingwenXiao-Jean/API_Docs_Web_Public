import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CodeBlock from './CodeBlock';

type ApiDetailProps = {
	endpoint: {
		title: string;
		description: string;
		method: string;
		path: string;
		parameters: { name: string; type: string; required: boolean }[];
		examples: { request: string; response: string };
	} | null;
};

const ApiDetail: React.FC<ApiDetailProps> = ({ endpoint }) => {
	if (!endpoint) return <Box className="p-6">Select an API endpoint</Box>;

	return (
		<Box className="flex-1 p-6 overflow-y-auto">
			<Typography variant="h4" gutterBottom>{endpoint.title}</Typography>
			<Typography variant="body1" color="text.secondary" gutterBottom>{endpoint.description}</Typography>
			<Box className="bg-gray-100 p-4 rounded my-4 font-mono">
				<strong>{endpoint.method}</strong> {endpoint.path}
			</Box>
			<Typography variant="h6" gutterBottom>Parameters</Typography>
			<ul className="mb-4">
				{endpoint.parameters.map((param) => (
					<li key={param.name} className="text-gray-700">
						<code>{param.name}</code> ({param.type}) {param.required && <span className="text-red-500">required</span>}
					</li>
				))}
			</ul>
			<Typography variant="h6" gutterBottom>Examples</Typography>
			<Typography variant="subtitle1">Request</Typography>
			<CodeBlock code={endpoint.examples.request} language="json" />
			<Typography variant="subtitle1">Response</Typography>
			<CodeBlock code={endpoint.examples.response} language="json" />
		</Box>
	);
};

export default ApiDetail;
