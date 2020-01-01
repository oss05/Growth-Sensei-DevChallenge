const Router = require('koa-router');
const queries = require('../db/queries/vinyls');

const router = new Router();
const BASE_URL = `/api/v1/vinyls`;

router.get(BASE_URL, async (ctx) => {
    try {
      const vinyls = await queries.getAllVinyls();
      ctx.body = {
        status: 'success',
        data: vinyls
      };
    } catch (err) {
      console.log(err)
    }
  })

  router.get(`${BASE_URL}/:id`, async (ctx) => {
    try {
      const vinyl = await queries.getSingleVinyl(ctx.params.id);
      if (vinyl.length) {
        ctx.body = {
          status: 'success',
          data: vinyl
        };
      } else {
        ctx.status = 404;
        ctx.body = {
          status: 'error',
          message: 'That vinyl does not exist.'
        };
      }
    } catch (err) {
      console.log(err)
    }
  })

  router.post(`${BASE_URL}`, async (ctx) => {
    try {
      const vinyl = await queries.addVinyl(ctx.request.body);
      if (vinyl.length) {
        ctx.status = 201;
        ctx.body = {
          status: 'success',
          data: vinyl
        };
      } else {
        ctx.status = 400;
        ctx.body = {
          status: 'error',
          message: 'Something went wrong.'
        };
      }
    } catch (err) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: err.message || 'Sorry, an error has occurred.'
      };
    }
  })

  router.put(`${BASE_URL}/:id`, async (ctx) => {
    try {
      const vinyl = await queries.updateVinyl(ctx.params.id, ctx.request.body);
      if (vinyl.length) {
        ctx.status = 200;
        ctx.body = {
          status: 'success',
          data: vinyl
        };
      } else {
        ctx.status = 404;
        ctx.body = {
          status: 'error',
          message: 'That vinyl does not exist.'
        };
      }
    } catch (err) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: err.message || 'Sorry, an error has occurred.'
      };
    }
  })

  router.delete(`${BASE_URL}/:id`, async (ctx) => {
    try {
      const vinyl = await queries.deleteVinyl(ctx.params.id);
      if (vinyl.length) {
        ctx.status = 200;
        ctx.body = {
          status: 'success',
          data: vinyl
        };
      } else {
        ctx.status = 404;
        ctx.body = {
          status: 'error',
          message: 'That vinyl does not exist.'
        };
      }
    } catch (err) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: err.message || 'Sorry, an error has occurred.'
      };
    }
  })

module.exports = router;