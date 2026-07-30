import React, { useState } from "react";
import { Search, Filter, UserCheck, ShieldAlert, Edit2, Trash2, RotateCcw, UserPlus, Eye, CheckCircle, Ban, X, Sparkles } from "lucide-react";

interface UserManagementProps {
  users: any[];
  token: string;
  onRefresh: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, token, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPlan, setFilterPlan] = useState("All");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", currentPlan: "Free Seeker", status: "Active" });
  const [loading, setLoading] = useState(false);

  const userList = Array.isArray(users) ? users : [];
  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || u.status === filterStatus;
    const matchesPlan = filterPlan === "All" || u.currentPlan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      currentPlan: user.currentPlan,
      status: user.status,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenView = (user: any) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleSaveUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({
          id: selectedUser?.id,
          ...editForm,
        }),
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to update user", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: any, newStatus: string) => {
    try {
      await fetch("/api/admin/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          status: newStatus,
        }),
      });
      onRefresh();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (!confirm(`Are you sure you want to permanently delete user ${user.email}?`)) return;

    try {
      await fetch("/api/admin/users/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ id: user.id, email: user.email }),
      });
      onRefresh();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleResetSubscription = async (user: any) => {
    const newPlan = prompt(`Enter new plan name for ${user.email} (Free Seeker / Mystic Pro Monthly / Vedic Master Annual):`, "Mystic Pro Monthly");
    if (!newPlan) return;

    try {
      await fetch("/api/admin/users/reset-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ email: user.email, planName: newPlan }),
      });
      onRefresh();
    } catch (err) {
      console.error("Failed to reset subscription", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <span>User Directory & Management</span>
            <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full font-sans border border-amber-500/30">
              {filteredUsers.length} Users Found
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search, filter, view profiles, manage subscriptions, suspend, activate, or edit registered accounts.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedUser(null);
            setEditForm({ name: "", email: "", currentPlan: "Free Seeker", status: "Active" });
            setIsEditModalOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 text-sm self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Suspended">Suspended Only</option>
            <option value="Banned">Banned Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value="All">All Plans</option>
            <option value="Free Seeker">Free Seeker</option>
            <option value="Mystic Pro Monthly">Mystic Pro Monthly</option>
            <option value="Vedic Master Annual">Vedic Master Annual</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 uppercase font-mono">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Registration</th>
                <th className="py-3.5 px-4">Current Plan</th>
                <th className="py-3.5 px-4">AI Chats</th>
                <th className="py-3.5 px-4">Tokens Used</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No users matching search filters found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-slate-200">{u.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                      {u.registrationDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md font-medium border ${
                        u.currentPlan.includes("Master")
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                          : u.currentPlan.includes("Pro")
                          ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}>
                        {u.currentPlan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {u.totalAiChats || 0}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">
                      {(u.totalTokensUsed || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                        u.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}>
                        {u.status === "Active" ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenView(u)}
                          title="View Profile Details"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(u)}
                          title="Edit User"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResetSubscription(u)}
                          title="Reset / Upgrade Subscription"
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        {u.status === "Active" ? (
                          <button
                            onClick={() => handleToggleStatus(u, "Suspended")}
                            title="Suspend Account"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(u, "Active")}
                            title="Activate Account"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(u)}
                          title="Delete Account"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-100 mb-4">
              {selectedUser ? "Edit User Record" : "Add New User Account"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subscription Plan</label>
                <select
                  value={editForm.currentPlan}
                  onChange={(e) => setEditForm({ ...editForm, currentPlan: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                >
                  <option value="Free Seeker">Free Seeker</option>
                  <option value="Mystic Pro Monthly">Mystic Pro Monthly</option>
                  <option value="Vedic Master Annual">Vedic Master Annual</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Account Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Banned">Banned</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm"
                >
                  {loading ? "Saving..." : "Save User Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Profile Drawer / Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-lg font-serif">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">{selectedUser.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 block">Rashi (Moon Sign)</span>
                <span className="font-semibold text-amber-300">{selectedUser.rashi || "Aries"}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 block">Lagna (Ascendant)</span>
                <span className="font-semibold text-amber-300">{selectedUser.lagna || "Cancer"}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 block">Date of Birth</span>
                <span className="font-semibold text-slate-200">{selectedUser.dob || "1994-08-15"}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 block">Place of Birth</span>
                <span className="font-semibold text-slate-200">{selectedUser.pob || "New Delhi, India"}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 block">Total AI Consultations</span>
                <span className="font-semibold text-slate-200 font-mono">{selectedUser.totalAiChats || 0}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 block">Total AI Tokens</span>
                <span className="font-semibold text-slate-200 font-mono">{(selectedUser.totalTokensUsed || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
