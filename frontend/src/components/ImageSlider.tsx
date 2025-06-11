import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";

export const ImageSlider = () => {
  const { products } = useProducts();

  const [index, setIndex] = useState<number>(0);

  const slideStyle = {
    transform: `translateX(${-25 * index}%)`,
  };

  const showNextImage = () => {
    setIndex((index) => (index === products.length - 4 ? 0 : index + 1));
  };

  const showPreviousImage = () => {
    setIndex((index) => (index === 0 ? products.length - 4 : index - 1));
  };

  return (
    <>
      {products.length > 0 && (
        <div className="slider-wrapper">
          <div className="slider-track" style={slideStyle}>
            {products.map((p, i) => (
              <div key={i} className="slide">
                <Link to={`/subscription`}>
                  <img src={p.image} alt="" className="slide-image" />
                </Link>
                <h3>{p.product_name}</h3>
              </div>
            ))}
          </div>

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
