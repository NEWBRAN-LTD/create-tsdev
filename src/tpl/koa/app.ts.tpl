// src/app.ts
// DON'T USE import * as Koa from 'koa'! it will crash 
import Koa from 'koa'
import HttpStatus from 'http-status-codes'
// import router from './router'
const app:Koa = new Koa()

// Generic error handling middleware.
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next()
  } catch (error) {
    ctx.status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR
    error.status = ctx.status
    ctx.body = { error }
    ctx.app.emit('error', error, ctx)
  }
})

// Initial route
app.use(async (ctx:Koa.Context) => {
  ctx.body = 'Hello world';
})

// remove the above code and uncomment this once you done with your router
/*
app.use(router.routes());
app.use(router.allowedMethods());
*/


// Application error logging.
app.on('error', console.error)

export default app
