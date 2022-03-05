const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username || !room) return { error: 'Username and room are required.' };

  const existingUser = users.find(
    (user) => user.username === username && user.room === room
  );
  if (existingUser) return { error: 'Username is taken in this room.' };

  const user = { id, username, room };
  users.push(user);
  return { users };
};

const removeUser = (id) => {
  // findIndex is faster than filter because it stops after id is found.
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

// getUser
const getUser = ({ id, username, room }) => {};

// getUsersInRoom
const getUsersInRoom = ({ id, username, room }) => {};

// Testing Code
addUser({ id: 1, username: 'MongKong   ', room: '12345678' });
addUser({ id: 12, username: '    MongChick', room: '12345678' });
addUser({ id: 123, username: 'MongKong   ', room: '5678' });
const res = addUser({
  id: 1234,
  username: '   ',
  room: ' 3 ',
});

removeUser(12);

console.log(users);
console.log(res);
