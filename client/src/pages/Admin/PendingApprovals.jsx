import React, { useState, useEffect, useCallback } from 'react';
import api from '../../config/Api';
import toast from 'react-hot-toast';

// Helper function to show how long ago a user registered
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};


const PendingApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null); // Track which user's action is in progress

  const fetchPendingUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/pending-users', { withCredentials: true });
      setPendingUsers(res.data.users || []);
    } catch (error) {
      toast.error('Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  const handleUpdateStatus = async (userId, status) => {
    // Reject karne se pehle confirmation poochein
    if (status === 'rejected') {
      if (!window.confirm("Are you sure you want to reject and delete this user? This action cannot be undone.")) {
        return;
      }
    }
    
    setActionInProgress(userId); // Action start hone par button disable karein
    try {
      await api.put(`/admin/users/${userId}/status`, { status }, { withCredentials: true });
      toast.success(`User has been ${status}!`);
      // UI se user ko turant hatayein
      setPendingUsers(currentUsers => currentUsers.filter(user => user._id !== userId));
    } catch (error) {
      toast.error('Failed to update user status');
    } finally {
      setActionInProgress(null); // Action poora hone par button enable karein
    }
  };

  if (loading) {
    return <p className="text-center text-[#E0E0E0] p-4">Loading pending approvals...</p>;
  }

  return (
    <div className="bg-[#2C2C2C] p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#00BFA5]">Pending User Approvals</h2>
        <button onClick={fetchPendingUsers} className="text-sm text-[#00BFA5] hover:underline" disabled={loading}>
          Refresh List
        </button>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-[#9E9E9E]">No pending registrations at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map(user => (
            <div key={user._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#333] p-4 rounded-lg">
              <div>
                <p className="font-medium text-[#E0E0E0]">{user.fullName}</p>
                <p className="text-sm text-[#9E9E9E]">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Registered: {timeAgo(user.createdAt)}</p>
              </div>
              <div className="flex gap-4 mt-3 sm:mt-0">
                <button
                  onClick={() => handleUpdateStatus(user._id, 'approved')}
                  disabled={actionInProgress === user._id}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-gray-500 disabled:cursor-wait"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(user._id, 'rejected')}
                  disabled={actionInProgress === user._id}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:bg-gray-500 disabled:cursor-wait"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;