import { rpc } from '@/api/proton'
import { sha256 } from '@proton/js'

export const fetchPoll = async (pollId) => {
    const res = await rpc.get_table_rows({
        code: 'protonvoting',
        scope: 'protonvoting',
        table: 'polls',
        limit: 1,
        lower_bound: pollId,
        upper_bound: pollId
    })

    if (res.rows && res.rows.length) {
        return res.rows[0]
    } else {
        return undefined
    }
}

export const fetchVoteByKey = async (publicKey, pollId) => {
    const hashedKey = sha256(publicKey.key.data)

    const res = await rpc.get_table_rows({
        code: 'protonvoting',
        scope: pollId,
        table: 'votes',
        limit: 1,
        key_type: 'sha256',
        index_position: 2,
        lower_bound: hashedKey,
        upper_bound: hashedKey
    })

    if (res.rows && res.rows.length) {
        return res.rows[0]
    } else {
        return undefined
    }
}