import { signOutAdmin } from "../actions";

/** Server-action sign-out (no client JS needed). */
export function SignOutButton() {
  return (
    <form action={signOutAdmin}>
      <button
        type="submit"
        className="label-eyebrow text-foreground/65 hover:text-foreground transition-colors"
      >
        Se déconnecter
      </button>
    </form>
  );
}
