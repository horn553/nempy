<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import Footer from './Footer.svelte';
</script>

<Meta title="Layout/Footer" component={Footer} />

<Story name="Default">
	<Footer />
</Story>

<Story name="Mobile View">
	<div class="max-w-sm">
		<Footer />
	</div>
</Story>
