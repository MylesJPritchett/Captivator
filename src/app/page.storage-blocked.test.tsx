import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { editTextBlock1, renderCaptivator } from "@/app/test-helpers";

/** What a browser throws when its site storage is blocked. */
function storageBlocked() {
  return new DOMException("The operation is insecure.", "SecurityError");
}

describe("Captivator: storage blocked in this browser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("when the saved Splash Page can't be read, Captivator opens on the Starter Splash Page", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw storageBlocked();
    });

    const { preview } = renderCaptivator();

    expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
  });

  it("when nothing can be saved, the Customer can still edit the Splash Page and isn't told it's saved", async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw storageBlocked();
    });
    const { preview, editor } = renderCaptivator();

    await editTextBlock1(user, editor, "Welcome to the Café");

    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
    expect(
      within(editor).getByText(
        "Your design can't be saved in this browser, so it will be lost when you leave.",
      ),
    ).toBeInTheDocument();
    expect(
      within(editor).queryByText("Your design is saved in this browser."),
    ).not.toBeInTheDocument();
  });

  it("when storage is too full for even the text and colours, the Customer is told the design can't be saved", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException(
        "The quota has been exceeded.",
        "QuotaExceededError",
      );
    });

    const { preview, editor } = renderCaptivator();

    expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
    expect(
      within(editor).getByText(
        "Your design can't be saved in this browser, so it will be lost when you leave.",
      ),
    ).toBeInTheDocument();
  });
});
