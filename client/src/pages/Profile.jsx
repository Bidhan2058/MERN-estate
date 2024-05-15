import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState("0");
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        const progess = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        setFilePercentage(Math.round(progess));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Include cookies in the request
      });
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-serif font-semibold m-4 text-center">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col  gap-3 ">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full w-14 h-14 object-cover self-center"
          src={formData.avatar || currentUser.avatar}
          alt="User Avatar"
        />
        <p className="text-sm self-center">
          {fileError ? (
            <span className="text-red-600">Error image upaload</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-600">
              {`uploading ${filePercentage}%`}
            </span>
          ) : filePercentage === 100 ? (
            <span className="text-green-600">
              image successfully uploaded!{" "}
            </span>
          ) : (
            ""
          )}{" "}
        </p>
        <input
          type="text"
          defaultValue={currentUser.username}
          className="border rounded-lg p-2 shadow-md focus:shadow-lg focus:outline-none   "
          id="username"
          autoComplete="off"
          onChange={handleChange}
        />
        <input
          type="text"
          defaultValue={currentUser.email}
          className="border rounded-lg p-2 shadow-md focus:shadow-lg focus:outline-none   "
          id="email"
          autoComplete="off"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="password"
          className="border rounded-lg p-2 shadow-md focus:shadow-lg focus:outline-none   "
          id="password"
          autoComplete="off"
          onChange={handleChange}
        />
        <button
          className="p-3 bg-slate-700 text-white rounded-lg 
        hover:opacity-95
        disabled:opacity-50"
        >
          Update
        </button>
      </form>
      <div className="text-red-600 flex justify-between ml-2 mr-2">
        <span>Delete Account</span>
        <span>signout</span>
      </div>
    </div>
  );
}

export default Profile;
