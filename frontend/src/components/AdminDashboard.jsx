import React from 'react';
import StudentForm from './StudentForm';
import StudentList from './StudentList';

const AdminDashboard = ({ students, onStudentAdded, onDelete, onUpdate }) => {
    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Admin Controls</h2>
                <p className="text-slate-500 mb-6">Add new students and manage existing records.</p>
                <StudentForm onStudentAdded={onStudentAdded} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Student Registry</h2>
                <StudentList
                    students={students}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
