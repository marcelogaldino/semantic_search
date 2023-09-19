import 'dotenv/config'
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TokenTextSplitter } from "langchain/text_splitter";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { createClient,  } from "redis";



export async function saveData() {
    const text = `Burj Khalifa Bin Zayid (em árabe: برج خليفة; "Torre do Khalifa"), anteriormente conhecido como Burj Dubai, é um arranha-céu localizado em Dubai, nos Emirados Árabes Unidos, sendo a mais alta estrutura e, consequentemente, o maior arranha-céu já construído pelo ser humano, com 828 metros de altura e 160 andares. Sua construção começou em 21 de setembro de 2004 e foi inaugurado no dia 4 de janeiro de 2010. Foi rebatizado devido ao empréstimo feito por Khalifa bin Zayed al Nahyan, xeque do emirado de Abu Dhabi, depois que este emprestou dez bilhões de dólares para evitar que o emirado de Dubai desse um calote em investidores de uma de suas principais companhias, a Dubai World.

    O edifício faz parte de um complexo comercial e residencial de dois quilômetros quadrados de área chamado Downtown Dubai, localizado ao lado das duas principais avenidas da cidade de Dubai, a Sheikh Zayed Road e a Financial Centre Road (anteriormente conhecida como Doha Street). O arquiteto do edifício é Adrian Smith, que trabalhou com a Skidmore, Owings and Merrill (SOM) até 2006. A empresa de arquitetura e engenharia sediada na cidade estadunidense de Chicago ficou encarregada do projeto arquitetônico do prédio. As primeiras empreiteiras são a Samsung Engineering & Construction, a Besix e a Arabtec. A Turner Construction Company foi escolhida para comandar o projeto.
    
    O orçamento total do projeto do Burj Khalifa girou em torno de 1,5 bilhão de dólares. Mohamed Ali Alabbar, o presidente da Emaar Propertiers falou, no 8.º Congresso Mundial do Council on Tall Buildings and Urban Habitat, que o preço do metro quadrado de sala de escritório é de 43 000 dólares, e a Armani Residences, imobiliária encarregada das vendas dos apartamentos, comercializava o metro quadrado das salas por 37 500 dólares.
    
    Nicolas Léonard Sadi Carnot nasceu em Paris no dia 1 de junho de 1796. primeiramente, educado pelo pai em ciências, matemática, música e língua e aos 16 anos ingressou na École Polytechnique.
    
    Em 1823, mesmo ano da morte de seu pai, Carnot escreve um artigo não publicado com o objetivo de encontrar uma expressão matemática para o trabalho produzido por um quilograma de vapor. Somente em 1966, mais de um século após ser escrito, o documento em questão fora descoberto.
    
    No ano de 1824, publica a única obra em vida: "Réflexions sur la Puissance Motrice du Feu et sur les Machines Propres a Développer Cette Puissance" (Reflexões sobre a Potência Motriz do Fogo e Máquinas Próprias para Aumentar essa Potência) na qual revisa a importância industrial, política e econômica do motor a vapor.
    
    O engenheiro francês iniciou sua investigação sobre as propriedades dos gases após interessar-se pelos problemas industriais, em especial a relação entre pressão e temperatura, em 1831. Em 1832, morre subitamente de cólera, no dia 24 de agosto. Apesar de quase todas suas coisas terem sido incineradas como era de costume da época  parte de suas anotações escaparam à destruição. Essas anotações mostram que Sadi Carnot havia chegado à ideia de que, essencialmente, calor era trabalho, cuja forma fora alterada. Por essa, Nicolas Leonard é, por excelência, considerado o fundador da Termodinâmica - ciência que afirma ser impossível a energia desaparecer, mas apenas a possibilidade da energia se alterar de uma forma para outra.
    
    `;


    const splitter = new TokenTextSplitter({
        encodingName: 'cl100k_base',
        chunkSize: 100,
        chunkOverlap: 10,
      });
      
      const chunksOuput = await splitter.splitDocuments(
        [new Document({pageContent: text})]
        )
      
      
    await RedisVectorStore.fromDocuments(
      chunksOuput,
      new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY}),
      {
        indexName: 'text-embedings',
        redisClient: redis,
        keyPrefix: 'textEmb'
      }
    )
}

export async function getData() {
    const res = await redis.hGetAll('textEmb0')
    return res
}


export const redis = createClient({
  url: 'redis://127.0.0.1:6379'
})

export const redisVectorStore = new RedisVectorStore(
  new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY}),
  {
    indexName: 'text-embedings',
    redisClient: redis,
    keyPrefix: 'textEmb'
  }
)


