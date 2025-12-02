import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="container mx-auto flex-grow flex items-center justify-center p-6 min-h-[80vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-6xl">
        <div className="flex justify-center md:justify-end">
          <div className="w-72 h-72 md:w-96 md:h-96 rounded-full flex items-center justify-center bg-white shadow-xl border-4 border-agro-green overflow-hidden animate-fade-in-up">
            <i className="fas fa-leaf text-9xl text-agro-green"></i>
          </div>
        </div>
        <div
          className="text-center md:text-left space-y-6 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h1 className="font-serif text-3xl md:text-5xl text-gray-900 leading-tight">
            Setiap sayur, buah, dan hasil kebun yang Anda beli adalah bentuk
            cinta Anda kepada alam dan petani Indonesia.
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-lg mx-auto md:mx-0">
            Bersama Sayang Agromart, mari membangun rantai pangan yang lebih
            sehat, berkelanjutan, dan penuh kepedulian.
          </p>
          <Link
            to="/products"
            className="inline-block bg-agro-green hover:bg-green-800 text-white font-bold py-3 px-10 rounded-full shadow-lg transition uppercase text-sm tracking-wider mt-4"
          >
            See More
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
