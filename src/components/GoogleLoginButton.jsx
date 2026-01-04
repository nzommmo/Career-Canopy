import { GoogleLogin } from "@react-oauth/google";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse?.credential;
    if (!token) return alert("No credential returned from Google");

    try {
      const res = await API.post("auth/google/", { token });

      if (res.status === 200 && res.data.access && res.data.refresh) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        navigate("/dashboard");
      } else {
        alert("Google login failed: unexpected response");
      }
    } catch (err) {
      console.error(err);
      alert("Google login failed: network or verification error");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => alert("Google login failed")}
      useOneTap
    />
  );
}
