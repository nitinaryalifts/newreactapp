import React, { useEffect, useState } from 'react';
import '../Style.css';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';

function Portfolio() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("https://mancuso.ai/wp-json/v1/portfolio-categories")
            .then((resp) => {
                console.log(resp.data);
                setData(resp.data);
            });
    }, []);

    return (
        <div className='main_Content'>
            <section className='portfolio_section section_padding py-5 bg-white'>
                <h2 className='section-title text-start'>Portfolio</h2>
                <h5 className='section-description text-end'>My Works</h5>
            </section>
            <section className='portfolio_content bg-white'>
                {data.length > 0 ? (
                    data.map((item, key) => (
                        <h1 key={key}>{item.name}</h1>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </section>
        </div>
    );
}

export default Portfolio;