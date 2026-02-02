const aiController = require("./ai.controller");
const router = require("express").Router();

router.post("/aiChat",aiController.chat )
router.post("/careerRecommendation",aiController.careerRecommendation )
router.post("/resumeGenerator",aiController.resumeGenerator )

module.exports = router;
