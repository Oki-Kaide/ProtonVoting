import { ConnectWallet } from '@proton/web-sdk';
import { rpc } from '@/api/proton'

const appIdentifier = 'protonvote'

export let link
export let session

export const createLink = async ({
    restoreSession
} = { restoreSession: false }) => {
    const { link: localLink, session: localSession } = await ConnectWallet({
        linkOptions: {
            rpc,
            restoreSession
        },
        transportOptions: {
            requestAccount: 'protonvoting', /* Optional: Your proton account */
            requestStatus: false, /* Optional: Display request success and error messages, Default true */
            backButton: true
        },
        selectorOptions: {
            appName: 'Proton Vote', /* Optional: Name to show in modal, Default 'app' */
        }
    })
    link = localLink
    session = localSession
}

export const login = async () => {
    await createLink()
    return session
}

export const transact = async (actions, broadcast) => {
    return await session.transact({
        transaction: {
            actions
        }
    }, { broadcast })
}

export const logout = async () => {
    if (link && session) {
        await link.removeSession(appIdentifier, session.auth)
    }
    session = undefined
    link = undefined
}

export const reconnect = async () => {
    if (!link) {
        await createLink({ restoreSession: true })
    }

    if (session) {
        return session
    } else {
        throw new Error('No Session')
    }
}