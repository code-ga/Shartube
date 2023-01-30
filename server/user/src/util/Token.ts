import {
	create,
	getNumericDate,
	verify,
} from 'https://deno.land/x/djwt@v2.7/mod.ts'
import { join as PathJoin } from 'https://deno.land/std@0.149.0/path/mod.ts'
import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts'
import { SessionModel, timeByMinus } from '../model/session.ts'
import mongoose from 'npm:mongoose'
config({
	path: PathJoin(import.meta.url, '..', '..', '.env'),
})

const key = await crypto.subtle.generateKey(
	{ name: 'HMAC', hash: 'SHA-512' },
	true,
	['sign', 'verify']
)

export async function GenToken(userID: string) {
	const session = await new SessionModel({
		userID: new mongoose.Types.ObjectId(userID),
	}).save()
	// await SessionModel.deleteMany({
	// 	userID: new mongoose.Types.ObjectId(userID),
	// 	_id: {
	// 		$ne: session._id,
	// 	},
	// })
	for (const DSession of await SessionModel.find({
		userID: new mongoose.Types.ObjectId(userID),
	})) {
		console.log(DSession._id.toHexString(), session._id.toHexString())
		if (DSession._id.toHexString() != session._id.toHexString()) {
			await DSession.deleteOne()
		}
	}
	const expTimeDate = new Date().getSeconds() + timeByMinus * 60
	const exp = getNumericDate(expTimeDate)

	const jwt = await create(
		{ alg: 'HS512', typ: 'JWT' },
		{
			sessionID: session._id.toHexString(),
			exp,
		},
		key
	)
	return jwt
}

async function VerifyToken(token: string) {
	return await verify(token, key)
}

export async function DecodeToken(token: string) {
	const payload = await VerifyToken(token)
	const sessionID = payload.sessionID
	return await SessionModel.findById(sessionID)
}
