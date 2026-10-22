import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderCaptivator } from "@/app/test-helpers";

describe("Captivator: Input Fields", () => {
  it("adding an Input Field in the Editor shows it in the Preview with its type as placeholder", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();

    await user.selectOptions(
      within(editor).getByRole("combobox", { name: "Input Field type" }),
      "Name",
    );
    await user.click(
      within(editor).getByRole("button", { name: "Add Input Field" }),
    );

    const previewInputFields = within(preview).getAllByRole("textbox");
    expect(
      previewInputFields.map((field) => field.getAttribute("placeholder")),
    ).toEqual(["Email", "Name"]);
  });

  it("the add Input Field control offers only unused types, and goes once there are two Input Fields", async () => {
    const user = userEvent.setup();
    const { editor } = await renderCaptivator();

    const typeOptions = within(
      within(editor).getByRole("combobox", { name: "Input Field type" }),
    ).getAllByRole("option");
    expect(typeOptions.map((option) => option.textContent)).toEqual([
      "Name",
      "Phone",
    ]);

    await user.click(
      within(editor).getByRole("button", { name: "Add Input Field" }),
    );

    expect(
      within(editor).queryByRole("combobox", { name: "Input Field type" }),
    ).not.toBeInTheDocument();
    expect(
      within(editor).queryByRole("button", { name: "Add Input Field" }),
    ).not.toBeInTheDocument();
  });

  it("removing an Input Field in the Editor removes it from the Preview", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();

    await user.click(
      within(editor).getByRole("button", { name: "Remove Email Input Field" }),
    );

    expect(within(preview).queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      within(preview).getByRole("button", { name: "Connect" }),
    ).toBeInTheDocument();
  });
});

describe("Captivator: clicking an Input Field in the Preview", () => {
  it("focuses the first control in the Editor's Input Fields section", async () => {
    const user = userEvent.setup();
    const { preview, editor } = await renderCaptivator();

    await user.click(within(preview).getByRole("textbox", { name: "Email" }));

    expect(
      within(editor).getByRole("button", { name: "Remove Email Input Field" }),
    ).toHaveFocus();
  });
});
