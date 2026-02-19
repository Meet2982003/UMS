import { useNavigate } from "react-router-dom";

const Mainpage = () => {
  const navigate = useNavigate();

  const handleGettingStarted = () => {
    navigate("/signup");
  };

  const handleLearnMore = () => {
    window.open("https://google.com", "_blank");
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the User Management App</h1>
      <div className="home-buttons">
        <button className="btn btn-primary" onClick={handleGettingStarted}>
          Getting Started
        </button>
        <button className="btn btn-secondry" onClick={handleLearnMore}>
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Mainpage;
