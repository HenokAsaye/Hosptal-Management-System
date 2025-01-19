import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header/Header";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import apiClient from "../../../lib/util";
import classes from "./ManageUser.module.css";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateFormVisible, setUpdateFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get("/admin/users");
        const { users, patients, Admins } = response.data;
        setUsers([...users, ...patients, ...Admins]);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  // Delete a user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      const response = await apiClient.delete(`/admin/delete-User?userId=${userId}`);
      if (response.data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        alert(response.data.message || "User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
      alert("An error occurred while deleting the user.");
    } finally {
      setLoading(false);
    }
  };

  // Show update form
  const showUpdateForm = (user) => {
    setSelectedUser({
      ...user,
      age: user.age || "",
      contact: user.contact || "",
      PaymentStatus: user.PaymentStatus || "",
      address: user.address || { region: "", city: "", woreda: "" },
    });
    setUpdateFormVisible(true);
  };

  // Update user details
  const handleUpdate = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await apiClient.put("/admin/user", {
        userId: selectedUser._id,
        ...selectedUser,
      });

      if (response.data.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === selectedUser._id
              ? {
                  ...user,
                  ...response.data.user, // Update fields from backend
                }
              : user
          )
        );

        alert(response.data.message || "User updated successfully");
        setUpdateFormVisible(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error updating user:", error.message);
      alert("An error occurred while updating the user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <Header role="Admin" isLoggedIn={true} />
      <div className={classes.layout}>
        <Sidebar />
        <div className={classes.main}>
          <h2>User Management</h2>

          {/* User List */}
          <div className={classes.card}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className={classes.editButton}
                          onClick={() => showUpdateForm(user)}
                        >
                          Edit
                        </button>
                        <button
                          className={classes.deleteButton}
                          onClick={() => handleDelete(user._id)}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Update Form */}
          {updateFormVisible && selectedUser && (
            <div className={classes.overlay}>
              <div className={classes.updateForm}>
                <h3>Update User</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate();
                  }}
                >
                  <div className={classes.formGroup}>
                    <label>Name</label>
                    <input
                      type="text"
                      value={selectedUser.name || ""}
                      onChange={(e) =>
                        setSelectedUser((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className={classes.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      value={selectedUser.email || ""}
                      onChange={(e) =>
                        setSelectedUser((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className={classes.formGroup}>
                    <label>Role</label>
                    <select
                      value={selectedUser.role || ""}
                      onChange={(e) =>
                        setSelectedUser((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="Doctor">Doctor</option>
                      <option value="Patient">Patient</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Pharmacist">Pharmacist</option>
                      <option value="Laboratorist">Laboratorist</option>
                    </select>
                  </div>

                  <button type="submit" className={classes.saveButton} disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className={classes.cancelButton}
                    onClick={() => {
                      setUpdateFormVisible(false);
                      setSelectedUser(null);
                    }}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
