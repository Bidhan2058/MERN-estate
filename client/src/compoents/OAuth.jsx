import React from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result._tokenResponse.displayName,
          email: result._tokenResponse.email,
          avatar: result._tokenResponse.photoUrl,
        }),
      });
      const data = res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.log(err);
      navigate("/sign-up");
    }
  };

  return (
    <button
      onClick={handleGoogle}
      type="button"
      // disabled={loading}
      className="p-3 bg-white border text-black rounded-lg 
               hover:opacity-95 disabled:opacity-50 flex items-center"
    >
      <FcGoogle className="mr-4" />
      <p>Google Sign In</p>
    </button>
  );
}

export default OAuth;
