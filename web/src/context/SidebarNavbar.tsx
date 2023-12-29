'use client'

import { createContext, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { MeQuery } from '../generated/graphql/graphql'
import { useCheckAuth } from '../hooks/useCheckAuth'

export interface ISidebarNavbarContext {
	SidebarOpen: boolean
	setSidebarOpen: (open: boolean) => void
	createComicPopupOpen: boolean
	setCreateComicPopupOpen: (open: boolean) => void
	searchInput: boolean
	toggleSearchInput: (open: boolean) => void
	userInfo?: MeQuery | undefined
}

export const SidebarNavbarContext = createContext<ISidebarNavbarContext>({
	SidebarOpen: false,
	setSidebarOpen: (open: boolean) => {},
	createComicPopupOpen: false,
	setCreateComicPopupOpen: (open: boolean) => {},
	searchInput: true,
	toggleSearchInput: (open: boolean) => {},
	userInfo: undefined,
})

export function SidebarNavbarProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [SidebarOpen, setSidebarOpen] = useState(false)
	const [createComicPopupOpen, setCreateComicPopupOpen] = useState(false)
	const [searchInput, setSearchInput] = useState(true)
	const { data: AuthData } = useCheckAuth()

	const value = {
		SidebarOpen,
		setSidebarOpen,
		createComicPopupOpen,
		setCreateComicPopupOpen,
		searchInput,
		toggleSearchInput: (open: boolean) => setSearchInput(open),
		userInfo: AuthData,
	}
	return (
		<SidebarNavbarContext.Provider value={value}>
			{children}
		</SidebarNavbarContext.Provider>
	)
}
