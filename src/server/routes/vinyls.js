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

module.exports = router;