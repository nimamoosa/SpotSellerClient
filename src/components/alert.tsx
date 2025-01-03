import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useController } from "@/contexts/controllerContext";

const Alert: React.FC = () => {
  const { alerts, removeAlert } = useController();

  useEffect(() => {
    // Set timeouts to remove alerts after their timeout period
    alerts.forEach((alert) => {
      if (alert.timeout === Infinity) return;

      setTimeout(() => {
        removeAlert(alert.id);
      }, alert.timeout);
    });
  }, [alerts, removeAlert]);

  const typeStyles = {
    success:
      "bg-gray-300/50 backdrop-filter backdrop-blur-[8px] shadow-xl border border-black/5",
    error: "bg-red-500/50 backdrop-filter backdrop-blur-[8.5px] shadow-xl",
    info: "bg-blue-800/40 backdrop-filter backdrop-blur-[7px] shadow-xl",
    warning: "bg-yellow-400/50 backdrop-filter backdrop-blur-[8px] shadow-xl",
  };

  return (
    <div
      dir="ltr"
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-[90%] max-w-[400px]"
    >
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }} // Exit with both x and y
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`min-w-[150px] max-w-full max-h-fit min-h-[70px] cursor-pointer p-2 flex items-center justify-between rounded-[22px] ${
              typeStyles[alert.type || "success"]
            }`}
            drag="y" // Allow dragging in the Y direction
            dragConstraints={{ top: -100, bottom: 0 }} // Limit drag range
            dragElastic={0.2} // Make the drag a bit elastic
            onDragEnd={(event, info) => {
              // If the alert is dragged enough (in the negative Y direction)
              if (info.offset.y < -100) {
                removeAlert(alert.id); // Remove the alert
              }
            }}
            layout // Enable layout animations for repositioning
          >
            {alert.loading && (
              <div className="flex items-center justify-center h-full mr-3">
                <div className="spinner flex items-center justify-center">
                  <div className="bar1"></div>
                  <div className="bar2"></div>
                  <div className="bar3"></div>
                  <div className="bar4"></div>
                  <div className="bar5"></div>
                  <div className="bar6"></div>
                  <div className="bar7"></div>
                  <div className="bar8"></div>
                  <div className="bar9"></div>
                  <div className="bar10"></div>
                  <div className="bar11"></div>
                  <div className="bar12"></div>
                </div>
              </div>
            )}

            <div className="w-full h-full flex justify-center items-center">
              <span className="font-medium text-sm" dir="rtl">
                {alert.text}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Alert;
