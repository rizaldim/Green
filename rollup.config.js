import resolve from '@rollup/plugin-node-resolve';

export default {
	input: 'src/js/index.js',
	output: {
		file: 'dist/js/index.js',
		format: 'iife'
	},
	plugins: [resolve()]
}
