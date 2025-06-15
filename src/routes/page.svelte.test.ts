import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

// Mock the $app/stores module
vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn((callback) => {
			callback({
				data: { user: null }
			});
			return () => {};
		})
	}
}));

describe('/+page.svelte', () => {
	test('should render h1 for unauthenticated user', () => {
		render(Page);
		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
		expect(screen.getByText('nempy')).toBeInTheDocument();
	});
});
