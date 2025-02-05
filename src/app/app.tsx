import { Routes, Route } from "react-router-dom";
import { TodoListPage } from "../pages/todo-list";
import { UsersPage } from "../pages/users";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<UsersPage />}></Route>
      <Route path="/:userId/tasks" element={<TodoListPage />}></Route>
    </Routes>
  );
}
