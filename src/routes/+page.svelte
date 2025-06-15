<script lang="ts">
</script>

<svelte:head>
	<title>ダッシュボード - nempy</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">ダッシュボード</h1>
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
