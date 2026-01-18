import { useEffect, useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { apiFetch } from "../api/auth";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const navigate = useNavigate();

  // ログアウト関数
  const forceLogout = async (type) => {
    try {
      await apiFetch("/auth/logout", { method: "PUT" });
    } catch (_) {}

    if (type === "expired") {
      alert("ログイン情報を失ったので、再度ログインしてください");
    } else {
      alert("ログアウトしました");
    }

    navigate("/login");
  };

  const fetchTodos = async () => {
    try {
      const res = await apiFetch("/todos");
      const data = await res.json();
      data.sort((a, b) => a.id - b.id);
      setTodos(data);
    } catch (err) {
      if (err.message === "AUTH_EXPIRED") {
        forceLogout("expired");
      }
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;

    try {
      const res = await apiFetch("/todos", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
      setTitle("");
    } catch (err) {
      if (err.message === "AUTH_EXPIRED") forceLogout("expired");
    }
  };

  const updateTodo = async (id, newTitle, isComplete) => {
    try {
      await apiFetch(`/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title: newTitle, is_complete: isComplete }),
      });
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, title: newTitle, is_complete: isComplete } : todo
        )
      );
    } catch (err) {
      if (err.message === "AUTH_EXPIRED") forceLogout("expired");
    }
  };

  const deleteTodo = async (id) => {

    try {
      await apiFetch(`/todos/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      if (err.message === "AUTH_EXPIRED") forceLogout("expired");
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const saveEdit = async (todo) => {
    if (!editingTitle.trim()) return;
    await updateTodo(todo.id, editingTitle, todo.is_complete);
    setEditingId(null);
    setEditingTitle("");
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1>Todo</h1>

      <button onClick={() => forceLogout("manual")}>ログアウト</button>

      <div style={{ marginTop: "16px" }}>
        <input
          placeholder="新しいTodo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTodo}>追加</button>
      </div>

      <ul style={{ marginTop: "16px" }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: "8px" }}>
            <input
              type="checkbox"
              checked={todo.is_complete}
              onChange={() => updateTodo(todo.id, todo.title, !todo.is_complete)}
            />

            {editingId === todo.id ? (
              <>
                <input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(todo)}>保存</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    marginLeft: "8px",
                    textDecoration: todo.is_complete ? "line-through" : "none",
                  }}
                >
                  {todo.title}
                </span>
                <button style={{ marginLeft: "8px" }} onClick={() => startEdit(todo)}>
                  編集
                </button>
              </>
            )}

            <button style={{ marginLeft: "8px" }} onClick={() => deleteTodo(todo.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>
      <p>
        アカウントを削除しますか？ <Link to="/delete">削除する</Link>
      </p>
    </div>
  );
}
