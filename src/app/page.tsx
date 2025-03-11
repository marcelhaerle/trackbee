import { auth } from "@/auth";
import SignIn from "@/components/signin-button";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <section className="section">
      <h1 className="title">Welcome to Trackbee!</h1>
      <SignIn />
    </section>
  );
}
