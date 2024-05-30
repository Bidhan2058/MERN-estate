import React from "react";

const Search = () => {
  return (
    <div className="flex flex-col md:flex-row ">
      <div className="p-3 border-b-2 md:border-r-2 md:min-h-screen sm:max-w-4xl sm:p-6 ">
        <form className="flex flex-col gap-6 ">
          <div className="flex items-center gap-3">
            <label className="whitespace-nowrap"> Search Term : </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="search..."
              className="p-3 rounded-lg w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap ">
            <label>Type: </label>
            <div>
              <input type="checkbox" id="all" className="w-5" />
              <span className="ml-2">Rent & Sale</span>
            </div>
            <div>
              <input type="checkbox" id="rent" className="w-5" />
              <span className="ml-2">Rent</span>
            </div>
            <div>
              <input type="checkbox" id="sale" className="w-5" />
              <span className="ml-2">Sale</span>
            </div>

            <div>
              <input type="checkbox" id="offer" className="w-5" />
              <span className="ml-2">offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap ">
            <label>Amenities: </label>
            <div>
              <input type="checkbox" id="parking" className="w-5" />
              <span className="ml-2">Parking</span>
            </div>
            <div>
              <input type="checkbox" id="furnished" className="w-5" />
              <span className="ml-2">Furnished</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <label>Sort</label>
            <select id="sort_order" className="rounded-md p-1">
            <option>Price high to low</option>
            <option>Price low to high</option>
            <option>latest</option>
            <option>oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 p-3 text-white rounded-lg hover:opacity-95 ">
            Submit
          </button>
        </form>
      </div>
      <div className="p-3 ">
        <h1 className="text-3xl text-slate-600 font-semibold ">Listing Result</h1>
      </div>
    </div>
  );
};

export default Search;
