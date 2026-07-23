"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const Homepage = () => {
  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      <div className="h-full overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 py-4 lg:py-0">
        {/* IMAGE CONTAINER */}
        <div className="h-1/3 lg:h-full lg:w-1/2 relative min-h-[220px] lg:min-h-0 flex-shrink-0">
          <Image src="/hero.png" alt="Hero" fill className="object-contain" />
        </div>
        {/* TEXT CONTAINER */}
        <div className="h-auto min-h-[66%] lg:h-full lg:w-1/2 flex flex-col gap-4 sm:gap-6 lg:gap-6 items-center lg:items-start justify-center py-6 lg:py-0 lg:overflow-y-auto">
          {/* TITLE */}
          <div className="flex flex-col gap-2 w-full text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {"Hi, I'm Fadel Muhammad."}
            </h1>
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-600">
              Backend & Full Stack Developer | Ai Engineer
            </h2>
          </div>
          {/* DESC */}
          <p className="text-sm lg:text-base text-gray-500 leading-relaxed text-center lg:text-left max-w-xl">
            With over 5 years of experience building scalable backend architectures, high-performance APIs, microservices, and network monitoring systems using Golang, PHP, Node.js, and Java. Currently advancing into decentralized smart contracts and blockchain technology.
          </p>
          {/* BUTTONS */}
          <div className="w-full flex gap-4 justify-center lg:justify-start">
            <Link href="/portfolio">
              <button className="p-3 rounded-lg ring-1 ring-black bg-black text-white hover:bg-white hover:text-black transition-colors text-sm font-semibold">
                View My Work
              </button>
            </Link>
            <Link href="/contact">
              <button className="p-3 rounded-lg ring-1 ring-black hover:bg-black hover:text-white transition-colors text-sm font-semibold">
                Contact Me
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Homepage;
