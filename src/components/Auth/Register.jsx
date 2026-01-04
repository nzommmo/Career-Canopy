import { useState } from "react";
import API from "../../api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("auth/register/", { email, password });
      setMessage(res.data.message || "Registered successfully");
    } catch (err) {
      setMessage(err.response?.data?.error || "Error registering");
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border mb-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border mb-2"
        required
      />
      <button type="submit" className="bg-blue-600 text-white p-2 w-full">
        Register
      </button>
      {message && <p className="mt-2">{message}</p>}
    </form>
  );
}
