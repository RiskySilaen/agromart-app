import React, { useEffect, useState } from "react";

function OpeningAnimation() {
  const [morphDone, setMorphDone] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);
  const [zoomDone, setZoomDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Sequence 1: Morph shape
    setTimeout(() => {
      setMorphDone(true);
    }, 1200);

    // Sequence 2: Show text
    setTimeout(() => {
      setTextVisible(true);
    }, 1200);

    // Sequence 3: Show final screen
    setTimeout(() => {
      setFinalVisible(true);
    }, 3000);

    // Sequence 4: Zoom logo
    setTimeout(() => {
      setZoomDone(true);
    }, 3100);

    // Sequence 5: Hide overlay
    setTimeout(() => {
      setHidden(true);
    }, 5000);
  }, []);

  if (hidden) return null;

  return (
    <div
      id="opening-overlay"
      className="fixed top-0 left-0 w-full h-full z-9999 bg-black flex items-center justify-center transition-opacity duration-1000 ease-out"
      style={{
        opacity: hidden ? 0 : 1,
        zIndex: 9999,
      }}
    >
      <div
        id="present-text"
        className="font-serif text-white text-2xl lg:text-3xl absolute right-1/2 transition-all duration-1000 ease-out"
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "translateX(50px)" : "translateX(0)",
          right: "55%",
        }}
      >
        PRESENT
      </div>

      <div
        id="morph-shape"
        className="w-20 h-20 bg-gradient-to-br from-agro-green via-green-400 to-white shadow-lg absolute z-20 rounded-lg transition-all duration-1000"
        style={{
          borderRadius: morphDone ? "50%" : "10%",
          transform: morphDone
            ? "translateX(50px) rotate(45deg)"
            : "translateX(0) rotate(0deg)",
        }}
      ></div>

      <div
        id="final-logo-screen"
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-agro-green via-green-300 to-agro-light flex items-center justify-center transition-opacity duration-1000 ease-in-out z-30"
        style={{
          opacity: finalVisible ? 1 : 0,
          pointerEvents: finalVisible ? "auto" : "none",
        }}
      >
        <div className="flex flex-col items-center">
          <div
            id="final-logo-img"
            className="w-48 h-48 bg-white rounded-full flex items-center justify-center border-4 border-agro-green shadow-2xl transition-transform duration-1500 ease-out"
            style={{
              transform: zoomDone ? "scale(1)" : "scale(0.5)",
            }}
          >
            <i className="fas fa-leaf text-6xl text-agro-green"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpeningAnimation;
