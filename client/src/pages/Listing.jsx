import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const[contact, setContact] = useState(false)
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await response.json();
        setListing(data);
        setLoading(false);
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, []);
  return (
    <main>
      {loading && (
        <p className="text-3xl font-semibold font-sans text-center">
          Loading...
        </p>
      )}
      {error && (
        <p className="text-3xl font-semibold font-sans text-center text-red-600">
          Something went wrong!!!!
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[300px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - $ {listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center gap-2 text-slate-600 text-sm">
              <FaMapMarkedAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-green-600 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${listing.discountedPrice}
                  {listing.type === "rent" && " / month"}
                  {"  "}OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedroom > 1
                  ? `${listing.bedroom} beds `
                  : `${listing.bedroom} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathroom > 1
                  ? `${listing.bathroom} baths `
                  : `${listing.bathroom} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            { !contact &&currentUser && listing.userRef !== currentUser._id && (
              <button 
              onClick={()=>setContact(true)}
              className="bg-slate-700 p-3 rounded-lg text-white hover:opacity-85">
                Contact LandLoard
              </button>
            )}
            {contact && <Contact listing={listing}/>}
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
