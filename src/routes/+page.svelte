<script lang="ts">
	import { page } from '$app/stores';
	
	$: user = $page.data.user;
</script>

<svelte:head>
	<title>nempy - 燃費管理アプリ</title>
	<meta name="description" content="車の燃費を効率的に管理するアプリケーション" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	{#if user}
		<!-- Authenticated user dashboard -->
		<header class="bg-white shadow-sm border-b">
			<div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
				<h1 class="text-2xl font-bold text-gray-900">nempy</h1>
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
		</header>
		
		<main class="max-w-7xl mx-auto px-4 py-8">
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<!-- Dashboard cards -->
				<div class="bg-white p-6 rounded-lg shadow-sm border">
					<h2 class="text-lg font-semibold text-gray-900 mb-2">車両管理</h2>
					<p class="text-gray-600 mb-4">登録済みの車両を管理します</p>
					<button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
						車両を管理
					</button>
				</div>
				
				<div class="bg-white p-6 rounded-lg shadow-sm border">
					<h2 class="text-lg font-semibold text-gray-900 mb-2">給油記録</h2>
					<p class="text-gray-600 mb-4">給油履歴を記録・確認します</p>
					<button class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
						給油記録を追加
					</button>
				</div>
				
				<div class="bg-white p-6 rounded-lg shadow-sm border">
					<h2 class="text-lg font-semibold text-gray-900 mb-2">燃費統計</h2>
					<p class="text-gray-600 mb-4">燃費データを分析します</p>
					<button class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
						統計を確認
					</button>
				</div>
			</div>
			
			<div class="mt-8 bg-white p-6 rounded-lg shadow-sm border">
				<h2 class="text-xl font-semibold text-gray-900 mb-4">最近の活動</h2>
				<p class="text-gray-500">まだ活動がありません。車両を登録して給油記録を追加してみましょう。</p>
			</div>
		</main>
	{:else}
		<!-- Unauthenticated landing page -->
		<div class="flex min-h-screen items-center justify-center">
			<div class="max-w-2xl mx-auto text-center px-4">
				<h1 class="text-5xl font-bold text-gray-900 mb-6">nempy</h1>
				<p class="text-xl text-gray-600 mb-8">
					車の燃費を効率的に管理するアプリケーション
				</p>
				<div class="space-y-4 mb-8">
					<div class="flex items-center justify-center space-x-2 text-gray-700">
						<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
						</svg>
						<span>給油記録の管理</span>
					</div>
					<div class="flex items-center justify-center space-x-2 text-gray-700">
						<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
						</svg>
						<span>燃費の分析・統計</span>
					</div>
					<div class="flex items-center justify-center space-x-2 text-gray-700">
						<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
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
</div>
