import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import mdx from '@astrojs/mdx'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeExternalLinks from 'rehype-external-links'

import image from './build/image.js'
import headers from './build/headers.js'
import readingTime from './build/readingTime.js'
import darkFeminineItalic from './src/assets/dark-feminine-italic-color-theme.json'

export default defineConfig({
	site: 'https://cynthia.dev/',
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	integrations: [ image(), mdx() ],
	markdown: {
		syntaxHighlight: 'shiki',
		remarkPlugins: [ readingTime ],
		rehypePlugins: [
			// @ts-expect-error -- ok TS
			rehypeAccessibleEmojis,
			headers,
			[ rehypeExternalLinks, { target: '_blank', rel: 'noreferrer' } ]
		],
		shikiConfig: {
			// @ts-expect-error -- ok TS
			theme: darkFeminineItalic,
		},
	},
	vite: {
		build: {
			// I don't like inlined assets
			assetsInlineLimit: 0,
		},
	},
})
