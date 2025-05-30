import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const ImageSlider = () => {
  const products = [
    {
      name: "Guitar",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Piano",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Drum Set",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Violin",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Microphone",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Synthesizer",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Bass Guitar",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Trumpet",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Saxophone",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Flute",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Harmonica",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Electric Guitar",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Accordion",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Banjo",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Tambourine",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Cello",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Clarinet",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Oboe",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Triangle",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
    {
      name: "Maracas",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
    },
  ];

  const [index, setIndex] = useState<number>(0);

  const slideStyle = {
    transform: `translateX(${-25 * index}%)`,
  };

  const showNextImage = () => {
    setIndex((index) => (index === products.length - 3 ? 0 : index + 1));
  };

  const showPreviousImage = () => {
    setIndex((index) => (index === 0 ? products.length - 3 : index - 1));
  };

  return (
    <>
      {products.length > 0 && (
        <div className="slider-wrapper">
          {/* Slider Container */}
          <div className="slider-track" style={slideStyle}>
            {products.map((p, i) => (
              <div className="slide">
                <Link key={i} to={`/product/asd`} >
                  <img src={p.image} alt="" className="slide-image" />
                </Link>
                <h3>{p.name}</h3>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button onClick={showPreviousImage} className="slider-button left">
            <ArrowBigLeft />
          </button>
          <button onClick={showNextImage} className="slider-button right">
            <ArrowBigRight />
          </button>
        </div>
      )}
    </>
  );
};
