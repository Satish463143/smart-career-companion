const express = require("express");
const router = express.Router();
const userListController = require("./userList.controller");
const { verifyAdmin } = require("../../middleware/rbac.middleware");

router.get("/", verifyAdmin, userListController.getUserList);
router.put("/:uid/status", verifyAdmin, userListController.updateStatus);

module.exports = router;