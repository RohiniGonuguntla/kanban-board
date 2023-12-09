// KanbanBoard.js
import React, { useState, useEffect } from "react";
import { fetchTickets, fetchUsers } from "../services/api";
import TicketCard from "./TicketCard.js";
import "./KanbanBoard.css"; 

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState("status");
  const [sortingOption, setSortingOption] = useState("priority");
  const [displayOptionsVisible, setDisplayOptionsVisible] = useState(false);

  // Declare statusOrder and priorityOrder here
  const statusOrder = ["Backlog", "Todo", "In progress", "Done", "Canceled"];
  const priorityOrder = [0, 4, 3, 2, 1];

  useEffect(() => {
    const fetchData = async () => {
      const ticketData = await fetchTickets();
      const userData = await fetchUsers();
      setTickets(ticketData);
      setUsers(userData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Retrieve stored options from localStorage
    const storedGroupingOption = localStorage.getItem("groupingOption");
    const storedSortingOption = localStorage.getItem("sortingOption");

    // Set options from storage or use default values
    setGroupingOption(storedGroupingOption || "status");
    setSortingOption(storedSortingOption || "priority");
  }, []);

  const groupTickets = () => {
    switch (groupingOption) {
      case "status":
        return tickets.reduce((grouped, ticket) => {
          const status = ticket.status;
          if (!grouped[status]) {
            grouped[status] = [];
          }
          grouped[status].push(ticket);
          return grouped;
        }, {});
      case "user":
        return tickets.reduce((grouped, ticket) => {
          const userId = ticket.userId;
          if (!grouped[userId]) {
            grouped[userId] = [];
          }
          grouped[userId].push(ticket);
          return grouped;
        }, {});
      case "priority":
        return tickets.reduce((grouped, ticket) => {
          const priority = ticket.priority;
          if (!grouped[priority]) {
            grouped[priority] = [];
          }
          grouped[priority].push(ticket);
          return grouped;
        }, {});
      default:
        return {};
    }
  };

  const sortedTickets = () => {
    const groupedTickets = groupTickets();

    // Sort based on custom order for groupingOption
    const sortedGroups = Object.keys(groupedTickets).sort((a, b) => {
      if (groupingOption === "status") {
        return statusOrder.indexOf(a) - statusOrder.indexOf(b);
      } else if (groupingOption === "priority") {
        return priorityOrder.indexOf(parseInt(a, 10)) - priorityOrder.indexOf(parseInt(b, 10));
      }
      return 0;
    });

    

    // Sort based on sortingOption (priority or title)
    sortedGroups.forEach((key) => {
      groupedTickets[key].sort((a, b) => {
        if (sortingOption === "priority") {
          return b.priority - a.priority;
        } else if (sortingOption === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    });

    const sortedTickets = Object.fromEntries(sortedGroups.map((group) => [group, groupedTickets[group]]));

    return sortedTickets;
  };



  const handleGroupingChange = (option) => {
    // Save selected grouping option to localStorage
    localStorage.setItem("groupingOption", option);
    setGroupingOption(option);
  };

  const handleSortingChange = (option) => {
    // Save selected sorting option to localStorage
    localStorage.setItem("sortingOption", option);
    setSortingOption(option);
  };

  const handleDisplayOptionsClick = () => {
    setDisplayOptionsVisible(!displayOptionsVisible);
  };

  const countTicketsByStatus = () => {
    const groupedTickets = groupTickets();
    const countByStatus = {};

    statusOrder.forEach((status) => {
      countByStatus[status] = groupedTickets[status]?.length || 0;
    });

    return countByStatus;
  };

  const countTicketsByUser = () => {
    const groupedTickets = groupTickets();
    const countByUser = {};

    Object.keys(groupedTickets).forEach((userId) => {
      const user = users.find((u) => u.id === userId);
      countByUser[userId] = {
        name: user ? user.name : "Unknown",
        initials: getInitials(user ? user.name : "Unknown"),
        available: user ? user.available : false,
        count: groupedTickets[userId].length,
      };
    });

    return countByUser;
  };

  const countTicketsByPriority = () => {
    const groupedTickets = groupTickets();
    const countByPriority = {};
  
    priorityOrder.forEach((priority) => {
      countByPriority[priority] = groupedTickets[priority]?.length || 0;
    });
  
    return countByPriority;
  };
  

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
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

  const getRandomColor = () => {
    // Array of possible colors
    const colors = ["#f44336", "#9c27b0", "#3f51b5", "#e91e63", "#2196f3", "#00bcd4", "#4caf50", "#ffeb3b", "#ff9800"];
    // Pick a random color
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return randomColor;
  };

  const getPriorityName = (priority) => {
    switch (priority) {
      case 4:
        return "Urgent";
      case 3:
        return "High";
      case 2:
        return "Medium";
      case 1:
        return "Low";
      case 0:
      default:
        return "No priority";
    }
  };
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

  return (
    <div className="kanban-board">
      <button onClick={handleDisplayOptionsClick} className="dis-cont">
        {displayOptionsVisible ? <div className="dis-btn">
          <img src="https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702151082/Vector_3_yvmo0z.svg" alt="display" className="dis-img"/>
          <p className="display">Display</p>
          <img src="https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702151216/fe_arrow-down_kvurzk.png" alt="arrow"/>
        </div>: <div className="dis-btn"> 
          <img src="https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702151082/Vector_3_yvmo0z.svg" alt="display" className="dis-img"/>
          <p>Display</p>
          <img src="https://res.cloudinary.com/dcpqh1jqe/image/upload/v1702151216/fe_arrow-down_kvurzk.png" alt="arrow"/>
        </div>}
      </button>

      {displayOptionsVisible && (
        <div className="options">
          <label>
            Grouping
            <select value={groupingOption} onChange={(e) => handleGroupingChange(e.target.value)}>
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>
          </label>
          <label>
            Ordering
            <select value={sortingOption} onChange={(e) => handleSortingChange(e.target.value)}>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </label>
        </div>
      )}


      {/* Render your Kanban board here */}
      <div className="group-container">
      {Object.keys(sortedTickets()).map((groupKey) => (
  <div key={groupKey} className="main-heading-container">
    {/* Display the priority image and name beside the main heading when grouped by priority */}
    {groupingOption === "priority" && (
      <div className="priority-info-container">
        <div className="priority-image-container">
          {/* Use the getPriorityImage function to get the priority image URL */}
          <img src={getPriorityImage(parseInt(groupKey, 10))} alt={`Priority ${groupKey}`} className="priority-image"/>
        </div>
        
      {/* Display the priority name and card count based on the priority level */}
      <p className="priority-name">{getPriorityName(parseInt(groupKey, 10))}</p>
    <p>{countTicketsByPriority()[groupKey] || 0}</p>
    
      </div>
    )}

    {/* Display the user initials and availability circle beside the main heading when grouped by user */}
    {groupingOption === "user" && (
      <div className="user-initial-container">
        <div className="user-initial-circle" style={{ backgroundColor: getRandomColor() }}>
          {countTicketsByUser()[groupKey]?.initials}
          {countTicketsByUser()[groupKey]?.available && <div className="availability-dot"></div>}
        </div>
      <p className="user-name">{countTicketsByUser()[groupKey]?.name}</p>
      <p>{countTicketsByUser()[groupKey]?.count || 0}</p>
    
      </div>
    )}

    
    {groupingOption === "status" && (
      <div className="status-image-container">
        <img src={getStatusImage(groupKey)} alt={`Status ${groupKey}`} className="status-image"/>
        
      <p className="status-name">{groupKey.charAt(0).toUpperCase() + groupKey.slice(1)}</p>
      <p>{countTicketsByStatus()[groupKey] || 0}</p>
    
      </div>
    )}

    
    {sortedTickets()[groupKey].map((ticket) => {
      const user = users.find((u) => u.id === ticket.userId);
      return (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          user={user}
          groupingOption={groupingOption}
          userInitial={user ? getInitials(user.name) : ""}
        />
      );
    })}
  </div>
))}
      </div>
    </div>
  );
};

export default KanbanBoard;
