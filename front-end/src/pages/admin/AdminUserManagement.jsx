import React, { useState } from "react";
import '../../styles/admin-user-management.css'

const AdminUserManagement = () => {
  // Simplified admin user model: only email and password are required
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = (formData.email || '').trim().toLowerCase();
    const password = formData.password || '';
    if (!email || !password) {
      alert('Please provide email and password');
      return;
    }

    if (selectedIndex === null) {
      // create new admin; prevent duplicate emails
      if (admins.find(a => a.email === email)) {
        alert('An admin with this email already exists');
        return;
      }
      setAdmins([...admins, { email, password }]);
      setFormData({ email: '', password: '' });
      alert('Admin user created');
    } else {
      // update existing admin's password
      const updated = admins.slice();
      updated[selectedIndex] = { ...updated[selectedIndex], password };
      setAdmins(updated);
      setSelectedIndex(null);
      setFormData({ email: '', password: '' });
      alert('Admin password updated');
    }
  };

  const filteredAdmins = admins.filter(a => (a.email || '').toLowerCase().includes(search.toLowerCase()));

  const handleSelectAdmin = (index) => {
    const a = admins[index];
    setSelectedIndex(index);
    setFormData({ email: a.email, password: '' });
  };

  const handleDelete = (index) => {
    if (!confirm('Delete this admin account?')) return;
    const updated = admins.slice();
    updated.splice(index, 1);
    setAdmins(updated);
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setFormData({ email: '', password: '' });
    }
  };

  const handleCancel = () => {
    setSelectedIndex(null);
    setFormData({ email: '', password: '' });
  };

  return (
    <div className="aum-container">
      <div className="aum-header">
        <div>
          <div className="aum-title">Admin User Management</div>
          <div className="aum-sub">Create admin users and update their passwords</div>
        </div>
        <div className="aum-badge">Admin</div>
      </div>

      <div className="aum-grid">
        <div className="aum-card">
          <form className="aum-form" onSubmit={handleSubmit}>
            <div className="aum-row">
              <div className="full">
                <label className="aum-label">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="aum-input" placeholder="admin@university.edu" required disabled={selectedIndex !== null} />
              </div>
            </div>

            <div className="aum-row">
              <div className="full">
                <label className="aum-label">Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} className="aum-input" placeholder={selectedIndex === null ? 'Create a password' : 'New password to update'} required />
              </div>
            </div>

            <div className="aum-actions">
              <button type="button" className="aum-btn-ghost" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="aum-btn-primary">{selectedIndex === null ? 'Create Admin' : 'Update Password'}</button>
            </div>
          </form>
        </div>

        <div>
          <div className="aum-card">
            <div className="aum-list-header">
              <div>
                <div className="aum-list-title">Admin Accounts</div>
                <div className="muted">Search and update passwords</div>
              </div>
              <div className="aum-search">
                <input className="aum-input" placeholder="Search by email" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="aum-list">
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((a, idx) => (
                  <div key={idx} className="item">
                    <div>
                      <div className="font-medium">{a.email}</div>
                      <div className="meta">Admin account</div>
                    </div>
                    <div style={{display: 'flex', gap: 8}}>
                      <button className="aum-btn-ghost" onClick={() => handleSelectAdmin(idx)}>Edit</button>
                      <button className="aum-btn-ghost" onClick={() => handleDelete(idx)}>Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="aum-empty">No admin accounts yet — create one using the form.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;