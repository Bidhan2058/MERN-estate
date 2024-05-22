import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Link } from "react-router-dom";

import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [showListingError, setShowListingError] = useState(false);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState("0");
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [list, setList] = useState({});
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
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };
  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      console.log(error.message);
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignout = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
      }
      dispatch(signoutUserSuccess(data));
    } catch (err) {
      dispatch(signoutUserFailure(err.message));
    }
  };
  const handleShowList = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setList(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  const handleListDelete = () => {};
  const handleListEdit = () => {};

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
            <span className="text-green-600">image successfully uploaded!</span>
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
          disabled={loading}
          className="p-3 bg-slate-700 text-white rounded-lg 
        hover:opacity-95
        disabled:opacity-50"
        >
          {loading ? "loading..." : "Update Profile"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-500 text-white rounded-lg p-3 text-center hover:opacity-90"
        >
          Create Listing
        </Link>
      </form>
      <div className="text-red-600 flex justify-between ml-2 mr-2">
        <span onClick={handleDeleteAccount} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          signout
        </span>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {updateSuccess && (
        <p className="text-green-600">user is updated successfully !!</p>
      )}

      <button
        onClick={handleShowList}
        type="button"
        className="bg-green-500 text-white rounded-lg p-3 hover:opacity-90 mt-2  w-full"
      >
        SHOW MY LISTINGS
      </button>
      <p className="text-red-500 text=sm">
        {showListingError && "Error showing error"}
      </p>
      {list.length > 0 &&
        <div>

       <h1 className="font-bold text-lg text-center my-5">
        YOUR LISTING
       </h1>
       { list.map((l) => (
          <div
            key={l._id}
            className=" p-2 rounded-lg mt-2 gap-4 border-b-4 flex justify-evenly items-center"
          >
            <Link to={`/listing/${l._id}`}>
              <img
                src={l.imageUrls[0]}
                alt="listing image"
                className="h-16 w-16 object-contain"
              />
            </Link>
            <Link
              to={`/listing/${l._id}`}
              className="font-bold text-slate-500  truncate"
            >
              {l.name}
            </Link>
            <div className="flex flex-col">
              <button
                type="button"
                onClick={handleListDelete}
                className="text-red-500 font-bold"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={handleListEdit}
                className="text-green-500 font-bold"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
        </div>
        
        }
    </div>
  );
}

export default Profile;
