// src/router.ts
// sample router template
import Koa from 'koa'
import Router from 'koa-router'

const routerOpts: Router.IRouterOptions = {
  prefix: '/endpoint',
}

const router: Router = new Router(routerOpts);

router.get('/', async (ctx:Koa.Context) => {
  ctx.body = 'GET ALL'
})

router.get('/:id', async (ctx:Koa.Context) => {
  ctx.body = 'GET SINGLE'
})

router.post('/', async (ctx:Koa.Context) => {
  ctx.body = 'POST'
})

router.delete('/:id', async (ctx:Koa.Context) => {
  ctx.body = 'DELETE'
})

router.patch('/:id', async (ctx:Koa.Context) => {
  ctx.body = 'PATCH'
})

export default router
