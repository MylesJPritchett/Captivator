import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { imageFile, renderCaptivator, imageDataUrl } from "@/app/test-helpers";

describe("Captivator: Logo", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uploading an image in the Editor shows it as the Logo in the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();
    expect(
      within(preview).queryByRole("img", { name: "Logo" }),
    ).not.toBeInTheDocument();

    await user.upload(
      within(editor).getByLabelText("Logo image"),
      imageFile("cafe-logo.png"),
    );

    expect(
      await within(preview).findByRole("img", { name: "Logo" }),
    ).toHaveAttribute("src", imageDataUrl("cafe-logo.png"));
  });

  it("uploading another image replaces the Logo in the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();
    const logoImage = within(editor).getByLabelText("Logo image");

    await user.upload(logoImage, imageFile("old-logo.png"));
    await user.upload(logoImage, imageFile("new-logo.png"));

    await waitFor(() =>
      expect(
        within(preview).getByRole("img", { name: "Logo" }),
      ).toHaveAttribute("src", imageDataUrl("new-logo.png")),
    );
    expect(within(preview).getAllByRole("img", { name: "Logo" })).toHaveLength(
      1,
    );
  });

  it("the Logo is kept within a fixed maximum size in the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();

    await user.upload(
      within(editor).getByLabelText("Logo image"),
      imageFile("huge-logo.png"),
    );

    expect(
      await within(preview).findByRole("img", { name: "Logo" }),
    ).toHaveStyle({
      maxWidth: "200px",
      maxHeight: "120px",
    });
  });

  it("removing the Logo in the Editor removes it from the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();
    expect(
      within(editor).queryByRole("button", { name: "Remove Logo" }),
    ).not.toBeInTheDocument();

    await user.upload(
      within(editor).getByLabelText("Logo image"),
      imageFile("cafe-logo.png"),
    );
    await user.click(
      await within(editor).findByRole("button", { name: "Remove Logo" }),
    );

    expect(
      within(preview).queryByRole("img", { name: "Logo" }),
    ).not.toBeInTheDocument();
    expect(
      within(editor).queryByRole("button", { name: "Remove Logo" }),
    ).not.toBeInTheDocument();
  });

  it("choosing a file that isn't an image shows an error and leaves the Logo unchanged", async () => {
    // Let the Customer pick any file, as a browser's "All files" option does.
    const user = userEvent.setup({ applyAccept: false });
    const { preview, editor } = await renderCaptivator();
    const logoImage = within(editor).getByLabelText("Logo image");
    await user.upload(logoImage, imageFile("cafe-logo.png"));
    await within(preview).findByRole("img", { name: "Logo" });

    await user.upload(
      logoImage,
      new File(["%PDF"], "menu.pdf", { type: "application/pdf" }),
    );

    expect(within(editor).getByRole("alert")).toHaveTextContent(
      /isn't an image/i,
    );
    expect(within(preview).getByRole("img", { name: "Logo" })).toHaveAttribute(
      "src",
      imageDataUrl("cafe-logo.png"),
    );
  });

  it("an image that can't be read shows an error and leaves the Logo unchanged", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();
    const logoImage = within(editor).getByLabelText("Logo image");
    await user.upload(logoImage, imageFile("cafe-logo.png"));
    await within(preview).findByRole("img", { name: "Logo" });
    // As when the file is moved or deleted after it was chosen.
    vi.spyOn(FileReader.prototype, "readAsDataURL").mockImplementation(
      function (this: FileReader) {
        this.dispatchEvent(new ProgressEvent("error"));
      },
    );

    await user.upload(logoImage, imageFile("new-logo.png"));

    expect(await within(editor).findByRole("alert")).toHaveTextContent(
      /couldn't be read/i,
    );
    expect(within(preview).getByRole("img", { name: "Logo" })).toHaveAttribute(
      "src",
      imageDataUrl("cafe-logo.png"),
    );
  });
});

describe("Captivator: clicking the Logo in the Preview", () => {
  it.each(["Mobile", "Desktop"])(
    "on the %s Device, focuses the first control in the Editor's Logo section",
    async (device) => {
      const user = userEvent.setup();
      const { preview, editor } = await renderCaptivator();
      await user.upload(
        within(editor).getByLabelText("Logo image"),
        imageFile("cafe-logo.png"),
      );
      await user.click(screen.getByRole("radio", { name: device }));

      await user.click(within(preview).getByRole("img", { name: "Logo" }));

      expect(within(editor).getByLabelText("Logo image")).toHaveFocus();
    },
  );
});
