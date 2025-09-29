import { SignUp } from "@/components/clerk/SignUp";

// Sign Up Screen
function SignUpScreen() {
  return (
    <SignUp scheme="magicagent://" signInUrl="/(auth)" homeUrl="/(tabs)" />
  );
}

export default SignUpScreen;
