import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  appearanceOption,
  blockIndexedDbReads,
  chooseAppearance,
  editTextBlock1,
  failIndexedDbWrites,
  renderCaptivator,
  storageBlocked,
  storageFull,
} from "@/app/test-helpers";

const cantBeSaved =
  "Your design can't be saved in this browser, so it will be lost when you leave.";

describe("Captivator: storage blocked in this browser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("when the saved Library can't be read, Captivator opens on the Starter Splash Page", async () => {
    blockIndexedDbReads();

    const { preview } = await renderCaptivator();

    expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
  });

  it("when nothing can be saved, the Customer can still edit the Splash Page and isn't told it's saved", async () => {
    const user = userEvent.setup();
    failIndexedDbWrites(() => storageBlocked());
    const { preview, editor } = await renderCaptivator();

    await editTextBlock1(user, editor, "Welcome to the Café");

    expect(
      within(preview).getByText("Welcome to the Café"),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(within(editor).getByText(cantBeSaved)).toBeInTheDocument(),
    );
    expect(
      within(editor).queryByText(
        "Your Splash Pages are saved in this browser.",
      ),
    ).not.toBeInTheDocument();
  });

  it("when the Appearance can't be remembered, it opens on System and the Customer can still choose Dark, with no error shown", async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw storageBlocked();
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw storageBlocked();
    });
    await renderCaptivator();
    expect(appearanceOption("System")).toBeChecked();

    await chooseAppearance(user, "Dark");

    expect(appearanceOption("Dark")).toBeChecked();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("when storage is too full for even the text and colours, the Customer is told the design can't be saved", async () => {
    failIndexedDbWrites(() => storageFull());

    const { preview, editor } = await renderCaptivator();

    expect(within(preview).getByText("Free WiFi")).toBeInTheDocument();
    expect(await within(editor).findByText(cantBeSaved)).toBeInTheDocument();
  });
});
