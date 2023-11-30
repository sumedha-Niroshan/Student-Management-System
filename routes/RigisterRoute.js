const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');

const RegisterController = require("../controllers/RegisterController");

const validateRegistration = [
    body('studentId').isInt().toInt(),
    body('programId').isInt().toInt(),
  ];

router.get("/register-data", RegisterController.registerBody);
router.get("/register-program-form", RegisterController.updateprogramsData);
router.post("/student-register",validateRegistration, RegisterController.registerforProgram);
router.post("/show-registerd-students" ,RegisterController.registeredStudents);
router.get("/already-registered",RegisterController.errorUi);



module.exports = router;
