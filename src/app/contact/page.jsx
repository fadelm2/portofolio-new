"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const ContactPage = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const text = "Say Hello";

  const form = useRef();
  const recaptchaRef = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();
    setError(false);
    setSuccess(false);

    const token = recaptchaRef.current?.getValue();
    if (!token) {
      alert("Please complete the reCAPTCHA!");
      return;
    }

    const formData = new FormData(form.current);
    const user_email = formData.get("user_email");
    const user_message = formData.get("user_message");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email,
          user_message,
          token,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        form.current.reset();
        recaptchaRef.current?.reset();
      } else {
        setError(true);
        recaptchaRef.current?.reset();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(true);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      <div className="h-full flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48">
        {/* TEXT CONTAINER */}
        <div className="h-1/2 lg:h-full lg:w-1/2 flex items-center justify-center text-6xl">
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
          className="h-1/2 lg:h-full lg:w-1/2 bg-red-50 rounded-xl text-xl flex flex-col gap-8 justify-center p-24"
        >
          <span>Dear Fadel,</span>
          <textarea
            rows={6}
            className="bg-transparent border-b-2 border-b-black outline-none resize-none"
            name="user_message"
          />
          <span>My mail address is:</span>
          <input
            name="user_email"
            type="text"
            className="bg-transparent border-b-2 border-b-black outline-none"
          />
          <span>Regards</span>
          <div className="my-2">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            />
          </div>
          <button className="bg-purple-200 rounded font-semibold text-gray-600 p-4">
            Send
          </button>
          {success && (
            <span className="text-green-600 font-semibold">
              Your message has been sent successfully!
            </span>
          )}
          {error && (
            <span className="text-red-600 font-semibold">
              Something went wrong!
            </span>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default ContactPage;
