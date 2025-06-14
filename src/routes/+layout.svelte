<script lang="ts">
	import '../app.postcss';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
	<Header />

	<div class="flex flex-1">
		<div class="hidden lg:block w-64 bg-white shadow-sm">
			<Sidebar />
		</div>

		<main class="flex-1 px-4 py-8 max-w-none">
			<slot />
		</main>
	</div>

	<Footer />
</div>
