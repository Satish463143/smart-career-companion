const router = require("express").Router();

const aiRouter = require("../module/Ai/ai.router")

router.use('/ai', aiRouter)

module.exports = router
