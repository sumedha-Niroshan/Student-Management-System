const connectionPool = require("../db/DatabaseConnection");

const programebodyUi = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }

    const sql = "SELECT * FROM programs";
    connection.query(sql, (err, rows) => {
      connection.release();

      if (!err) {
        resp.render("manege-programs", { rows });
      } else {
        console.log(err);
      }
    });
  });
};

const showPrograms = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }

    console.log("Connected to the database");

    connection.query(
      "SELECT * FROM programs WHERE program_id=?",
      [req.params.program_id],
      (err, rows) => {
        connection.release();

        if (err) {
          console.error("Error executing the query:", err);
          resp.status(500).send("Internal Server Error");
          return;
        }

        const program = rows[0];
        console.log(program);

        console.log("Query result:", program);

        if (program) {
          resp.render("show-programs", { program });
        } else {
          console.log("No data found for program_id:", req.params.program_id);
          resp.status(404).send("Not Found");
        }
      }
    );
  });
};

const updatePrograms = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }
    connection.query(
      "SELECT * FROM programs WHERE program_id=?",
      [req.params.program_id],
      (err, rows) => {
        connection.release();
        const data = rows[0];
        if (!err) {
          resp.render("update-Programs", { program: data });
        } else {
          console.log(err);
        }
        console.log(rows[0]);
      }
    );
  });
};

const modifyPrograms = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }

    const { program_id, program_name, description } = req.body;

    console.log("Request Body:", req.body);

    connection.query(
      "UPDATE programs SET program_name=?, description=? WHERE program_id=?",
      [program_name, description, program_id],
      (err, rows) => {
        connection.release();
        if (!err) {
          resp.redirect("/manege-programs");
        } else {
          console.log(err);
        }
        console.log(rows[0]);
      }
    );
  });
};

const newPrograms = (req, resp) => {
  resp.render("new-programs");
};

const createPrograms = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      console.error("Error getting database connection:", error);
      resp.status(500).send("Internal Server Error");
      return;
    }

    const { program_name, description } = req.body;

    // Validate required fields
    if (!program_name || !description) {
      console.error("Missing required fields in the request body");
      resp.status(400).send("Missing required fields");
      connection.release();
      return;
    }

    connection.query(
      "INSERT INTO programs(program_name, description) VALUES(?,?)",
      [program_name, description],
      (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing the query:", err);

          if (err.code === "ER_DUP_ENTRY") {
            console.error("Duplicate entry for program name:", program_name);
            resp.status(400).render("duplicate-entry", { program_name });
          } else {
            resp
              .status(500)
              .render("error", { message: "Error creating program" });
          }

          return;
        }

        console.log("Inserted program with ID:", result.insertId);
        resp.redirect("/manege-programs");
      }
    );
  });
};

const deletePrograms = (req, resp) => {
  connectionPool.getConnection((error, connection) => {
    if (error) {
      throw error;
    }
    connection.query(
      "DELETE FROM programs WHERE program_id=?",
      [req.params.program_id],
      (err, rows) => {
        connection.release();
        if (!err) {
          resp.redirect("/manege-programs");
        } else {
          console.log(err);
        }
      }
    );
  });
};

module.exports = {
  programebodyUi,
  showPrograms,
  updatePrograms,
  modifyPrograms,
  createPrograms,
  newPrograms,
  deletePrograms,
};
