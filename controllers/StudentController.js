const connectionPool = require("../db/DatabaseConnection");

const initializeUi = (req, resp) => {
  resp.render("home");
};

const studentbodyUi = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }

    const sql = "SELECT * FROM students";
    connection.query(sql, (err, rows) => {
      connection.release();

      if (!err) {
        resp.render("manege-student", { rows });
      } else {
        console.log(err);
      }

      console.log(rows);
    });
  });
};

const showStudents = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }

    console.log("Connected to the database");

    connection.query(
      "SELECT * FROM students WHERE student_id=?",
      [req.params.student_id],
      (err, rows) => {
        connection.release();

        if (err) {
          console.error("Error executing the query:", err);
          resp.status(500).send("Internal Server Error");
          return;
        }

        const student = rows[0];
        console.log(student);

        console.log("Query result:", student);

        if (student) {
          resp.render("show-students", { student });
        } else {
          console.log("No data found for student_id:", req.params.student_id);
          resp.status(404).send("Not Found");
        }
      }
    );
  });
};

const updateStudents = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }
    connection.query(
      "SELECT * FROM students WHERE student_id=?",
      [req.params.student_id],
      (err, rows) => {
        connection.release();
        const data = rows[0];
        if (!err) {
          resp.render("update-students", { student: data });
        } else {
          console.log(err);
        }
        console.log(rows[0]);
      }
    );
  });
};

const modifyStudents = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }

    const { student_id, first_name, last_name, email, date_of_birth, address } =
      req.body;

    console.log("Request Body:", req.body);

    connection.query(
      "UPDATE students SET first_name=?, last_name=?, email=?, date_of_birth=?, address=? WHERE student_id=?",
      [first_name, last_name, email, date_of_birth, address, student_id],
      (err, rows) => {
        connection.release();
        if (!err) {
          resp.render("update-students");
        } else {
          console.log(err);
        }
        console.log(rows[0]);
      }
    );
  });
};

const newStudents = (req, resp) => {
  resp.render("new-students");
};

const createStudents = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      console.error("Error getting database connection:", error);
      resp.status(500).send("Internal Server Error");
      return;
    }

    const { first_name, last_name, email, date_of_birth, address } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !date_of_birth || !address) {
      console.error("Missing required fields in the request body");
      resp.status(400).send("Missing required fields");
      connection.release();
      return;
    }

    connection.query(
      "INSERT INTO students(first_name, last_name, email, date_of_birth, address) VALUES(?,?,?,?,?)",
      [first_name, last_name, email, date_of_birth, address],
      (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing the query:", err);

          if (err.code === "ER_DUP_ENTRY") {
            console.error("Duplicate entry for email:", email);
            resp.status(400).render("duplicate-entry", { email });
          } else {
            resp
              .status(500)
              .render("error", { message: "Error creating student" });
          }

          return;
        }

        console.log("Inserted student with ID:", result.insertId);
        resp.redirect("manege-students");
      }
    );
  });
};

const deleteStudents = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }
    connection.query(
      "DELETE FROM students WHERE student_id=?",
      [req.params.student_id],
      (err, rows) => {
        connection.release();
        if (!err) {
          resp.redirect("/manege-students");
        } else {
          console.log(err);
        }
      }
    );
  });
};

module.exports = {
  initializeUi,
  studentbodyUi,
  showStudents,
  updateStudents,
  modifyStudents,
  createStudents,
  newStudents,
  deleteStudents,
};
