"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useController } from "@/contexts/controllerContext";

const Alert: React.FC = () => {
  const { alerts, removeAlert } = useController();
  const timers = useRef(new Set<number>()); // Use Set to track active timers

  useEffect(() => {
    alerts.forEach((alert) => {
      if (!timers.current.has(Number(alert.id))) {
        const timer = setTimeout(() => {
          removeAlert(alert.id);
          timers.current.delete(Number(alert.id));
        }, alert.timeout);

        timers.current.add(Number(alert.id));
      }
    });

    return () => {
      timers.current.forEach((id) => {
        clearTimeout(id);
      });
      timers.current.clear();
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
    <div
      dir="ltr"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[350px]"
    >
      <AnimatePresence>
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            layout // Automatically animates position changes
            className={`max-w-sm w-full p-4 rounded-2xl border-2 ${
              typeStyles[alert.type || "success"]
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-light">{alert.text}</span>
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
