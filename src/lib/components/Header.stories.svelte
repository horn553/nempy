<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import Header from './Header.svelte';
</script>

<Meta title="Layout/Header" component={Header} />

<Story name="Default">
	<Header />
</Story>

<Story name="Mobile View">
	<div class="max-w-sm">
		<Header />
	</div>
</Story>
