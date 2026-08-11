"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const ContactPage = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const text = "Let's Build Together";

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
        <div className="min-h-[200px] lg:h-full lg:w-1/2 flex flex-col items-center justify-center py-6 lg:py-0 gap-8">
          <div className="text-4xl sm:text-5xl lg:text-6xl text-center lg:text-left">
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

          {/* WHATSAPP CTA BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col items-center lg:items-start gap-2"
          >
            <span className="text-sm font-medium text-gray-500">
              Or reach out directly via WhatsApp:
            </span>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890"}?text=Hi%20Fadel,%20I'm%20interested%20in%20discussing%20a%20project!`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 fill-current"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Chat on WhatsApp</span>
            </a>
          </motion.div>
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
