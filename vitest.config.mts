import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		include: ['src/**/*.spec.ts'],
		coverage: {
			enabled: true,
			provider: 'v8',
			include: ['src/**/*.ts'],
			exclude: ['src/**/*.spec.ts', 'src/index.ts'],
			reporter: ['json', 'lcov', 'text', 'clover', 'html'],
		},
	},
});
