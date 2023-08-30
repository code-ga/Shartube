'use client'
import { Navbar } from '@/components/Navbar/Navbar'
import styles from './page.module.css'
import { useEffect, useState } from 'react'
import { LogoLoading } from '../components/logo'
import { useQuery } from '@apollo/client'
import {
	TopViewComicsQueryDocument,
	meQueryDocument,
} from '../util/rawSchemaDocument'
import { ComicCard } from '../components/ComicCard'
import { DefaultComicCard } from '../components/DefaultComicCard'

export const metadata = {
	title: 'Shartube',
	description: 'Online sharing platform',
}

export default function Home() {
	const { data: AuthData, loading: AuthLoading } = useQuery(meQueryDocument)
	const [height, setHeight] = useState(0)
	const [heightContain, setHeightContain] = useState(0)
	const [comicCardPerLine, setComicCardPerLine] = useState(4)

	useEffect(() => {
		if (window !== undefined) {
			window.addEventListener('resize', () => {
				setHeight((window.innerHeight * 1) / 11.5)
				setHeightContain(window.innerHeight - height)
			})
			setHeight((window.innerHeight * 1) / 11.5)
			setHeightContain(window.innerHeight - height)
		}
	}, [height])

	const { data: comics, loading: comicsLoading } = useQuery(
		TopViewComicsQueryDocument
	)
	let data = [0, 1, 2, 3, 4, 5, 6, 7, 8]
	return (
		<div className={styles.container}>
			{AuthLoading || comicsLoading ? (
				<div className='w-100 h-[100vh] flex justify-center items-center bg-[#141518]'>
					<LogoLoading />
				</div>
			) : (
				<main className={styles.main}>
					<Navbar height={height} key='shar-secure' userInfo={AuthData} />
					<div
						className={styles.mainContainer}
						style={{
							width: '100%',
							height: `calc(100vh - ${height}px)`,
							maxHeight: `${heightContain}px`,
							overflowY: 'auto',
							padding: '20px',
						}}
					>
						<div className='flex content-center justify-center'>
							<DefaultComicCard></DefaultComicCard>
							<DefaultComicCard></DefaultComicCard>
							<DefaultComicCard></DefaultComicCard>
							<DefaultComicCard></DefaultComicCard>
						</div>
						<ListComic
							data={data}
							comicCardPerLine={comicCardPerLine}
						></ListComic>
					</div>
				</main>
			)}
		</div>
	)
}

export function ListComic(props: { data: any[]; comicCardPerLine: number }) {
	let result = [] as JSX.Element[][]
	let current: JSX.Element[] = []
	props.data.map((value, index) => {
		current.push(<ComicCard></ComicCard>)
		if ((index + 1) % props.comicCardPerLine == 0) {
			result.push([...current])
			current = []
			return
		}
		if (index + 1 == props.data.length) {
			result.push([...current])
			current = []
		}
	})
	return (
		<>
			{result.map((value, key) => {
				return (
					<div className='flex content-center justify-center' key={key}>
						{value}
					</div>
				)
			})}
		</>
	)
}
