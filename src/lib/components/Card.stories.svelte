<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import Card from './Card.svelte';
</script>

<Meta title="Components/Card" component={Card} />

<Story name="Default">
	<Card title="Default Card" subtitle="This is a default card">
		<p>This is the card content. You can put any content here.</p>
	</Card>
</Story>

<Story name="Outlined">
	<Card title="Outlined Card" subtitle="This is an outlined card" variant="outlined">
		<p>This card has an outlined border style.</p>
	</Card>
</Story>

<Story name="Filled">
	<Card title="Filled Card" subtitle="This is a filled card" variant="filled">
		<p>This card has a filled background style.</p>
	</Card>
</Story>

<Story name="With Hover">
	<Card title="Hover Card" subtitle="This card has hover effects" hover={true}>
		<p>Hover over this card to see the effect.</p>
	</Card>
</Story>

<Story name="Large Padding">
	<Card title="Large Card" subtitle="This card has large padding" padding="lg">
		<p>This card uses large padding for more spacious content.</p>
	</Card>
</Story>

<Story name="Without Header">
	<Card>
		<div class="text-center">
			<h4 class="text-xl font-bold mb-2">Custom Content</h4>
			<p>This card doesn't use the title/subtitle props.</p>
		</div>
	</Card>
</Story>
