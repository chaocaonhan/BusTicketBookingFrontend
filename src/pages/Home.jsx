import React from 'react';
import Hero from '../components/Hero/Hero';
import SearchBox from '../components/SearchBox/SearchBox';
import Layout from './Layout';

const Home = () => {
  return (
    <Layout>
      <div className="relative w-full min-h-screen">
        
        <Hero className="absolute top-0 left-0 w-full h-full z-0" />
        
        
        <div className="relative z-10 pt-2"> 
          <div className="container mx-auto px-4">
            <SearchBox className="w-full max-w-3xl mx-auto p-4" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;