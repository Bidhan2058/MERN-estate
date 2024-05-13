import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);

        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-3 mx-auto max-w-md">
      <div className="text-3xl text-center font-semibold mb-5">SignIn</div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 ">
        <input
          type="email"
          placeholder="email"
          className="border rounded-lg p-2 shadow-md focus:shadow-lg focus:outline-none "
          id="email"
          autoComplete="off"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border rounded-lg p-2 shadow-md focus:shadow-lg focus:outline-none "
          id="password"
          autoComplete="off"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="p-3 bg-slate-700 text-white rounded-lg 
        hover:opacity-95
        disabled:opacity-50"
        >
          {loading ? "loading...." : "SignIn"}
        </button>
      </form>
      <div className="mt-4 gap-2">
        <span>Dont hanve a account? </span>
        <Link to="/sign-up" className="text-sky-500 ">
          Sign Up
        </Link>
      </div>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}

export default SignIn;
