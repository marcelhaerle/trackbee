import { signOut } from "@/auth";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({
          redirect: true,
          redirectTo: "/",
        });
      }}
    >
      <button type="submit" className="button">Sign Out</button>
    </form>
  );
}
