/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { User, Lock, Mail } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import AuthVisual from "../components/AuthVisual";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");

    try {
      await register({ name, email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    }
  };

  return (
    <div className="min-h-screen bg-bg-light flex font-sans">
      {/* Left Visual Section */}
      <AuthVisual
        title="Start optimizing today."
        subtitle="Join thousands of teams who trust Dragolink for their link management and analytics."
      />

      {/* Right Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10 bg-surface-light border-l border-outline-variant/10">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <img
                src="/dragolink.svg"
                alt="Dragolink Logo"
                className="h-10 w-10"
              />
            </Link>
            <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Join Dragolink to master your links
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                {error}
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-primary">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-text-secondary" />
                </div>
                <Input
                  type="text"
                  required
                  className="pl-9"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-primary">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-text-secondary" />
                </div>
                <Input
                  type="email"
                  required
                  className="pl-9"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-primary">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-text-secondary" />
                </div>
                <Input
                  type="password"
                  required
                  minLength="6"
                  className="pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full h-11 text-base mt-2"
            >
              Create account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand hover:text-brand-dark transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
