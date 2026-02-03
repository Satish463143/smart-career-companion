import React, { useState, useEffect } from 'react';
import { db, auth } from "../../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import './User.css'; // Assuming we'll create some styles or use inline/existing

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // For view modal

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(import.meta.env.VITE_BACKEND_URL+"/userList",{
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
        }
      })
      const data = await response.json()
      setUsers(data.result)
    } catch (error) {
      console.error("Error fetching users: ", error);
      alert("Error fetching users. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const confirmMessage = `Are you sure you want to ${newStatus === 'inactive' ? 'deactivate' : 'activate'} this user?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(import.meta.env.VITE_BACKEND_URL+`/userList/${userId}/status`,{
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
          },
          body:JSON.stringify({uid:userId,status:newStatus})
        })        
        // Update local state
        setUsers(users.map(user => 
            user.id === userId ? { ...user, status: newStatus } : user
        ));
      } catch (error) {
        console.error("Error updating user status:", error);
        alert("Failed to update status");
      }
    }
  };

  if (loading) {
    return <div className="admin_margin_box">Loading users...</div>;
  }

  return (
    <div className='admin_margin_box'>
      <h2>User Management</h2>
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="action-btn view-btn"
                    onClick={() => setSelectedUser(user)}
                  >
                    View
                  </button>
                  <button 
                    className={`action-btn ${user.status === 'active' ? 'deactivate-btn' : 'activate-btn'}`}
                    onClick={() => handleDeactivate(user.id, user.status)}
                  >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Profile</h3>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="profile-row">
                <strong>ID:</strong> <span>{selectedUser.id}</span>
              </div>
              <div className="profile-row">
                <strong>Name:</strong> <span>{selectedUser.name}</span>
              </div>
              <div className="profile-row">
                <strong>Email:</strong> <span>{selectedUser.email}</span>
              </div>
              <div className="profile-row">
                <strong>Role:</strong> <span>{selectedUser.role}</span>
              </div>
               <div className="profile-row">
                <strong>Status:</strong> 
                <span className={`status-badge ${selectedUser.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                    {selectedUser.status}
                </span>
              </div>
              {/* Add more fields here if available in user document */}
              {selectedUser.portfolio && (
                 <div className="profile-row">
                    <strong>Portfolio:</strong> <a href={selectedUser.portfolio} target="_blank" rel="noopener noreferrer">{selectedUser.portfolio}</a>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default User
