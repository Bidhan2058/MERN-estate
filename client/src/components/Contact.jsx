import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log(listing);
    const fetchLandLord = async () => {
      try {
        const response = await fetch(`/api/user/${listing.userRef}`);
        const data = await response.json();
        setLandLord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandLord();
  }, [listing.userRef]);
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div>
      {landLord && (
        <div className="flex flex-col gap-4">
          <p>
            Contact{" "}
            <span className="text-xl font-semibold">{landLord.username}</span>{" "}
            for <span className="text-lg font-bold">{listing.name}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleChange}
            placeholder="Enter-your message"
            className="p-3 rounded-lg "
          />
          <Link
            to={`mailto:${landLord.email}?subject=Regarding${listing.name}&body=Hi ${landLord.username},${message}`}
            className="bg-slate-700 p-3 rounded-lg text-white hover:opacity-85 flex justify-center"
          >
            Send Message
          </Link>
          
        </div>
      )}
    </div>
  );
};

export default Contact;
