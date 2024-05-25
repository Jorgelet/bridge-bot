import path from 'node:path'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { createBot, createProvider, createFlow, addKeyword, EVENTS } from '@builderbot/bot'

import { clearDirectory } from './utils/clearDirectory'
import { fetchPostMedia, fetchPostVoice, fetchPostMessage } from './utils/fetchPost'

const PORT = process.env.PORT ?? 3008
const fileImages = path.join(process.cwd(), 'src', 'database', 'images');
const fileVoices = path.join(process.cwd(), 'src', 'database', 'images');

const mediaFlow = addKeyword<Provider, Database>(EVENTS.MEDIA)
  .addAction(async (ctx, {provider}) => {
    const localPath = await provider.saveFile(ctx, { path: fileImages})
    // fetch('http://localhost:3008/v1/media', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ number: '593995715540', media: localPath }),
    // })
    fetchPostMedia('593995715540', localPath)
    clearDirectory(fileImages)
  })

const voiceFlow = addKeyword<Provider, Database>(EVENTS.VOICE_NOTE)
  .addAction(async (ctx, {provider}) => {
    const voicePath = await provider.saveFile(ctx, { path: fileVoices})
    // fetch('http://localhost:3008/v1/voice', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ number: '593995715540', voice: voicePath }),
    // })
    fetchPostVoice('593995715540', voicePath)
    clearDirectory(fileVoices)
  })


const welcomeFlow = addKeyword<Provider, Database>(EVENTS.WELCOME)
  .addAction(async (ctx) => {
    // fetch('http://localhost:3008/v1/messages', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ number: '593995715540', message: ctx.body }),
    // })
    fetchPostMessage('593995715540', ctx.body)
  })


const main = async () => {
  const adapterFlow = createFlow([welcomeFlow, mediaFlow, voiceFlow])
  const adapterProvider = createProvider(Provider)
  const adapterDB = new Database()

  const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  })

  adapterProvider.server.post(
    '/v1/messages',
    handleCtx(async (bot, req, res) => {
      const { number, message, urlMedia } = req.body
      await bot.sendMessage(number, message, { media: urlMedia ?? null })
      return res.end('sended')
    })
  )
  adapterProvider.server.post(
    '/v1/media',
    handleCtx(async (bot, req, res) => {
      const { number, media } = req.body
      await bot.sendMessage(number, 'Archivo enviado por el cliente:', { media: media ?? null })
      return res.end('sended')
    })
  )
  adapterProvider.server.post(
    '/v1/voice',
    handleCtx(async (bot, req, res) => {
      const { number, voice } = req.body
      await bot.provider.sendAudio(number, voice)
      return res.end('sended')
    })
  )

  httpServer(+PORT)
}

main()
