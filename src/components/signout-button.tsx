import { signOutHandler } from "@/app/actions/signout";

export function SignOut() {
  return (
    <form action={signOutHandler}>
      <button type="submit" className="button is-fullwidth">
        Sign Out
      </button>
    </form>
  );
}
