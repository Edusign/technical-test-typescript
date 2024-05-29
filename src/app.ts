import express from "express";
import multer from "multer";
import fs from "fs";
import Database from "better-sqlite3";
import path from "path";

const databasePath = path.resolve(__dirname + '/database.db');
if (!fs.existsSync(databasePath)) {
	const db = new Database(databasePath, { verbose: console.log });
	const migrationSchema = fs.readFileSync(path.resolve(__dirname, '../../', 'mysql-init-scripts/technical_test-schema.sql'), 'utf8');
	const migrationData = fs.readFileSync(path.resolve(__dirname, '../../', 'mysql-init-scripts/technical_test-data.sql'), 'utf8');
	db.exec(migrationSchema);
	db.exec(migrationData);
}
  
let upload = multer({
	limits: {fileSize: 1024 * 1024 * 2},
});

let app = express();

// Middleware
app.use(express.json());

// Get list of students for a specific course
app.get("/course/:courseId/students", (req, res) => {
	let cid = req.params.courseId;

	const db = new Database(databasePath, { verbose: console.log });
	const rows = db.prepare("SELECT * FROM STUDENTS JOIN STUDENT_STATES ON STUDENTS.ID = STUDENT_STATES.STUDENT_ID WHERE COURSE_ID = " + cid).all();
	res.json(rows);
});


// Mark student as present for a specific course
app.post("/student/:studentId/present", signatureUpload, (req, res) => {
	let sid = req.body.studentId;
	let path = (req as any).signaturePath;
	let t = new Date().toISOString().slice(0, 19).replace("T", " ");

	const db = new Database(databasePath, { verbose: console.log });
	const stmt = db.prepare(
		"UPDATE STUDENT_STATES SET STATE = 1, TIMESTAMP = " + `'${t}'` + ", SIGNATURE = " + `'${path}'` + " WHERE STUDENT_ID = " + sid
	);
	stmt.run();
	res.json({message: "Student marked as present"});
});

// Get student state for a specific course
app.post("/state", (req, res) => {
	let sid = req.body.studentId;
	let cid = req.body.courseId;

	const db = new Database(databasePath, { verbose: console.log });
	const [row] = db.prepare("SELECT * FROM STUDENT_STATES WHERE STUDENT_ID = " + sid + " AND COURSE_ID = " + cid).all()
	res.json(row);
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