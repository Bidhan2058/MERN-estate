import React, { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedroom: 1,
    bathroom: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const handleImageSubmit = (e) => {
    setUploading(true);
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  console.log(formData);
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: !formData[e.target.id],
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountedPrice)
        return setError("Discount price must be lower than regular price");
      setloading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      console.log(data);
      setloading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setloading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold font-serif text-center my-3">
        Create a Listing
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col sm:flex-row gap-5"
      >
        <div className="flex flex-col gap-2  flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex flex-wrap  gap-6 mt-5">
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5 ">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bedroom"
                className="border p-2 border-gray-300 rounded-lg"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedroom}
              />
              <span>Bed</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bathroom"
                className="border p-2 border-gray-300 rounded-lg"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bathroom}
              />
              <span>Baths</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="regularPrice"
                className="border p-2 border-gray-300 rounded-lg w-36"
                min="50"
                max="10000000"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col">
                <span>Regular Price</span>

                <span className="text-sm items-center">
                  {formData.type === "rent" && "($/Month)"}
                </span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="discountedPrice"
                  className="border p-2 border-gray-300 rounded-lg w-36"
                  min="0"
                  max="1000000o"
                  required
                  onChange={handleChange}
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col items-center">
                  <span>Discount Price</span>
                  <span className="text-sm items-center">
                    {formData.type === "rent" && "($/Month)"}
                  </span>{" "}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex mt-5 flex-col gap-4 flex-1">
          <div className="flex gap-3">
            <span className="text-l  font-semibold"> Images:</span>
            <span className="font-normal text-gray-600">
              First image will be cover
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              className="border p-1 rounded-lg border-gray-600"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="border rounded-lg text-white bg-green-400 p-2 font-semibold hover:shadow-lg disabled:opacity-50"
              style={{ opacity: uploading ? "0.5" : "1" }}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-500">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                className="flex justify-between p-3 border rounded-lg items-center "
                key={url}
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg hover:opacity-65"
                >
                  delete
                </button>
              </div>
            ))}
          <button
            to="/create-listing"
            className="bg-slate-700 text-white rounded-lg p-3 text-center  mt-5 hover:opacity-90 disabled:opacity-50"
            style={{ opacity: loading || uploading ? "0.5" : "1" }}
            disabled={loading || uploading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
