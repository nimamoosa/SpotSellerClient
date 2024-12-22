"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useController } from "@/contexts/controllerContext";

const Alert: React.FC = () => {
  const { alerts, removeAlert } = useController();

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    alerts.forEach((alert) => {
      const timer = setTimeout(() => {
        removeAlert(alert.id); // Automatically remove alert after timeout
      }, alert.timeout);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout); // Cleanup timers on unmount
    };
  }, [alerts, removeAlert]);

  const typeStyles = {
    success:
      "bg-gradient-to-tr from-purple-900/60 to-purple-800 from-30% backdrop-filter backdrop-blur-xl text-white border-2 border-blue-900",
    error: "bg-red-900/80 text-white backdrop-filter backdrop-blur-md",
    info: "bg-blue-800 text-white border-blue-700",
    warning: "bg-yellow-800 text-white border-yellow-700",
  };

  return (
    <div dir="ltr">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`fixed top-4 right-4 max-w-sm w-full p-4 mb-4 rounded-2xl border-2 ${
              typeStyles[alert.type || "success"]
            } z-50`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-light`}>{alert.text}</span>
              <button
                onClick={() => removeAlert(alert.id)}
                className="ml-4 text-2xl rounded-xl text-white font-bold focus:outline-none active:text-black transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Progress bar with countdown */}
            <div className="relative mt-3 w-full h-1 rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-teal-200 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: alert.timeout / 1000, ease: "linear" }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Alert;
