import React, { useState, useEffect } from 'react';
import '../Style.css';
import { Container } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';

const LogoSlider = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p>.</p>;
  }

  if (!clients.length) {
    return <p>No clients found.</p>;
  }

  return (
    <div className='bg-white m-0'>
      <section id='caros' className='section_padding past_e text-start py-5 w-100'>
      <h3 className='heading'>Past Employers
</h3>
      <Carousel 
        responsive={responsive} 
        arrows={true}
      >
        {clients.map((client) => (
          <div key={client._id} className='text-center'>
            <img className='slideimg'
              src={client.image.url} 
              alt={client.name} 
              title={client.name}
              height="auto"
              width="auto"
              style={{objectFit: 'cover' }} 
              loading='lazy'
            />
          </div>
        ))}
      </Carousel>
      </section>
    </div>
  );
};

export default LogoSlider;
