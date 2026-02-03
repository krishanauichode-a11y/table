const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= EMPLOYEES ================= */
app.get("/employees", async (req, res) => {
  const r = await pool.query("SELECT * FROM employees ORDER BY name");
  res.json(r.rows);
});

app.post("/employees", async (req, res) => {
  const { name } = req.body;
  await pool.query("INSERT INTO employees(name) VALUES($1)", [name]);
  res.sendStatus(200);
});

/* ================= DAILY BOOKINGS ================= */
app.post("/daily", async (req, res) => {
  const { employee_id, month, day, value } = req.body;
  await pool.query(`
    INSERT INTO daily_bookings(employee_id,month,day,value)
    VALUES($1,$2,$3,$4)
    ON CONFLICT (employee_id,month,day)
    DO UPDATE SET value=$4`,
    [employee_id, month, day, value]
  );
  res.sendStatus(200);
});

app.get("/daily/:month", async (req, res) => {
  const r = await pool.query(
    "SELECT * FROM daily_bookings WHERE month=$1",
    [req.params.month]
  );
  res.json(r.rows);
});

/* ================= LEAD SUMMARY ================= */
app.post("/summary", async (req, res) => {
  const { employee_id, pre, off, rep, app } = req.body;
  await pool.query(`
    INSERT INTO lead_summary VALUES($1,$2,$3,$4,$5)
    ON CONFLICT (employee_id)
    DO UPDATE SET pre=$2,off=$3,rep=$4,app=$5`,
    [employee_id, pre, off, rep, app]
  );
  res.sendStatus(200);
});

/* ================= START ================= */
app.listen(process.env.PORT, () =>
  console.log(`API running on port ${process.env.PORT}`)
);


