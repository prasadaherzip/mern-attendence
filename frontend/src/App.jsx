import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './components/AdminDashboard';
import StudentCardList from './components/StudentCardList';
import AttendanceSummary from './components/AttendanceSummary';
import PerformanceSummary from './components/PerformanceSummary';
import BulkAttendance from './components/BulkAttendance';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/students');
      setStudents(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch students. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStudentAdded = (newStudent) => {
    setStudents([newStudent, ...students]);
  };

  const handleStudentDeleted = (id) => {
    setStudents(students.filter(student => student._id !== id));
  };

  const handleStudentUpdated = (updatedStudent) => {
    setStudents(students.map(student => (student._id === updatedStudent._id ? updatedStudent : student)));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-sm" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <StudentCardList students={students} />;
      case 'attendance':
        return <AttendanceSummary students={students} />;
      case 'performance':
        return <PerformanceSummary students={students} />;
      case 'login':
        return <BulkAttendance students={students} onUpdate={handleStudentUpdated} />;
      case 'admin':
        return (
          <AdminDashboard
            students={students}
            onStudentAdded={handleStudentAdded}
            onDelete={handleStudentDeleted}
            onUpdate={handleStudentUpdated}
          />
        );
      default:
        return <StudentCardList students={students} />;
    }
  };

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'performance', label: 'Performance' },
    { id: 'login', label: 'Login Attendance' },
    { id: 'admin', label: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 tracking-tight">
            Student Attendance and Performance Tracker
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Manage students, track attendance, and generate reports effortlessly.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          <nav className="flex flex-wrap gap-1" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 min-w-[120px] py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <main className="transition-all duration-300 ease-in-out">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
