import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  imageFile,
  renderCaptivator,
  stubObjectUrls,
} from "@/app/test-helpers";

stubObjectUrls();

describe("Captivator: Logo", () => {
  it("uploading an image in the Editor shows it as the Logo in the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = renderCaptivator();
    expect(
      within(preview).queryByRole("img", { name: "Logo" }),
    ).not.toBeInTheDocument();

    await user.upload(
      within(editor).getByLabelText("Logo image"),
      imageFile("cafe-logo.png"),
    );

    expect(within(preview).getByRole("img", { name: "Logo" })).toHaveAttribute(
      "src",
      "blob:cafe-logo.png",
    );
  });

  it("uploading another image replaces the Logo in the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = renderCaptivator();
    const logoImage = within(editor).getByLabelText("Logo image");

    await user.upload(logoImage, imageFile("old-logo.png"));
    await user.upload(logoImage, imageFile("new-logo.png"));

    const logos = within(preview).getAllByRole("img", { name: "Logo" });
    expect(logos).toHaveLength(1);
    expect(logos[0]).toHaveAttribute("src", "blob:new-logo.png");
  });

  it("the Logo is kept within a fixed maximum size in the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = renderCaptivator();

    await user.upload(
      within(editor).getByLabelText("Logo image"),
      imageFile("huge-logo.png"),
    );

    expect(within(preview).getByRole("img", { name: "Logo" })).toHaveStyle({
      maxWidth: "200px",
      maxHeight: "120px",
    });
  });

  it("removing the Logo in the Editor removes it from the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = renderCaptivator();
    expect(
      within(editor).queryByRole("button", { name: "Remove Logo" }),
    ).not.toBeInTheDocument();

    await user.upload(
      within(editor).getByLabelText("Logo image"),
      imageFile("cafe-logo.png"),
    );
    await user.click(
      within(editor).getByRole("button", { name: "Remove Logo" }),
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
    const { preview, editor } = renderCaptivator();
    const logoImage = within(editor).getByLabelText("Logo image");
    await user.upload(logoImage, imageFile("cafe-logo.png"));

    await user.upload(
      logoImage,
      new File(["%PDF"], "menu.pdf", { type: "application/pdf" }),
    );

    expect(within(editor).getByRole("alert")).toHaveTextContent(
      /isn't an image/i,
    );
    expect(within(preview).getByRole("img", { name: "Logo" })).toHaveAttribute(
      "src",
      "blob:cafe-logo.png",
    );
  });
});
