import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AttendanceTable from './AttendanceTable';
import MarksTable from './MarksTable';

const StudentList = ({ students, onDelete, onUpdate }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedStudentForMarks, setSelectedStudentForMarks] = useState(null);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`http://localhost:3001/api/students/${id}`);
            onDelete(id);
        } catch (err) {
            alert('Error deleting student');
        }
    };

    const generateReport = (student) => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text(`Student Report: ${student.name}`, 14, 20);

        // Details
        doc.setFontSize(12);
        doc.text(`Roll No: ${student.roll}`, 14, 30);
        doc.text(`Email: ${student.email}`, 14, 36);
        doc.text(`Class: ${student.class}`, 14, 42);

        // Attendance Summary
        const totalDays = student.attendance.length;
        const presentDays = student.attendance.filter(a => a.status === 'Present').length;
        const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

        doc.text(`Attendance: ${attendancePercentage}% (${presentDays}/${totalDays} days)`, 14, 52);

        // Marks Table
        if (student.marks && student.marks.length > 0) {
            doc.text('Academic Performance:', 14, 62);

            const marksData = student.marks.map(m => [
                m.subject,
                m.score,
                m.total,
                `${((m.score / m.total) * 100).toFixed(2)}%`
            ]);

            autoTable(doc, {
                startY: 66,
                head: [['Subject', 'Score', 'Total', 'Percentage']],
                body: marksData,
            });
        } else {
            doc.text('No marks recorded.', 14, 62);
        }

        doc.save(`${student.name}_Report.pdf`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-5 font-bold text-slate-600 uppercase text-xs tracking-wider">Name</th>
                            <th className="p-5 font-bold text-slate-600 uppercase text-xs tracking-wider">Roll No</th>
                            <th className="p-5 font-bold text-slate-600 uppercase text-xs tracking-wider">Email</th>
                            <th className="p-5 font-bold text-slate-600 uppercase text-xs tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students.map((student) => (
                            <tr key={student._id} className="hover:bg-slate-50 transition-colors group">
                                <td className="p-5 font-medium text-slate-800">{student.name}</td>
                                <td className="p-5 text-slate-600 font-mono text-sm">{student.roll}</td>
                                <td className="p-5 text-slate-600">{student.email}</td>
                                <td className="p-5 text-right space-x-3">
                                    <button
                                        onClick={() => setSelectedStudent(student)}
                                        className="text-primary-600 hover:text-primary-800 font-semibold text-sm bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Attendance
                                    </button>
                                    <button
                                        onClick={() => setSelectedStudentForMarks(student)}
                                        className="text-purple-600 hover:text-purple-800 font-semibold text-sm bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Marks
                                    </button>
                                    <button
                                        onClick={() => generateReport(student)}
                                        className="text-emerald-600 hover:text-emerald-800 font-semibold text-sm bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Report
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student._id)}
                                        className="text-red-600 hover:text-red-800 font-semibold text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        <p>No students found. Add one above!</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedStudent && (
                <AttendanceTable
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    onUpdate={(updatedStudent) => {
                        onUpdate(updatedStudent);
                        setSelectedStudent(updatedStudent);
                    }}
                />
            )}

            {selectedStudentForMarks && (
                <MarksTable
                    student={selectedStudentForMarks}
                    onClose={() => setSelectedStudentForMarks(null)}
                    onUpdate={(updatedStudent) => {
                        onUpdate(updatedStudent);
                        setSelectedStudentForMarks(updatedStudent);
                    }}
                />
            )}
        </div>
    );
};

export default StudentList;
