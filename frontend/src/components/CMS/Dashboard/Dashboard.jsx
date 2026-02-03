import React, { useState, useEffect } from 'react';
import { auth } from "../../../firebase";
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        adminCount: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/userList", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            const users = data.result || [];

            // Calculate Stats
            const total = users.length;
            const active = users.filter(u => u.status === 'active').length;
            const admins = users.filter(u => u.role === 'admin').length;

            setStats({
                totalUsers: total,
                activeUsers: active,
                adminCount: admins
            });

            // Get Recent Users (First 5)
            // Assuming the list might not be sorted by date from backend, but usually lists are appended. 
            // If there's a createdAt field, sorting would be better. For now, taking the first 5 or last 5 depending on API order.
            // Let's assume standard order is oldest first, so we reverse for recent.
            // If the API returns mostly random or ID sorted, this is a best-effort "Recent".
            const sortedUsers = [...users].reverse().slice(0, 5);
            setRecentUsers(sortedUsers);

        } catch (error) {
            console.error("Error fetching dashboard data: ", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="admin_margin_box">Loading dashboard...</div>;
    }

    return (
        <div className='admin_margin_box'>
            <div className="dashboard-container">
                {/* Stats Row */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <div className="stat-value">{stats.totalUsers}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Active Users</h3>
                        <div className="stat-value" style={{ color: '#10b981' }}>{stats.activeUsers}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Administrators</h3>
                        <div className="stat-value" style={{ color: '#6366f1' }}>{stats.adminCount}</div>
                    </div>
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Registrations</h2>
                        <Link to="/admin/users" className="view-all-link">View All Users &rarr;</Link>
                    </div>
                    <div className="dashboard-table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name || 'N/A'}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <span style={{ 
                                                color: user.status === 'active' ? '#10b981' : '#ef4444',
                                                fontWeight: 500,
                                                textTransform: 'capitalize'
                                            }}>
                                                {user.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', color: '#888' }}>No recent users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div className="quick-actions-grid">
                        <Link to="/admin/users" className="action-card">
                            Manage Users
                        </Link>
                        {/* Placeholder for future features */}
                        <div className="action-card" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                            Site Settings (Coming Soon)
                        </div>
                        <div className="action-card" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                            Audit Logs (Coming Soon)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;