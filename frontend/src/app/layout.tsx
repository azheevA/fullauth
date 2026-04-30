import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import '@/shared/styles/globals.css'
import { cn } from '@/shared/utils/utils'
import { MainProvider } from '@/shared/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: {
		absolute: 'Полная авторизация',
		default: 'Полная авторизация',
		template: '%s | Полная авторизация'
	},
	description:
		'Полная авторизация - это современное решение для управления доступом и безопасностью в вашем приложении. Наша платформа предоставляет мощные инструменты для аутентификации и авторизации пользователей, обеспечивая надежную защиту данных и удобство использования. С Полной авторизацией вы можете легко интегрировать различные методы аутентификации, такие как социальные сети, электронная почта и многофакторная аутентификация, чтобы обеспечить максимальную безопасность и удобство для ваших пользователей.'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			className={cn(
				'h-full',
				'antialiased',
				geistSans.variable,
				geistMono.variable,
				'font-sans',
				inter.variable
			)}
		>
			<body className='flex min-h-full flex-col'>
				<MainProvider>
					<div className='relative flex min-h-screen flex-col'>
						<div className='flex h-screen w-full items-center'>
							{children}
						</div>
					</div>
				</MainProvider>
			</body>
		</html>
	)
}
