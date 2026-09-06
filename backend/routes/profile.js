const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const { db } = require("../config/firebaseAdmin");

// GET /user/profile - Fetch profile of the authenticated user
router.get("/user/profile", requireAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const profileDoc = await db.collection("users").doc(userId).collection("meta").doc("profile").get();

    if (!profileDoc.exists) {
      return res.json({
        profile: {
          fullName: req.user.name || "",
          email: req.user.email || "",
          age: "",
          gender: "",
          city: "",
          phone: "",
          policyNumber: "",
          insurerName: "",
          policyType: "Health",
          policyDuration: "",
          sumInsured: "",
          preExistingConditions: "",
          dependentsCount: "0"
        }
      });
    }

    res.json({ profile: profileDoc.data() });
  } catch (error) {
    console.error("[x] Fetch profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile", details: error.message });
  }
});

// POST /user/profile - Save or update profile
router.post("/user/profile", requireAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const profileData = req.body || {};

    const cleanProfile = {
      ...profileData,
      email: req.user.email || profileData.email || "",
      updatedAt: new Date().toISOString()
    };

    await db.collection("users").doc(userId).collection("meta").doc("profile").set(cleanProfile, { merge: true });

    res.json({ message: "Profile saved successfully", profile: cleanProfile });
  } catch (error) {
    console.error("[x] Save profile error:", error);
    res.status(500).json({ error: "Failed to save profile", details: error.message });
  }
});

module.exports = router;
