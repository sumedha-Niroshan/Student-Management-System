const express = require("express");
const router = express.Router();

const StudentController = require("../controllers/StudentController");

router.get("/", StudentController.initializeUi);
router.get("/manege-students", StudentController.studentbodyUi);
router.get("/show-students/:student_id", StudentController.showStudents);
router.get("/update-students/:student_id", StudentController.updateStudents);
router.post("/modify-students",StudentController.modifyStudents);
router.get("/new-students", StudentController.newStudents);
router.post("/create-students", StudentController.createStudents);
router.get("/delete-students/:student_id", StudentController.deleteStudents);

module.exports = router;
