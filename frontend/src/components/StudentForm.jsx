import React, { useState } from 'react';
import axios from 'axios';

const StudentForm = ({ onStudentAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        roll: '',
        email: '',
        class: 'FYMCA'
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:3001/api/students', formData);
            onStudentAdded(res.data);
            setFormData({ name: '', roll: '', email: '', class: 'FYMCA' });
        } catch (err) {
            setError(err.response?.data?.error || 'Error adding student');
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 transition-all hover:shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-2 border-slate-100">Add New Student</h2>
            {error && <p className="text-red-500 mb-4 text-sm font-medium bg-red-50 p-2 rounded">{error}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Roll No</label>
                    <input
                        type="text"
                        name="roll"
                        placeholder="R123"
                        value={formData.roll}
                        onChange={handleChange}
                        className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                        required
                    />
                </div>
                <div className="flex items-end">
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white p-3 rounded-lg font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.02] transition-all active:scale-95"
                    >
                        Add Student
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentForm;
