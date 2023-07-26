'use client'
import { useRouter } from 'next/navigation'
import { useCheckAuth } from '@/hooks/useCheckAuth'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import {
	loginMutationDocument,
	meQueryDocument,
} from '@/util/rawSchemaDocument'
import { MeQuery } from '@/generated/graphql/graphql'
import { LogoLoading } from '@/components/logo'
export default function LoginPage() {
	const { data: authData, loading: authLoading } = useCheckAuth()
	let emailOrUsername: HTMLInputElement | null
	let password: HTMLInputElement | null
	const router = useRouter()

	const [inputContainWidth, setInputContainWidth] = useState(0)

	function widthCalculator(e: Window) {
		const width = Math.floor(
			e.innerWidth < 768
				? (93.0989583 * e.innerWidth) / 100
				: (39.114583333 * e.innerWidth) / 100
		)
		const widthBlock = 1.61803399 * width
		const widthNew = widthBlock / 2

		if (Math.floor(widthNew) !== Math.floor((e.innerWidth - width) / 2)) {
			setInputContainWidth(Math.floor((width / e.innerWidth) * 100))
		}
	}
	useEffect(function mount() {
		if (window !== undefined) {
			window.addEventListener('resize', () => {
				widthCalculator(window)
			})
			widthCalculator(window)
		}
	})

	const [login, { data, loading, error }] = useMutation(loginMutationDocument)
	const OnSubmit = async () => {
		if (emailOrUsername && password) {
			const response = await login({
				variables: {
					input: {
						UsernameOrEmail: emailOrUsername.value,
						password: password.value,
					},
				},
				update(cache, { data }) {
					if (data?.Login.user && data.Login.accessToken) {
						cache.writeQuery<MeQuery>({
							query: meQueryDocument,
							data: {
								Me: data.Login.user,
							},
						})
					}
				},
				onError(error, clientOptions) {
					console.log(error.message)
				},
			})
			if (response.errors) {
				// làm gì đó cho user bik
			}
			if (response.data && response.data.Login.accessToken) {
				localStorage.setItem('token', response.data.Login.accessToken)

				router.push('/')
			}
		}
	}

	return (
		<>
			{authLoading || (!authLoading && authData?.Me) ? (
				<div className='w-100 h-[100vh] flex justify-center items-center bg-[#141518]'>
					<LogoLoading />
				</div>
			) : (
				<div
					className='
          bg-[#141518] 
          h-[100vh] 
          text-[#B7B7B7]
          flex
          flex-col
          justify-center
          items-center
        '
				>
					<div
						className={`
            flex
            flex-col
            justify-center
            items-center
          `}
						style={{
							width: inputContainWidth + '%',
						}}
					>
						<h1
							className={`
              text-[#e4e4e4]
              text-[2em]
              mb-[20px]
            `}
						>
							Login
						</h1>
						<div
							className='
              w-[100%] 
              mt-[5px]
              flex
              flex-col
            '
						>
							{error?.message && (
								<div className='bg-red-200 rounded-lg border border-spacing-0 border-red-500 text-center my-2 py-2.5'>
									{error?.message}
								</div>
							)}
							<label>Email or username</label>
							<input
								id='email'
								className='bg-[#212328] w-[100] p-[6px] px-[10px] rounded-[6px] outline-none hover:bg-[#2a2d33] mt-[8px]'
								placeholder='Enter email or username'
								ref={(e) => {
									emailOrUsername = e
								}}
							/>
						</div>
						<div
							className='
              w-[100%] 
              mt-[5px]      
              flex
              flex-col
            '
						>
							<label>Password</label>
							<input
								id='password'
								className='bg-[#212328] w-[100] p-[6px] px-[10px] rounded-[6px] outline-none hover:bg-[#2a2d33] mt-[8px]'
								placeholder='Enter password'
								type='password'
								ref={(e) => {
									password = e
								}}
							/>
						</div>

						<button
							className='bg-[#2F4DEE] w-[100%] py-[8px] mt-[20px] rounded-[6px] hover:bg-[#3b58fa]'
							disabled={loading}
							onClick={OnSubmit}
						>
							Login
						</button>
					</div>
				</div>
			)}
		</>
	)
}
