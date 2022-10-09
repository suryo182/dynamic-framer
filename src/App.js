import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

function App() {
  const ghostRefY = useRef();
  const [transformY, setTransformY] = useState(0);
  const [viewportH, setViewportH] = useState(0);
  const { scrollYProgress } = useScroll();

  const onResize = useCallback((entries) => {
    for (let entry of entries) {
      setViewportH(entry.contentRect.height);
    }
  }, []);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => onResize(entries));
    resizeObserver.observe(ghostRefY.current);
    return () => resizeObserver.disconnect();
  }, [onResize]);

  return (
    <div ref={ghostRefY} className="h-screen">
      <motion.div
        style={{ y: transformY }}
        className="p-8 h-max flex flex-col gap-y-4"
      >
        <div className="bg-red-500 h-36">Red</div>
        <div className="bg-green-500 h-36">Green</div>
        <div className="bg-blue-500 h-36">Blue</div>
        <div className="bg-yellow-500 h-36">Yellow</div>
        <div className="bg-orange-500 h-36">Orange</div>
        <div className="bg-pink-500 h-36">Pink</div>
      </motion.div>
      <Nav scrollYProgress={scrollYProgress} setTransformY={setTransformY} />
    </div>
  );
}

const Nav = ({ scrollYProgress, setTransformY }) => {
  const ghostRef = useRef();
  const scrollRef = useRef();
  const [scrollRange, setScrollRange] = useState(0);
  const [viewportW, setViewportW] = useState(0);
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -scrollRange + viewportW]
  );
  const physics = { damping: 15, mass: 0.27, stiffness: 55 };
  const spring = useSpring(transform, physics);

  useLayoutEffect(() => {
    scrollRef && setScrollRange(scrollRef.current.scrollWidth);
  }, [scrollRef]);

  const onResize = useCallback((entries) => {
    for (let entry of entries) {
      setViewportW(entry.contentRect.width);
    }
  }, []);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => onResize(entries));
    resizeObserver.observe(ghostRef.current);
    return () => resizeObserver.disconnect();
  }, [onResize]);

  return (
    <motion.div
      ref={scrollRef}
      className="fixed bottom-4 w-[80%] transform -translate-x-1/2 left-1/2 h-max rounded-2xl bg-green-200 cursor-pointer overflow-x-hidden"
    >
      <motion.div
        drag="x"
        style={{ x: spring }}
        onDrag={(event, pan) => {
          event.preventDefault();
          setTransformY(pan.offset.x);
        }}
        dragConstraints={scrollRef}
        className="flex gap-x-1 w-max px-4"
      >
        <div className="text-red-500 py-1 px-2 h-max">Red</div>
        <div className="text-green-500 py-1 px-2 h-max">Green</div>
        <div className="text-blue-500 py-1 px-2 h-max">Blue</div>
        <div className="text-yellow-500 py-1 px-2 h-max">Yellow</div>
        <div className="text-orange-500 py-1 px-2 h-max">Orange</div>
        <div className="text-pink-500 py-1 px-2 h-max">Pink</div>
      </motion.div>
      <div ref={ghostRef} className="w-full" />
    </motion.div>
  );
};

export default App;
