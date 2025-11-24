import React, { useState } from 'react';
import axios from 'axios';

const AttendanceTable = ({ student, onClose, onUpdate }) => {
    const [loading, setLoading] = useState(false);

    const markAttendance = async (status) => {
        setLoading(true);
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        try {
            const res = await axios.put('http://localhost:3001/api/students/attendance', {
                studentId: student._id,
                date,
                status
            });
            onUpdate(res.data);
        } catch (err) {
            alert('Error marking attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Attendance Record</h2>
                        <p className="text-sm text-slate-500">{student.name} ({student.roll})</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => markAttendance('Present')}
                            disabled={loading}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Mark Present Today
                        </button>
                        <button
                            onClick={() => markAttendance('Absent')}
                            disabled={loading}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-red-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Mark Absent Today
                        </button>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Date</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {student.attendance && student.attendance.length > 0 ? (
                                    student.attendance.slice().reverse().map((record, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50">
                                            <td className="p-4 text-slate-700 font-mono text-sm">{record.date}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'Present'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="p-8 text-center text-slate-400">No attendance records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTable;
