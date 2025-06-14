<script lang="ts">
	let mobileMenuOpen = false;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<header class="bg-white shadow-sm border-b">
	<div class="px-4 py-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<button class="lg:hidden p-2 rounded-md hover:bg-gray-100" on:click={toggleMobileMenu}>
					<span class="text-xl">☰</span>
				</button>
				<div class="text-2xl font-bold text-blue-500">⛽</div>
				<h1 class="text-xl font-semibold">nempy</h1>
			</div>
			<div class="flex items-center gap-4">
				<!-- Add authentication buttons here later -->
			</div>
		</div>
	</div>
</header>

{#if mobileMenuOpen}
	<div class="lg:hidden bg-white border-b shadow-sm">
		<nav class="px-4 py-2">
			<div class="space-y-1">
				<a href="/" class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
					ダッシュボード
				</a>
				<a href="/vehicles" class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
					車両管理
				</a>
				<a href="/fuel-records" class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
					給油記録
				</a>
				<a href="/settings" class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
					設定
				</a>
			</div>
		</nav>
	</div>
{/if}