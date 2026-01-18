import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Email と Password を入力してください");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "サインアップ失敗");
        return;
      }

      alert("サインアップ成功！そのままログインします。");
      navigate("/todos");
    } catch (err) {
      console.error(err);
      alert("サインアップエラー");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1>サインアップ</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={signup}>サインアップ</button>

      <p>
        すでにアカウントをお持ちですか？ <Link to="/login">ログイン</Link>
      </p>
    </div>
  );
}
