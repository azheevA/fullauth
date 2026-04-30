'use client'

import { PropsWithChildren } from 'react'
import { TanstackQueryProvider } from './TanstackQueryProvider'

export function MainProvider({ children }: PropsWithChildren<unknown>) {
	return <TanstackQueryProvider>{children}</TanstackQueryProvider>
}
