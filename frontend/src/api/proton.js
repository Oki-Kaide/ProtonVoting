import { JsonRpc } from '@proton/js'
export const rpc = new JsonRpc(['https://proton.cryptolions.io', 'https://proton.eoscafeblock.com'], { fetch: fetch })
