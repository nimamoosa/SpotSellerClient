import React, { useState, useEffect } from "react";

const InstallButton: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null); // اصلاح نوع
  const [isVisible, setIsVisible] = useState(false); // مقدار پیش‌فرض تغییر یافت

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault(); // جلوگیری از نمایش پیش‌فرض
      setInstallPrompt(event); // ذخیره رویداد
      setIsVisible(true); // نمایش دکمه نصب
    };

    window.addEventListener("beforeinstallprompt", (e) => {
      handleBeforeInstallPrompt(e);
      console.log("hi");
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt(); // نمایش پنجره نصب
      const choiceResult = await installPrompt.userChoice; // نتیجه انتخاب
      console.log("User choice:", choiceResult.outcome);

      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }

      setInstallPrompt(null); // پاک کردن رویداد
      setIsVisible(false); // مخفی کردن دکمه
    }
  };

  if (!isVisible) {
    return null; // نمایش ندادن دکمه
  }

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <button
        onClick={handleInstallClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        نصب برنامه
      </button>
    </div>
  );
};

export default InstallButton;
