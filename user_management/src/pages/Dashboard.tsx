import { useEffect, useState } from "react";
import authService from "../services/authService";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  //password model
  const [isPasswordModelOpen, setIsPasswordModelOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setEditedUser(currentUser);

        //check if user role is admin or user
        const userRoles = currentUser.roles || [];
        setIsAdmin(userRoles.inccludes("ROLE_ADMIN"));
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div
          className={`dashboard-menu-item ${activeSection === "home" ? "active" : ""}`}
          onClick={() => setActiveSection("home")}
        >
          HOME
        </div>
        <div
          className={`dashboard-menu-item ${activeSection === "profile" ? "active" : ""}`}
          onClick={() => setActiveSection("profile")}
        >
          PROFILE
        </div>
        <div
          className={`dashboard-menu-item ${activeSection === "settings" ? "active" : ""}`}
          onClick={() => setActiveSection("settings")}
        >
          SETTINGS
        </div>
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
            <h2>Welcome , {user?.username}</h2>
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
                  value={isEditing ? editedUser.username : user?.username}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="profile-field">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={isEditing ? editedUser.email : user?.email}
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
                      onClick={() => isPasswordModelOpen(true)}
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

        {activeSection === "users" && isAdmin && <userTable />}
      </div>
    </div>
  );
};
