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
      <div className="h-full flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48">
        {/* IMAGE CONTAINER */}
        <div className="h-1/2 lg:h-full lg:w-1/2 relative">
          <Image src="/hero.png" alt="" fill className="object-contain" />
        </div>
        {/* TEXT CONTAINER */}
        <div className="h-1/2 lg:h-full lg:w-1/2 flex flex-col gap-8 items-center justify-center">
          {/* TITLE */}
          <div className="flex flex-col gap-4 w-full">
            <h1 className="text-4xl md:text-6xl font-bold">
              {"Hi, I'm Fadel Muhammad."}
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-600">
              Backend & Full Stack Developer | Ai Engineer
            </h2>
          </div>
          {/* DESC */}
          <p className="md:text-xl text-gray-500">
            With over 5 years of experience building scalable backend architectures, high-performance APIs, microservices, and network monitoring systems using Golang, PHP, Node.js, and Java. Currently advancing into decentralized smart contracts and blockchain technology.
          </p>
          {/* BUTTONS */}
          <div className="w-full flex gap-4">
            <Link href="/portfolio">
              <button className="p-4 rounded-lg ring-1 ring-black bg-black text-white hover:bg-white hover:text-black transition-colors">
                View My Work
              </button>
            </Link>
            <Link href="/contact">
              <button className="p-4 rounded-lg ring-1 ring-black hover:bg-black hover:text-white transition-colors">
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
