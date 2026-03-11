import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
	{
		ignores: ['public/**'],
	},
	...coreWebVitals,
	...typescript,
];

export default config;