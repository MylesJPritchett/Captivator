import { expect, test } from "@playwright/test";

test("after switching Device, clicking the Connect Button in the Preview shows the focus ring on the control it jumps to", async ({
  page,
}) => {
  await page.goto("/");
  const preview = page.getByRole("region", { name: "Preview" });
  // Clicking a radio focuses it without a ring, and browsers carry that over
  // to whatever script focuses next unless told otherwise.
  await page.getByRole("radio", { name: "Desktop" }).click();

  // The Preview's Connect Button is inert; the click lands on its wrapper.
  await preview.getByRole("button", { name: "Connect" }).click({ force: true });

  const colour = page
    .getByRole("region", { name: "Editor" })
    .getByLabel("Connect Button background colour");
  await expect(colour).toBeFocused();
  await expect(colour).toHaveCSS("outline-style", "solid");
});
