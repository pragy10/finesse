import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Shield, Sparkles, Check, Save, MapPin, Calendar, HeartPulse, FileText } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function ProfilePage() {
  const { user, userProfile, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    gender: "Male",
    city: "",
    phone: "",
    policyNumber: "",
    insurerName: "",
    policyType: "Health",
    policyDuration: "12 months",
    sumInsured: "₹5,00,000",
    preExistingConditions: "None",
    dependentsCount: "0"
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        ...userProfile,
        fullName: userProfile.fullName || user?.displayName || "",
        email: user?.email || userProfile.email || ""
      }));
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || "",
        email: user.email || ""
      }));
    }
  }, [userProfile, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await updateUserProfile(formData);
      setSuccessMsg("Profile saved successfully! The AI Assistant will now use these details automatically.");
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      console.error("Save profile error:", err);
      setErrorMsg(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          Insurance & Personal Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Keep your policy details up-to-date. Finesse AI will automatically use this information during claim eligibility checks without asking you repeatedly.
        </p>
      </div>

      {/* AI Superpower Notice */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900 dark:text-blue-200">
          <strong>Smart Auto-Fill Active:</strong> Whenever you ask the AI questions like <em>"Is knee surgery covered?"</em>, your age, location, policy tenure, and pre-existing condition info will be seamlessly supplied in the background.
        </div>
      </div>

      {/* Feedback Messages */}
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 text-green-800 dark:text-green-300 text-sm">
          <Check className="w-5 h-5 text-green-600" />
          {successMsg}
        </motion.div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-300 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details Card */}
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-500" />
            Personal Demographics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email (Read-only)
              </label>
              <input
                type="email"
                readOnly
                value={formData.email}
                className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 46"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                City / Location
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Pune, Mumbai, Delhi"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </Card>

        {/* Insurance Policy Details Card */}
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-secondary-500" />
            Insurance Policy Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Policy Number / UIN
              </label>
              <input
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                placeholder="e.g. CHIHLIP25047V022425"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Insurance Provider
              </label>
              <input
                type="text"
                name="insurerName"
                value={formData.insurerName}
                onChange={handleChange}
                placeholder="e.g. Care Health, Star Health, HDFC Ergo"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Policy Type
              </label>
              <select
                name="policyType"
                value={formData.policyType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              >
                <option value="Health">Health Insurance</option>
                <option value="Life">Life Insurance</option>
                <option value="Critical Illness">Critical Illness</option>
                <option value="Motor">Motor Insurance</option>
                <option value="Travel">Travel Insurance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Policy Duration / Active Tenure
              </label>
              <input
                type="text"
                name="policyDuration"
                value={formData.policyDuration}
                onChange={handleChange}
                placeholder="e.g. 18 months, 2 years, 3 months"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Sum Insured (₹)
              </label>
              <input
                type="text"
                name="sumInsured"
                value={formData.sumInsured}
                onChange={handleChange}
                placeholder="e.g. 10,00,000"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Number of Dependents
              </label>
              <input
                type="number"
                name="dependentsCount"
                value={formData.dependentsCount}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Known Pre-existing Conditions / Medical History
              </label>
              <textarea
                rows="3"
                name="preExistingConditions"
                value={formData.preExistingConditions}
                onChange={handleChange}
                placeholder="e.g. Hypertension diagnosed in 2021, Diabetes, or None"
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={saving}
            size="lg"
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
