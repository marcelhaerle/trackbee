import { signIn } from "@/auth";
import { FaGithub } from "react-icons/fa";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", {
          redirect: true,
          redirectTo: "/dashboard",
        });
      }}
    >
      <button type="submit" className="button is-large">
        <span className="icon is-medium">
          <FaGithub size={20} />
        </span>
        <span>Sign in with GitHub</span>
      </button>
    </form>
  );
}
