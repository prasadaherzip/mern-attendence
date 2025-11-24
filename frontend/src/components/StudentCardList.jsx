import React from 'react';

const StudentCardList = ({ students }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
                <div key={student._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {student.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{student.name}</h3>
                            <p className="text-sm text-slate-500 font-mono">{student.roll}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Class</span>
                            <span className="font-medium text-slate-700">{student.class}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Email</span>
                            <span className="font-medium text-slate-700 truncate max-w-[150px]">{student.email}</span>
                        </div>
                    </div>
                </div>
            ))}
            {students.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-400">
                    No students found.
                </div>
            )}
        </div>
    );
};

export default StudentCardList;
