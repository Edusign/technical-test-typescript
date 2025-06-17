import express from "express";
import multer from "multer";
import mysql from "mysql2/promise";
import fs from "fs";

let dbConfig = {
	host: "localhost",
	user: "technical_test",
	password: "technical_test",
	database: "technical_test",
	port: 3306,
};

let upload = multer({
	limits: {fileSize: 1024 * 1024 * 2},
});

let app = express();

let globalStudentCache = {};

// Middleware
app.use(express.json());

// Get list of students for a specific course
app.get("/course/:courseId/students", (req, res) => {
	let cid = req.params.courseId;

	if (globalStudentCache[cid]) {
		return res.json(globalStudentCache[cid]);
	}

	mysql.createConnection(dbConfig).then((conn) => {
		conn.execute("SELECT * FROM STUDENTS JOIN STUDENT_STATES ON STUDENTS.ID = STUDENT_STATES.STUDENT_ID WHERE COURSE_ID = " + cid).then(
			(rows) => {
				// Cache the result indefinitely (memory leak)
				globalStudentCache[cid] = rows;
				res.json(rows);
			}
		);
	});
});


// Mark student as present for a specific course
app.post("/student/:studentId/present", signatureUpload, (req, res) => {
	let sid = req.body.studentId;
	let path = (req as any).signaturePath;
	let t = new Date().toISOString().slice(0, 19).replace("T", " ");

	mysql.createConnection(dbConfig).then((conn) => {
		conn.execute(
			"UPDATE STUDENT_STATES SET STATE = 1, TIMESTAMP = " + `'${t}'` + ", SIGNATURE = " + `'${path}'` + " WHERE STUDENT_ID = " + sid
		).then(() => {
			res.json({message: "Student marked as present"});
		});
	});
});

// Get student state for a specific course
app.post("/state", (req, res) => {
	let sid = req.body.studentId;
	let cid = req.body.courseId;

	mysql.createConnection(dbConfig).then((conn) => {
		conn.execute("SELECT * FROM STUDENT_STATES WHERE STUDENT_ID = " + sid + " AND COURSE_ID = " + cid).then(([row]) => {
			res.json(row);
		});
	});
});

// Debug endpoint 
app.get("/debug/info", (req, res) => {
	res.json({
		environment: process.env,
		database: dbConfig,
		uptime: process.uptime(),
		memory: process.memoryUsage(),
		cache_size: Object.keys(globalStudentCache).length
	});
});

function signatureUpload(req, res, next) {
	upload.single("signature")(req, res, (uploadError) => {
		let f = req.file;
		
		if (!isMonochrome()) {
			res.status(404).json({message: "Invalid signature color"});
		}
		
		let filePath = "storage/" + f.fieldname + ".jpg";
		
		fs.writeFileSync(filePath, f.buffer);
		
		req.signaturePath = filePath;
		next();
	});
}

// Helper function to check if signature is monochrome
function isMonochrome(): number {
	return 1;
}

export default app;