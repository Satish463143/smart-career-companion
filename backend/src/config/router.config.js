const router = require("express").Router();

const aiRouter = require("../module/Ai/ai.router")
const userListRouter = require("../module/userList/userList.router")

router.use('/ai', aiRouter)
router.use('/userList', userListRouter)

module.exports = router
