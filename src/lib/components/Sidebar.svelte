<script lang="ts">
	import { page } from '$app/stores';

	$: currentPath = $page.url.pathname;

	const navigationItems = [
		{ href: '/', label: 'ダッシュボード', icon: '📊' },
		{ href: '/vehicles', label: '車両管理', icon: '🚗' },
		{ href: '/fuel-records', label: '給油記録', icon: '⛽' },
		{ href: '/settings', label: '設定', icon: '⚙️' }
	];
</script>

<nav class="p-4 h-full">
	<ul class="space-y-2">
		{#each navigationItems as item}
			<li>
				<a
					href={item.href}
					class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 {currentPath === item.href ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' : 'text-gray-700'}"
				>
					<span class="text-xl">{item.icon}</span>
					<span class="font-medium">{item.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>