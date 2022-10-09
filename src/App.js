import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

function App() {
  const { scrollYProgress } = useScroll();

  return (
    <div>
      <div className="p-8 flex flex-col gap-y-4">
        <Item name="Red" color="red" />
        <Item name="Green" color="green" />
        <Item name="Blue" color="blue" />
        <Item name="Yellow" color="yellow" />
        <Item name="Orange" color="orange" />
        <Item name="Pink" color="pink" />
      </div>
      <Nav scrollYProgress={scrollYProgress} />
    </div>
  );
}

const Nav = ({ scrollYProgress }) => {
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
      className="fixed bottom-4 w-[80%] transform -translate-x-1/2 left-1/2 h-max rounded-2xl bg-green-200 cursor-pointer overflow-x-scroll"
    >
      <motion.div
        drag="x"
        onDrag={(event, pan) => {
          console.log(spring);
        }}
        style={{ x: spring }}
        dragConstraints={scrollRef}
        className="flex gap-x-1 w-max px-4"
      >
        <ItemNav name="Red" color="red" />
        <ItemNav name="Green" color="green" />
        <ItemNav name="Blue" color="blue" />
        <ItemNav name="Yellow" color="yellow" />
        <ItemNav name="Orange" color="orange" />
        <ItemNav name="Pink" color="pink" />
      </motion.div>
      <div ref={ghostRef} className="w-full" />
    </motion.div>
  );
};

const Item = ({ name, color }) => {
  return <div className={`bg-${color}-500 h-36`}>{name}</div>;
};

const ItemNav = ({ name, color }) => {
  return <div className={`text-${color}-500 py-1 px-2 h-max`}>{name}</div>;
};

export default App;
