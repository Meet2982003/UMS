import { useEffect, useState, type JSX } from "react";
import { authService } from "../services/authService";
import "../styles/Dashboard.css";

// ─── Interfaces ───────────────────────────────────────────────────────────────

type Role = "ROLE_ADMIN" | "ROLE_USER";

interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[];
}

interface EditedUser {
  username: string;
  email: string;
}

// ─── PasswordChangeModal ──────────────────────────────────────────────────────

interface PasswordChangeModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const PasswordChangeModel = ({
  isOpen,
  onClose,
  onSave,
}: PasswordChangeModelProps) => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      setError("Password does not match");
      return;
    }
    try {
      await authService.changePassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );
      onSave();
      onClose();
    } catch {
      setError("Failed to change the current password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="model-overlay">
      <div className="model-content">
        <h3>Change Password</h3>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="model-action">
          <button className="btn btn-secondry" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── UsersTable ───────────────────────────────────────────────────────────────

const UsersTable = (): JSX.Element => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response: User[] = await authService.getAllUsers();
        setAllUsers(response);
      } catch {
        setError("Failed to get users");
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      await authService.deleteUserById(userId);
      setAllUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch {
      console.error("Failed to delete the user");
    }
  };

  if (loading) return <div>loading users...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="users-table-container">
      <h3>Manage All Users</h3>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="btn bt-danger"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  DELETE USER
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedUser, setEditedUser] = useState<EditedUser>({
    username: "",
    email: "",
  });
  const [isPasswordModelOpen, setIsPasswordModelOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser: User = authService.getCurrentUser();
        setUser(currentUser);
        setEditedUser({
          username: currentUser.username,
          email: currentUser.email,
        });

        const userRoles: Role[] = currentUser.roles || [];
        setIsAdmin(userRoles.includes("ROLE_ADMIN")); // fixed typo: inccludes → includes
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await authService.updataProfile(editedUser);
      setUser((prev) => (prev ? { ...prev, ...editedUser } : prev));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update", error);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditedUser({ username: user.username, email: user.email });
    }
    setIsEditing(false);
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        {(["home", "profile", "settings"] as const).map((section) => (
          <div
            key={section}
            className={`dashboard-menu-item ${activeSection === section ? "active" : ""}`}
            onClick={() => setActiveSection(section)}
          >
            {section.toUpperCase()}
          </div>
        ))}
        {isAdmin && (
          <div
            className={`dashboard-menu-item ${activeSection === "users" ? "active" : ""}`}
            onClick={() => setActiveSection("users")}
          >
            USERS
          </div>
        )}
      </div>

      <div className="dashboard-content">
        {activeSection === "home" && (
          <div className="dashboard-home">
            <h2>Welcome, {user?.username}</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
              enim beatae necessitatibus vitae, quae laboriosam modi sapiente,
              assumenda culpa, fugit quia praesentium temporibus? Laborum
              officia error, aperiam rem temporibus illum excepturi voluptatem
              rerum delectus esse iure, non similique! Blanditiis tempore
              praesentium suscipit magnam, illo nobis eius facilis fugiat rem.
              Ipsum!
            </p>
          </div>
        )}

        {activeSection === "profile" && (
          <div className="dashboard-profile">
            <h2>User Profile Information</h2>
            <div className="profile-details">
              <div className="profile-field">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={
                    isEditing ? editedUser.username : (user?.username ?? "")
                  }
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={isEditing ? editedUser.email : (user?.email ?? "")}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="profile-actions">
                {!isEditing ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={handleEditToggle}
                    >
                      EDIT
                    </button>
                    <button
                      className="btn btn-secondry"
                      onClick={() => setIsPasswordModelOpen(true)}
                    >
                      CHANGE PASSWORD
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={handleSaveProfile}
                    >
                      SAVE
                    </button>
                    <button
                      className="btn btn-secondry"
                      onClick={handleCancelEdit}
                    >
                      CANCEL
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === "settings" && (
          <div className="dashboard-settings">
            <h2>SETTINGS</h2>
            <p>Settings Content</p>
          </div>
        )}

        {activeSection === "users" && isAdmin && <UsersTable />}
      </div>

      <PasswordChangeModel
        isOpen={isPasswordModelOpen}
        onClose={() => setIsPasswordModelOpen(false)}
        onSave={() => console.log("Password Changed Successfully")}
      />
    </div>
  );
};

export default Dashboard;
