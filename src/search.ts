import {redis, redisVectorStore, getData, saveData} from './redis-store.js'

async function search() {
    await redis.connect()
  
    const contentAlreadyExists = await getData()
    
    if(!contentAlreadyExists) {
      await saveData()
    }

    const response = await redisVectorStore.similaritySearchWithScore(
      'Quem rebatizou o nome?',
      5
    )
    console.log(response)
    await redis.disconnect()
  }
  
  search()