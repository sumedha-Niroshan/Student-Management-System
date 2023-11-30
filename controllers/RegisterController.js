const connectionPool = require("../db/DatabaseConnection");
const { body, validationResult } = require("express-validator");

const registerBody = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }

    const sql = "SELECT * FROM programs";
    connection.query(sql, (err, rows) => {
      connection.release();

      if (!err) {
        resp.render("show-registerdata-form", { rows });
      } else {
        console.log(err);
      }

      console.log(rows);
    });
  });
};

const updateprogramsData = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }

    const programsQuery = "SELECT * FROM programs";
    const studentsQuery = "SELECT * FROM students";

    connection.query(programsQuery, (programsError, programsRows) => {
      if (programsError) {
        connection.release();
        throw programsError;
      }

      connection.query(studentsQuery, (studentsError, studentsRows) => {
        connection.release();

        if (studentsError) {
          throw studentsError;
        }

        const mergedRows = {
          programs: programsRows,
          students: studentsRows,
        };

        resp.render("register-program-form", { rows: mergedRows });
      });
    });
  });
};




const registerforProgram = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      resp.redirect("/");
      return;
    }
    const { studentId, programId } = req.body;
    console.log(req.body);

    const checkRegistrationQuery = "SELECT * FROM registrations WHERE student_id = ? AND program_id = ?";
    
    connection.query(checkRegistrationQuery, [studentId, programId], (checkErr, existingRegistrations) => {
      if (checkErr) {
        connection.release();
        throw checkErr;
      }

      if (existingRegistrations.length > 0) {
        console.log("Student is already registered for the program");
        connection.release();
        resp.redirect("/already-registered"); 
      } else {
        const insertRegistrationQuery = "INSERT INTO registrations (student_id, program_id) VALUES (?, ?)";
        connection.query(insertRegistrationQuery, [studentId, programId], (insertErr, result) => {
          connection.release();
          
          if (insertErr) {
            console.error("Error inserting into registrations:", insertErr);
            resp.status(500).send("Internal Server Error");
          } else {
            console.log("Registration successful!");
            resp.redirect("/register-program-form"); 
          }
        });
      }
    });
  });
};

const registeredStudents = (req,resp)=> {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }

    console.log("Connected to the database");
    const {programId} = req.body;
    console.log(req.body);

    connection.query(
      `SELECT students.*
      FROM students
      JOIN registrations ON students.student_id = registrations.student_id
      JOIN programs ON registrations.program_id = programs.program_id       
      WHERE  programs.program_id=?`,
      [programId],(err, rows) => {
        connection.release();
  
        if (!err) {
          resp.render("show-reg-student", { rows });
        } else {
          console.log(err);
        }
      });
});
};

const errorUi = (req, resp) => {
  resp.render("error-masege");
};


module.exports = {
  registerBody,
  updateprogramsData,
  registerforProgram,
  registeredStudents,
  errorUi
};
