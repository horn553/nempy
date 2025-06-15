<script lang="ts">
	import { page } from '$app/stores';

	$: user = $page.data.user;
</script>

<svelte:head>
	<title>{user ? 'ダッシュボード' : 'nempy - 燃費管理アプリ'}</title>
	{#if !user}
		<meta name="description" content="車の燃費を効率的に管理するアプリケーション" />
	{/if}
</svelte:head>

{#if user}
	<!-- Authenticated user dashboard -->
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">ダッシュボード</h1>
			<div class="flex items-center space-x-4">
				<div class="flex items-center space-x-2">
					{#if user.picture}
						<img src={user.picture} alt={user.name} class="w-8 h-8 rounded-full" />
					{/if}
					<span class="text-gray-700">{user.name}</span>
				</div>
				<form action="/auth/logout" method="POST">
					<button
						type="submit"
						class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
					>
						ログアウト
					</button>
				</form>
			</div>
		</div>

		<!-- Quick Stats -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="card p-6">
				<div class="flex items-center gap-4">
					<div class="text-3xl">🚗</div>
					<div>
						<h3 class="text-2xl font-bold">3</h3>
						<p class="text-gray-500">登録車両数</p>
					</div>
				</div>
			</div>

			<div class="card p-6">
				<div class="flex items-center gap-4">
					<div class="text-3xl">⛽</div>
					<div>
						<h3 class="text-2xl font-bold">12</h3>
						<p class="text-gray-500">今月の給油回数</p>
					</div>
				</div>
			</div>

			<div class="card p-6">
				<div class="flex items-center gap-4">
					<div class="text-3xl">📊</div>
					<div>
						<h3 class="text-2xl font-bold">15.2</h3>
						<p class="text-gray-500">平均燃費 (km/L)</p>
					</div>
				</div>
			</div>

			<div class="card p-6">
				<div class="flex items-center gap-4">
					<div class="text-3xl">💰</div>
					<div>
						<h3 class="text-2xl font-bold">¥42,500</h3>
						<p class="text-gray-500">今月の燃料費</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div class="card p-6">
				<h2 class="text-xl font-semibold mb-4">最近の給油記録</h2>
				<div class="space-y-4">
					<div class="flex items-center justify-between border-b border-gray-200 pb-3">
						<div>
							<p class="font-medium">トヨタ プリウス</p>
							<p class="text-sm text-gray-500">2024/06/14 - エネオス新宿店</p>
						</div>
						<div class="text-right">
							<p class="font-bold">¥6,800</p>
							<p class="text-sm text-gray-500">40L</p>
						</div>
					</div>
					<div class="flex items-center justify-between border-b border-gray-200 pb-3">
						<div>
							<p class="font-medium">ホンダ フィット</p>
							<p class="text-sm text-gray-500">2024/06/12 - 出光渋谷店</p>
						</div>
						<div class="text-right">
							<p class="font-bold">¥4,200</p>
							<p class="text-sm text-gray-500">28L</p>
						</div>
					</div>
				</div>
			</div>

			<div class="card p-6">
				<h2 class="text-xl font-semibold mb-4">燃費トレンド</h2>
				<div class="h-48 flex items-center justify-center bg-gray-100 rounded-lg">
					<p class="text-gray-500">グラフコンポーネントは後で実装</p>
				</div>
			</div>
		</div>
	</div>
{:else}
	<!-- Unauthenticated landing page -->
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<div class="max-w-2xl mx-auto text-center px-4">
			<h1 class="text-5xl font-bold text-gray-900 mb-6">nempy</h1>
			<p class="text-xl text-gray-600 mb-8">車の燃費を効率的に管理するアプリケーション</p>
			<div class="space-y-4 mb-8">
				<div class="flex items-center justify-center space-x-2 text-gray-700">
					<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
					<span>給油記録の管理</span>
				</div>
				<div class="flex items-center justify-center space-x-2 text-gray-700">
					<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
					<span>燃費の分析・統計</span>
				</div>
				<div class="flex items-center justify-center space-x-2 text-gray-700">
					<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
					<span>車両の共有機能</span>
				</div>
			</div>
			<a
				href="/login"
				class="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
			>
				今すぐ始める
			</a>
		</div>
	</div>
{/if}
