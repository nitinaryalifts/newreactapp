import React, { useState, useEffect } from 'react';
import '../Style.css';
import { Container } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';

const LogoSlider = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false); // State to track if the user reached the last slide

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('https://mancuso.ai/mancusov2/wp-json/v1/past-employers');
        console.log(response.data);
        setClients(response.data.clients);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 769 },
      items: 5,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 3,
      slidesToSlide: 1,
    },
  };

  // Function to detect if the last slide is reached
  const handleAfterChange = (previousSlide, { currentSlide, totalItems }) => {
    if (currentSlide === totalItems - 1) {
      setIsEnd(true);  // Set to true when the last slide is reached
    } else {
      setIsEnd(false); // Reset when the user navigates back
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!clients.length) {
    return <p>No clients found.</p>;
  }

  return (
    <div className='bg-white m-0'>
      <section id='caros' className='section_padding past_e text-start py-5 w-100'>
        <h3 className='heading'>Past Employers</h3>
        <Carousel 
          responsive={responsive} 
          arrows={true}
          afterChange={handleAfterChange}  // Track when the user reaches the last slide
        >
          {clients.map((client) => (
            <div key={client._id} className='text-center'>
              <img className='slideimg'
                src={client.image.url} 
                alt={client.name} 
                style={{objectFit: 'cover' }} 
              />
            </div>
          ))}
        </Carousel>

        {/* Conditionally render a button when the last slide is reached */}
        {isEnd && (
          <div className="text-center mt-4">
            <button className="btn btn-primary" onClick={() => alert('You have reached the end of the carousel!')}>
              End of Carousel
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default LogoSlider;
