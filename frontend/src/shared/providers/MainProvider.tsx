'use client'

import { PropsWithChildren } from 'react'
import { TanstackQueryProvider } from './TanstackQueryProvider'
import { ThemeProvider } from 'next-themes'

export function MainProvider({ children }: PropsWithChildren<unknown>) {
	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='light'
			enableSystem
			disableTransitionOnChange
		>
			<TanstackQueryProvider>{children}</TanstackQueryProvider>
		</ThemeProvider>
	)
}
