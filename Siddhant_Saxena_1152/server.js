const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());
let students = [
    {
        id: 201,
        rollNumber: "CSE2401",
        name: "Aarav Sharma",
        branch: "CSE",
        semester: 3,
        email: "aarav@example.com"
    },
    {
        id: 202,
        rollNumber: "ECE2402",
        name: "Diya Verma",
        branch: "ECE",
        semester: 3,
        email: "diya@example.com"
    },
    {
        id: 203,
        rollNumber: "CSE2403",
        name: "Kabir Singh",
        branch: "CSE",
        semester: 3,
        email: "kabir@example.com"
    }
];
function validateStudent(data) {
    return (
        data &&
        typeof data.rollNumber === "string" &&
        data.rollNumber.trim() !== "" &&
        typeof data.name === "string" &&
        data.name.trim() !== "" &&
        typeof data.branch === "string" &&
        data.branch.trim() !== "" &&
        typeof data.semester === "number" &&
        Number.isInteger(data.semester) &&
        data.semester > 0 &&
        typeof data.email === "string" &&
        data.email.trim() !== ""
    );
}
//GET all
app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});
//POST
app.post('/api/students', (req, res) => {
    const data = req.body;
    if (!validateStudent(data)) {
        return res.status(400).json({
            message: "Invalid input. All fields are required and semester must be a positive integer."
        });
    }
    const exists = students.some(
        s => s.rollNumber.toLowerCase() === data.rollNumber.trim().toLowerCase()
    );
    if (exists) {
        return res.status(400).json({
            message: "Roll number already exists"
        });
    }
    const newId = Math.max(...students.map(s => s.id), 200) + 1;
    const newStudent = {
        id: newId,
        rollNumber: data.rollNumber.trim(),
        name: data.name.trim(),
        branch: data.branch.trim(),
        semester: data.semester,
        email: data.email.trim()
    };
    students.push(newStudent);
    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});
//filter
app.get('/api/students/filter', (req, res) => {
    const branch = req.query.branch;
    if (typeof branch !== "string" || branch.trim() === "") {
        return res.status(400).json({
            message: "Please provide a branch query parameter"
        });
    }
    const filteredStudents = students.filter(
        s => s.branch.toLowerCase() === branch.trim().toLowerCase()
    );
    res.status(200).json(filteredStudents);
});
//GET by id
app.get('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);
    const student = students.find(s => s.id === id);
    if (!Number.isInteger(id) || !student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }
    res.status(200).json(student);
});
//PUT
app.put('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }
    const data = req.body;
    if (!validateStudent(data)) {
        return res.status(400).json({
            message: "Invalid student data"
        });
    }
    const duplicate = students.some(
        (s, i) =>
            i !== index &&
            s.rollNumber.toLowerCase() === data.rollNumber.trim().toLowerCase()
    );
    if (duplicate) {
        return res.status(400).json({
            message: "Roll number already exists"
        });
    }
    students[index] = {
        id: id,
        rollNumber: data.rollNumber.trim(),
        name: data.name.trim(),
        branch: data.branch.trim(),
        semester: data.semester,
        email: data.email.trim()
    };
    res.status(200).json({
        message: "Student updated successfully",
        student: students[index]
    });
});
//DELETE
app.delete('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if (!Number.isInteger(id) || index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }
    const deletedStudent = students.splice(index, 1)[0];
    res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});
