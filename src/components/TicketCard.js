import React from "react";
import "./TicketCard.css";

const TicketCard = ({ ticket, user, groupingOption, userInitial }) => {
  const getPriorityImage = (priority) => {
    // Priority image URLs
    const priorityImages = [
      "https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702120734/three-dots_fvswed.svg",
      "https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702121107/reception-2_zjqvdb.svg",
      "https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702120975/reception-3_as1wic.svg",
      "https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702120179/reception-4_fcgqu6.svg",
      "https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702149655/Vector_2_mogc1y.png",
    ];

    // Ensure priority is within the range [0, 4]
    const priorityIndex = Math.min(Math.max(priority, 0), 4);
    return priorityImages[priorityIndex];
  };

  const getStatusImage = (status) => {
    // Status image URLs
    const statusImages = {
      "Backlog": "https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702125980/dash-circle-dotted_ysuqwy.svg",
      "Todo": "https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702125255/circle_n02yat.svg",
      "In progress": "https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702148773/Vector_2_sib5ul.svg",
      // Add more statuses and their respective image URLs
    };
  
    return statusImages[status] || ""; // Return the image URL or an empty string if not found
  };

  const getDotColor = (available) => {
    // Return yellow if available, otherwise, green
    return available ? "#FFEB3B" : "green"; // Yellow for available, Green for not available
  };

  const getRandomColor = () => {
    // Array of possible colors
    const colors = ["#f44336", "#9c27b0", "#3f51b5", "#e91e63", "#2196f3", "#00bcd4", "#4caf50", "#ffeb3b", "#ff9800"];
    // Pick a random color
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return randomColor;
  };

  return (
    <div className="ticket-card">
      <div >
        <p className="status-id">{ticket.id}</p>
        <div className="sub-card">
        {(groupingOption !== "status" || groupingOption === "priority" )&& (
            <div className="status-image-container">
              <img src={getStatusImage(ticket.status)} alt={`Status ${ticket.status}`} />
            </div>
          )}
          <h3 className="status-heading">{ticket.title}</h3>
        </div>

        <div className="sub-ticket-card">
          {groupingOption !== "priority" && (
            <div className="priority-image-container">
              <img src={getPriorityImage(ticket.priority)} alt={`Priority ${ticket.priority}`} />
            </div>
          )}
          <p className="request-para">
          <img src="https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702149013/codicon_circle-filled_zofiip.svg" alt="filled-circle"/>{ticket.tag.join(", ")}
          </p>
        </div>
        {/* {groupingOption !== "user" && groupingOption !== "status" && (
          <>
            <p>User: {user ? user.name : "Unknown"}</p>
            <p>Available: {user && user.available ? "Yes" : "No"}</p>
          </>
        )} */}
      </div>
      <div>
        {(groupingOption === "status" || groupingOption === "priority") && (
          <p><div className="user-initial-circle" style={{ backgroundColor: getRandomColor() }}>
          {userInitial}
          {user && user.available && <div className="availability-dot" style={{ backgroundColor: getDotColor(user.available) }}></div>}
        </div></p>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
