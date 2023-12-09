// api.js
const API_URL = "https://api.quicksell.co/v1/internal/frontend-assignment";

const fetchTickets = async () => {
  const response = await fetch(`${API_URL}`);
  const data = await response.json();
  return data.tickets;
};

const fetchUsers = async () => {
  const response = await fetch(`${API_URL}`);
  const data = await response.json();
  return data.users;
};

export { fetchTickets, fetchUsers };
