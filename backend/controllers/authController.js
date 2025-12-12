export const googleSignup = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Just send success now (onboarding will complete profile)
    return res.json({
      success: true,
      message: "Google signup success",
      user: { name, email }
    });
  } catch (err) {
    res.status(500).json({ error: "Google signup failed" });
  }
};
