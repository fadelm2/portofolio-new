"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const ContactPage = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const text = "Say Hello";

  const form = useRef();
  const recaptchaRef = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();
    setError(false);
    setSuccess(false);
    setErrorMessage("");

    const token = recaptchaRef.current?.getValue();
    if (!token) {
      alert("Please complete the reCAPTCHA!");
      return;
    }

    const formData = new FormData(form.current);
    const user_name = formData.get("user_name");
    const user_email = formData.get("user_email");
    const user_phone = formData.get("user_phone");
    const user_message = formData.get("user_message");

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name,
          user_email,
          user_phone,
          user_message,
          token,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess(true);
        form.current.reset();
        recaptchaRef.current?.reset();
      } else {
        setError(true);
        setErrorMessage(data.error || "Something went wrong!");
        recaptchaRef.current?.reset();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(true);
      setErrorMessage("Network error or failed to send message.");
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      <div className="h-full flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 overflow-y-auto lg:overflow-hidden py-6 lg:py-0">
        {/* TEXT CONTAINER */}
        <div className="min-h-[160px] lg:h-full lg:w-1/2 flex items-center justify-center text-5xl sm:text-6xl py-4 lg:py-0">
          <div>
            {text.split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
              >
                {letter}
              </motion.span>
            ))}
            😊
          </div>
        </div>
        {/* FORM CONTAINER */}
        <form
          onSubmit={sendEmail}
          ref={form}
          className="h-auto min-h-max lg:h-[90%] lg:w-1/2 bg-red-50 rounded-xl text-lg sm:text-xl flex flex-col gap-4 sm:gap-5 justify-center p-8 sm:p-12 lg:p-14 overflow-y-auto shadow-sm self-center"
        >
          <span className="font-medium text-gray-700">Dear Fadel,</span>
          <textarea
            rows={4}
            className="bg-transparent border-b-2 border-b-black outline-none resize-none placeholder:text-gray-400"
            name="user_message"
            placeholder="Write your message here..."
            required
          />
          <span className="font-medium text-gray-700">My name is:</span>
          <input
            name="user_name"
            type="text"
            className="bg-transparent border-b-2 border-b-black outline-none placeholder:text-gray-400"
            placeholder="Your Name"
            required
          />
          <span className="font-medium text-gray-700">My mail address is:</span>
          <input
            name="user_email"
            type="email"
            className="bg-transparent border-b-2 border-b-black outline-none placeholder:text-gray-400"
            placeholder="your.email@example.com"
            required
          />
          <span className="font-medium text-gray-700">My phone number is:</span>
          <input
            name="user_phone"
            type="tel"
            className="bg-transparent border-b-2 border-b-black outline-none placeholder:text-gray-400"
            placeholder="+62 812 3456 7890"
          />
          <span className="font-medium text-gray-700">Regards</span>
          <div className="my-2">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            />
          </div>
          <button
            disabled={loading}
            className="bg-purple-200 hover:bg-purple-300 transition-colors rounded font-semibold text-gray-700 p-4 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
          {success && (
            <span className="text-green-600 font-semibold">
              Your message has been sent successfully!
            </span>
          )}
          {error && (
            <span className="text-red-600 font-semibold">
              {errorMessage || "Something went wrong!"}
            </span>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default ContactPage;
