import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const ProductGrid = ({ products }) => {
  const [inView, setInView] = useState(new Array(products.length).fill(false));
  const productRefs = useRef([]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = productRefs.current.findIndex(
            (ref) => ref === entry.target
          );
          if (index !== -1) {
            setInView((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        }
      });
    }, options);

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [products]);

  const productRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#productGrid") {
      const element = productRef.current;
      const offsetTop = element.offsetTop - 100; // Adjust for the margin
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  }, [location]);

  return (
    <div className="container mx-auto py-10 px-4">
      <h2
        ref={productRef}
        className="text-3xl font-bold text-center mb-8 text-purple-800"
      >
        Our Exquisite Collections
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <div
            key={product._id}
            ref={(el) => (productRefs.current[index] = el)}
            className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              inView[index]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{
              transitionDelay: `${index * 30}ms`,
            }}
          >
            <Link to={`/product/${product._id}`}>
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-300 transform hover:scale-110"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                  <span className="text-white text-lg font-semibold">
                    View Details
                  </span>
                </div>
                <div className="absolute top-2 right-2 bg-purple-700 text-white text-xs px-2 py-1 rounded-full">
                  {product.rating}/5
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-purple-700 font-bold text-lg">
                    ₹{product.price.toFixed(2)}
                  </p>
                  <span className="text-sm text-gray-500">{product.brand}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 text-sm">
                    Made from: {product.madeFrom}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
