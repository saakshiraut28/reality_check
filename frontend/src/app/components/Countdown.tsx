/** @format */

import { motion } from "framer-motion";

interface CountdownProps {
  seconds: number;
}

export default function Countdown({ seconds }: CountdownProps) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="text-6xl font-bold text-blue-600"
    >
      {seconds}
    </motion.div>
  );
}
