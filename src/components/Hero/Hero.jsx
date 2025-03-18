import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ className }) => {
  const variants = {
    hidden: { opacity: 0, y: -800 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`w-full bg-[url("./assets/herobg.png")] flex h-screen bg-cover bg-no-repeat bg-top ${className}`}
      initial="hidden"
      animate="visible"
      variants={variants}
      exit="hidden"
      transition={{ duration: 0.85, ease: "easeInOut" }}
    >
      {/* Nội dung của Hero có thể để trống nếu chỉ dùng làm background */}
    </motion.div>
  );
};

export default Hero;