import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Home from "@/app/page";

// jsdom has no object URLs, so give each uploaded file a predictable one.
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;
beforeEach(() => {
  URL.createObjectURL = (file: Blob) => `blob:${(file as File).name}`;
  URL.revokeObjectURL = () => {};
});
afterEach(() => {
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
});

function imageFile(name: string) {
  return new File(["fake image"], name, { type: "image/png" });
}

function renderCaptivator() {
  render(<Home />);
  return {
    preview: screen.getByRole("region", { name: "Preview" }),
    editor: screen.getByRole("region", { name: "Editor" }),
  };
}

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
});
