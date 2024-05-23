import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
console.log(listing)
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
                  className='h-[300px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
};

export default Listing;
