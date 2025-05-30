import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reset password for:", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
 
      <div className="flex-grow">
        <div className="max-w-2xl max-h-max mx-auto mt-10 p-8 bg-white border border-gray-300 rounded-2xl shadow-md mb-5">
          <h2 className="text-2xl font-semibold text-red-600 mb-5">
            Forgot your password?
          </h2>
          {submitted ? (
            <p className="text-green-600">
              A password reset link has been sent to <strong>{email}</strong>.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700 mb-4"
              >
                Enter your email address:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 border border-red-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 mb-5"
                placeholder="your@email.com"
              />
              <button
                type="submit"
                className="w-full bg-red-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-red-700 transition"
              >
                Send Reset Link
              </button>
            </form>
          )}
        </div>
      </div>


    </div>
  );
};

export default ForgotPassword;
