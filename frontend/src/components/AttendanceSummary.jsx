import React from 'react';

const AttendanceSummary = ({ students }) => {
    const calculateStats = (attendance) => {
        if (!attendance || attendance.length === 0) return { present: 0, absent: 0, percentage: 0 };
        const present = attendance.filter(a => a.status === 'Present').length;
        const absent = attendance.filter(a => a.status === 'Absent').length;
        const total = attendance.length;
        return {
            present,
            absent,
            percentage: ((present / total) * 100).toFixed(1)
        };
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-5 font-bold text-slate-600 uppercase text-xs tracking-wider">Student</th>
                            <th className="p-5 font-bold text-slate-600 uppercase text-xs tracking-wider">Roll No</th>
                            <th className="p-5 font-bold text-slate-600 uppercase text-xs tracking-wider text-center">Total Classes</th>
                            <th className="p-5 font-bold text-slate-600 uppercase text-xs tracking-wider text-center">Present</th>
                            <th className="p-5 font-bold text-slate-600 uppercase text-xs tracking-wider text-center">Absent</th>
                            <th className="p-5 font-bold text-slate-600 uppercase text-xs tracking-wider text-right">Percentage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students.map((student) => {
                            const stats = calculateStats(student.attendance);
                            return (
                                <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-5 font-medium text-slate-800">{student.name}</td>
                                    <td className="p-5 text-slate-600 font-mono text-sm">{student.roll}</td>
                                    <td className="p-5 text-center text-slate-600">{student.attendance?.length || 0}</td>
                                    <td className="p-5 text-center text-emerald-600 font-medium">{stats.present}</td>
                                    <td className="p-5 text-center text-red-600 font-medium">{stats.absent}</td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-sm font-medium text-slate-700">{stats.percentage}%</span>
                                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${Number(stats.percentage) >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                    style={{ width: `${stats.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceSummary;
