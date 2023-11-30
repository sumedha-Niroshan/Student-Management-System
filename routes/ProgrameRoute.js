const express = require("express");
const router = express.Router();

const ProgrameController = require("../controllers/ProgrameController");

router.get("/manege-programs", ProgrameController.programebodyUi);
router.get("/new-programs", ProgrameController.newPrograms);
router.post("/create-programs", ProgrameController.createPrograms);
router.get("/delete-programs/:program_id", ProgrameController.deletePrograms);
router.get("/show-programs/:program_id",ProgrameController.showPrograms);
router.get("/update-programs/:program_id",ProgrameController.updatePrograms);
router.post("/modify-programs",ProgrameController.modifyPrograms);


module.exports = router;
