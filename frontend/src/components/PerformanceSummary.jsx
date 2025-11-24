import React from 'react';

const PerformanceSummary = ({ students }) => {
    return (
        <div className="space-y-6">
            {students.map((student) => (
                <div key={student._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{student.name}</h3>
                            <p className="text-sm text-slate-500 font-mono">{student.roll}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Overall Average</p>
                            <p className="text-xl font-bold text-primary-600">
                                {student.marks && student.marks.length > 0
                                    ? (student.marks.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / student.marks.length).toFixed(1)
                                    : 0}%
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 rounded-lg">
                                <tr>
                                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Subject</th>
                                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Score</th>
                                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Total</th>
                                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Percentage</th>
                                    <th className="p-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {student.marks && student.marks.length > 0 ? (
                                    student.marks.map((mark, index) => {
                                        const percentage = (mark.score / mark.total) * 100;
                                        let grade = 'F';
                                        if (percentage >= 90) grade = 'A+';
                                        else if (percentage >= 80) grade = 'A';
                                        else if (percentage >= 70) grade = 'B';
                                        else if (percentage >= 60) grade = 'C';
                                        else if (percentage >= 50) grade = 'D';

                                        return (
                                            <tr key={index}>
                                                <td className="p-3 font-medium text-slate-700">{mark.subject}</td>
                                                <td className="p-3 text-slate-600">{mark.score}</td>
                                                <td className="p-3 text-slate-600">{mark.total}</td>
                                                <td className="p-3 text-slate-600">{percentage.toFixed(1)}%</td>
                                                <td className="p-3">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                                                        }`}>
                                                        {grade}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-center text-slate-400 text-sm">No marks recorded</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
            {students.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    No students found.
                </div>
            )}
        </div>
    );
};

export default PerformanceSummary;
