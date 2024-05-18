import React from "react";

function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold font-serif text-center my-3">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-5">
        <div className="flex flex-col gap-2  flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="10"
            required
          />

          <div className="flex flex-wrap gap-6 mt-5 sm:flex-1">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bed"
                className="border p-2 border-gray-300 rounded-lg"
                min="1"
                max="10"
                required
              />
              <span>Bed</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="baths"
                className="border p-2 border-gray-300 rounded-lg"
                min="1"
                max="10"
                required
              />
              <span>Baths</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="price"
                className="border p-2 border-gray-300 rounded-lg w-36"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col">
                <span>Regular Price</span>
                <span className="text-sm items-center">($/Month)</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="Discount"
                className="border p-2 border-gray-300 rounded-lg w-36"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col items-center">
                <span>Discount Price</span>
                <span className="text-sm">($/Month)</span>
              </div>
            </div>
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
              type="file"
              id="images"
              accept="image/*"
              className="border p-1 rounded-lg border-gray-600"
              multiple
            />
            <button className="border rounded-lg text-white bg-green-400 p-2 font-semibold hover:shadow-lg disabled:opacity-50">
              Upload
            </button>
          </div>
          <button to='/create-listing'
        className="bg-slate-700 text-white rounded-lg p-3 text-center  mt-5 hover:opacity-90 disabled:opacity-50"
        > Create Listing</button>
        </div>
       
      </form>
    </main>
  );
}

export default CreateListing;
