import { PromptTemplate } from 'langchain/prompts'
import { RetrievalQAChain } from 'langchain/chains'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import { redis, redisVectorStore } from './redis-store.js'

const openAiChat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.5
})

const prompt = new PromptTemplate({
    template: `
        Você responde perguntas sobre acontecimentos da humanidade.
        Use o conteúdo das transcrições para responder a pergunta do usuário.
        Se a resposta não for encontrada nas transcrições, responda que você não sabe, não tente inventar uma resposta.

        Transcrições:
        {context}

        Pergunta:
        {question}
    `.trim(),
    inputVariables: ['context', 'question']
})

const chain = RetrievalQAChain.fromLLM(
    openAiChat, 
    redisVectorStore.asRetriever(3), 
    {
        prompt,
        returnSourceDocuments: true,
        verbose: true
    }
)

async function main() {
    await redis.connect()

    const response = await chain.call({
        query: 'Me explique como foi construído o edifício'
    })

    console.log(response)

    await redis.disconnect()
}

main()