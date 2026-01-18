import { useNavigate, Link} from "react-router-dom";
import { apiFetch } from "../api/auth";

export default function UsersDelete() {
  const navigate = useNavigate();

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


  const deleteUser = async () => {
    if (!window.confirm("本当にアカウントを削除しますか？ この操作は元に戻せません。")) return;
    try {
      const res = await apiFetch("/users", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "削除失敗");
        return;
      }
      alert("アカウントを削除しました");
      navigate("/signup"); 
    } catch (err) {
      if (err.message === "AUTH_EXPIRED") {
      await forceLogout("expired");
      return;
  }
  alert("通信エラーが発生しました");
}
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1>アカウント削除</h1>
      <p>アカウントを削除すると、すべてのTodoが消えます。</p>
      <button onClick={deleteUser} style={{ backgroundColor: "red", color: "white" }}>
        アカウントを削除
      </button>
      <p><button><Link to="/todos">戻る</Link></button></p>
    </div>
  );
}
