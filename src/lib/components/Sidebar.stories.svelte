<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import Sidebar from './Sidebar.svelte';
</script>

<Meta title="Layout/Sidebar" component={Sidebar} />

<Story name="Default">
	<div class="w-64 h-screen bg-gray-50 border-r">
		<Sidebar />
	</div>
</Story>

<Story name="Compact">
	<div class="w-48 h-96 bg-gray-50 border-r">
		<Sidebar />
	</div>
</Story>
