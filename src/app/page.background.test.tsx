import { fireEvent, render, screen, within } from "@testing-library/react";
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
  const preview = screen.getByRole("region", { name: "Preview" });
  return {
    preview,
    editor: screen.getByRole("region", { name: "Editor" }),
    background: () =>
      within(preview).getByRole("group", { name: "Background" }),
  };
}

// jsdom's computed style leaves out background images, so image assertions
// read the Background's inline style.

// user-event can't drive a native colour input, so pick the colour the way
// the browser reports it: a change event carrying the new hex value.
function pickColour(colourInput: HTMLElement, colour: string) {
  fireEvent.change(colourInput, { target: { value: colour } });
}

describe("Captivator: Background", () => {
  it("changing the Background colour in the Editor updates the Preview", () => {
    const { editor, background } = renderCaptivator();

    pickColour(within(editor).getByLabelText("Background colour"), "#10b981");

    expect(background()).toHaveStyle({ backgroundColor: "#10b981" });
  });

  it("uploading a Background image in the Editor shows it covering the Preview", async () => {
    const user = userEvent.setup();
    const { editor, background } = renderCaptivator();

    await user.upload(
      within(editor).getByLabelText("Background image"),
      imageFile("venue.png"),
    );

    expect(background().style).toMatchObject({
      backgroundImage: 'url("blob:venue.png")',
      backgroundSize: "cover",
      backgroundPosition: "center center",
    });
  });

  it("switching the Background to colour and back to image keeps both without re-uploading", async () => {
    const user = userEvent.setup();
    const { editor, background } = renderCaptivator();
    pickColour(within(editor).getByLabelText("Background colour"), "#10b981");
    await user.upload(
      within(editor).getByLabelText("Background image"),
      imageFile("venue.png"),
    );

    await user.click(within(editor).getByRole("radio", { name: "Colour" }));

    expect(background().style.backgroundImage).toBe("");
    expect(background()).toHaveStyle({ backgroundColor: "#10b981" });

    await user.click(within(editor).getByRole("radio", { name: "Image" }));

    expect(background().style.backgroundImage).toBe('url("blob:venue.png")');
  });

  it("switching the Background to image before uploading one leaves the colour showing", async () => {
    const user = userEvent.setup();
    const { editor, background } = renderCaptivator();

    await user.click(within(editor).getByRole("radio", { name: "Image" }));

    expect(background().style.backgroundImage).toBe("");
    expect(background()).toHaveStyle({ backgroundColor: "#1e3a8a" });
  });

  it("choosing a Background file that isn't an image shows an error and leaves the Preview unchanged", async () => {
    // Let the Customer pick any file, as a browser's "All files" option does.
    const user = userEvent.setup({ applyAccept: false });
    const { editor, background } = renderCaptivator();

    await user.upload(
      within(editor).getByLabelText("Background image"),
      new File(["%PDF"], "menu.pdf", { type: "application/pdf" }),
    );

    expect(within(editor).getByRole("alert")).toHaveTextContent(
      /isn't an image/i,
    );
    expect(background().style.backgroundImage).toBe("");
    expect(background()).toHaveStyle({ backgroundColor: "#1e3a8a" });
  });
});
