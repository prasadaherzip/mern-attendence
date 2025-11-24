import React, { useState } from 'react';
import axios from 'axios';

const BulkAttendance = ({ students, onUpdate }) => {
    const [loadingMap, setLoadingMap] = useState({});

    const markAttendance = async (studentId, status) => {
        setLoadingMap(prev => ({ ...prev, [studentId]: true }));
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        try {
            const res = await axios.put('http://localhost:3001/api/students/attendance', {
                studentId,
                date,
                status
            });
            onUpdate(res.data);
        } catch (err) {
            alert('Error marking attendance');
        } finally {
            setLoadingMap(prev => ({ ...prev, [studentId]: false }));
        }
    };

    const isMarkedToday = (student, status) => {
        const today = new Date().toISOString().split('T')[0];
        return student.attendance?.some(a => a.date === today && a.status === status);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800">Mark Attendance for Today ({new Date().toLocaleDateString()})</h2>
            </div>
            <div className="divide-y divide-slate-100">
                {students.map((student) => (
                    <div key={student._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                {student.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-800">{student.name}</h3>
                                <p className="text-sm text-slate-500 font-mono">{student.roll}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => markAttendance(student._id, 'Present')}
                                disabled={loadingMap[student._id]}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isMarkedToday(student, 'Present')
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                    }`}
                            >
                                {loadingMap[student._id] ? '...' : 'Present'}
                            </button>
                            <button
                                onClick={() => markAttendance(student._id, 'Absent')}
                                disabled={loadingMap[student._id]}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isMarkedToday(student, 'Absent')
                                        ? 'bg-red-600 text-white shadow-md'
                                        : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                                    }`}
                            >
                                {loadingMap[student._id] ? '...' : 'Absent'}
                            </button>
                        </div>
                    </div>
                ))}
                {students.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        No students found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkAttendance;
