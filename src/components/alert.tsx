import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useController } from "@/contexts/controllerContext";

const Alert: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(5);

  const { alert, setAlert, onCloseAlert } = useController();

  useEffect(() => {
    if (!alert) return;

    setSecondsLeft(5); // Reset countdown when alert is visible
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer); // Cleanup the timer
          setTimeout(() => {
            setAlert(null);
            onCloseAlert && onCloseAlert();
          }, 0); // Avoid state update during render
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [alert, setAlert]);

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
        {alert && (
          <motion.div
            key="alert"
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
                onClick={() => {
                  setAlert(null);
                  onCloseAlert && onCloseAlert();
                }}
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
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Alert;
