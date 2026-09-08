import { describe, expect, it } from "vitest";
import { outcomeFromSession } from "./outcome";

describe("outcomeFromSession", () => {
  it("confirms only when Stripe says the money landed", () => {
    expect(outcomeFromSession("paid", "complete")).toBe("confirmed");
    expect(outcomeFromSession("no_payment_required", "complete")).toBe("confirmed");
  });

  it("never claims payment for a completed-but-unpaid session (Klarna, iDEAL, Bancontact…)", () => {
    expect(outcomeFromSession("unpaid", "complete")).toBe("processing");
  });

  it("treats an abandoned or still-open session as failed", () => {
    expect(outcomeFromSession("unpaid", "expired")).toBe("failed");
    expect(outcomeFromSession("unpaid", "open")).toBe("failed");
  });

  it("fails closed on missing or unexpected values rather than congratulating the buyer", () => {
    for (const [pay, status] of [
      [undefined, undefined],
      [null, null],
      ["", ""],
      ["PAID", "complete"],
      ["something_new", "open"],
    ] as const) {
      expect(outcomeFromSession(pay, status), `${pay}/${status}`).not.toBe("confirmed");
    }
  });
});
