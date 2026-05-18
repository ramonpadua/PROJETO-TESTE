import pb from '@/lib/pocketbase/client'

export const getLatestLotteryResults = async () => {
  try {
    const records = await pb.collection('lottery_results').getList(1, 1, {
      sort: '-created',
    })
    return records.items[0] || null
  } catch (error: any) {
    if (error?.status === 401) {
      pb.authStore.clear()
      window.location.href = '/login'
      return null
    }
    console.error('Failed to load lottery results', error)
    return null
  }
}

export const triggerLotteryFetch = async () => {
  const token = pb.authStore.token
  if (!token) {
    pb.authStore.clear()
    window.location.href = '/login'
    throw new Error('Usuário não autenticado. O token de autorização está ausente.')
  }
  try {
    return await pb.send('/backend/v1/lottery/fetch', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
    })
  } catch (error: any) {
    if (error?.status === 401) {
      pb.authStore.clear()
      window.location.href = '/login'
    }
    throw error
  }
}
