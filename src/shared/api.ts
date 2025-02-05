type User = {
  id: string;
  email: string;
};

export function fetchUsers(): Promise<User[]> {
  return fetch("http://localhost:3001/users")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      return [];
    });
}

export function createUser(user: User) {
  return fetch("http://localhost:3001/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user), // Убрали лишнюю вложенность
  }).then((res) => res.json());
}

export function deleteUser(userId: string) {
  return fetch(`http://localhost:3001/users/${userId}`, {
    method: "DELETE",
  }).then((res) => res.json());
}
