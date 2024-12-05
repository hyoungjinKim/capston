import express from "express";
import mysql from "mysql2";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import hpp from "hpp";

const app = express();
const port = 8080;

// Middleware 설정
app.use(cors({ origin: true, credentials: true }));
app.use(hpp());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// MySQL 풀 설정
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "192.168.0.90",
  port: "3306",
  user: "root",
  password: "mypassword",
  database: "dina",
  debug: false,
});

// 서버 시작 시 DB 연결 확인
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // 연결 실패 시 서버 종료
  } else {
    console.log("Database connected successfully");
    connection.release(); // 연결 해제
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// API 라우트
app.get("/api", async (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("DB Connection Error:", err);
      return res.status(500).json({ message: "Database connection failed" });
    }

    connection.query("SELECT * FROM choi;", (queryErr, results) => {
      if (queryErr) {
        console.error("Query Error:", queryErr);
        connection.release();
        return res.status(500).json({ message: "Query execution failed" });
      }

      res.status(200).json({ data: results });
      connection.release();
    });
  });
});
