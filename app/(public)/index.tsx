import { SignIn } from "@/components/clerk/SignIn";

export default function Index() {
  return (
    <SignIn scheme="magicagent://" signUpUrl="/sign-up" homeUrl="/(tabs)" />
  );
}
