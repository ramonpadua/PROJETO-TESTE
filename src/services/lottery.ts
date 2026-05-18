import pb from '@/lib/pocketbase/client'

export const getLatestLotteryResults = async () => {
  try {
    const records = await pb.collection('lottery_results').getList(1, 1, {
      sort: '-created',
    })
    return records.items[0] || null
  } catch (error) {
    console.error('Failed to load lottery results', error)
    return null
  }
}

export const triggerLotteryFetch = async () => {
  return await pb.send('/backend/v1/lottery/fetch', {
    method: 'POST',
    headers: {
      Authorization: pb.authStore.token,
    },
  })
}
