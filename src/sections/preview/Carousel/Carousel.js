import React, { useState, useEffect } from 'react';
import { Paper, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const Carousel = ({ carousel }) => {
  const { slides } = carousel;

  const [[page, direction], setPage] = useState([0, 0]);
  const [imageIndex, setImageIndex] = useState(0);

  const handleImageIndex = () => {
    try {
      if (imageIndex + 1 >= slides.length) {
        setImageIndex(0);
      } else {
        setImageIndex((index) => index + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleImageIndex();
    }, 3000);
  }, [imageIndex]);

  return (
    <Paper>
      <AnimatePresence initial={false} custom={direction}>
        {slides ? (
          <Tooltip title={slides[imageIndex]?.link}>
            <a href={slides[imageIndex]?.link} target="_blank" rel="noreferrer">
              <motion.img
                key={page}
                src={slides[imageIndex]?.image}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                transition={{
                  x: { stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                style={{ marginTop: 30, height: 430, width: '100%', borderRadius: 5 }}
              />
            </a>
          </Tooltip>
        ) : null}
      </AnimatePresence>
    </Paper>
  );
};

export default Carousel;
