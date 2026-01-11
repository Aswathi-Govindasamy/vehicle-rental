import { useState } from "react";

const images = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/65.jpg",
];

const ImageCarousel = () => {
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex((index - 1 + images.length) % images.length);
  const next = () =>
    setIndex((index + 1) % images.length);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Image */}
      <div className="flex justify-center">
        <img
          src={images[index]}
          alt="Customer"
          className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white"
        />
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-9 h-9 flex items-center justify-center"
      >
        ‹
      </button>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-9 h-9 flex items-center justify-center"
      >
        ›
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i === index ? "bg-indigo-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
