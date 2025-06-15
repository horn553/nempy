<script lang="ts">
	export let title: string = '';
	export let subtitle: string = '';
	export let variant: 'default' | 'outlined' | 'filled' = 'default';
	export let hover: boolean = false;
	export let padding: 'sm' | 'md' | 'lg' = 'md';

	const paddingClasses = {
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6'
	};

	const variantClasses = {
		default: 'bg-white border border-gray-200 shadow-sm',
		outlined: 'bg-transparent border-2 border-gray-300',
		filled: 'bg-gray-50 border border-gray-100'
	};

	$: hoverClasses = hover
		? 'hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer'
		: '';
</script>

<div class="rounded-lg {variantClasses[variant]} {paddingClasses[padding]} {hoverClasses}">
	{#if title || subtitle}
		<div class="mb-3">
			{#if title}
				<h3 class="text-lg font-semibold text-gray-900">{title}</h3>
			{/if}
			{#if subtitle}
				<p class="text-sm text-gray-600 mt-1">{subtitle}</p>
			{/if}
		</div>
	{/if}

	<div class="text-gray-700">
		<slot />
	</div>
</div>
