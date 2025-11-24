import React, { useState } from 'react';
import axios from 'axios';

const MarksTable = ({ student, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        subject: '',
        score: '',
        total: 100
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.put('http://localhost:3001/api/students/marks', {
                studentId: student._id,
                subject: formData.subject,
                score: Number(formData.score),
                total: Number(formData.total)
            });
            onUpdate(res.data);
            setFormData({ subject: '', score: '', total: 100 });
        } catch (err) {
            setError(err.response?.data?.error || 'Error adding marks');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Academic Marks</h2>
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
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">{error}</div>}

                    <form onSubmit={handleSubmit} className="flex gap-4 mb-8 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Math"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                                required
                            />
                        </div>
                        <div className="w-24 space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</label>
                            <input
                                type="number"
                                name="score"
                                placeholder="0"
                                value={formData.score}
                                onChange={handleChange}
                                className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                                required
                            />
                        </div>
                        <div className="w-24 space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</label>
                            <input
                                type="number"
                                name="total"
                                placeholder="100"
                                value={formData.total}
                                onChange={handleChange}
                                className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md shadow-primary-500/20 transition-all active:scale-95 h-[42px]"
                        >
                            Add
                        </button>
                    </form>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Subject</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Score</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Total</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Percentage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {student.marks && student.marks.length > 0 ? (
                                    student.marks.map((mark, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50">
                                            <td className="p-4 font-medium text-slate-800">{mark.subject}</td>
                                            <td className="p-4 text-slate-600">{mark.score}</td>
                                            <td className="p-4 text-slate-600">{mark.total}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(mark.score / mark.total) >= 0.4
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {((mark.score / mark.total) * 100).toFixed(2)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-400">No marks recorded</td>
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

export default MarksTable;
