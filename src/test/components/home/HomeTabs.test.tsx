import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HomeTabs } from "@/components/home/HomeTabs";

const COUNTS = { new: 3, read: 2, bookmark: 1 };

describe("HomeTabs", () => {
  it("NEW・READタブの件数を表示する", () => {
    render(<HomeTabs selected="new" onSelect={vi.fn()} counts={COUNTS} />);
    expect(screen.getByRole("button", { name: "NEW 3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "READ 2" })).toBeInTheDocument();
  });

  it("BOOKMARKタブにも件数が表示される", () => {
    render(<HomeTabs selected="new" onSelect={vi.fn()} counts={COUNTS} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect(buttons[2]).toHaveTextContent("1");
  });

  it("選択中のタブだけ強調表示のクラスがつく", () => {
    render(<HomeTabs selected="read" onSelect={vi.fn()} counts={COUNTS} />);
    expect(screen.getByRole("button", { name: "READ 2" })).toHaveClass(
      "font-semibold",
    );
    expect(screen.getByRole("button", { name: "NEW 3" })).not.toHaveClass(
      "font-semibold",
    );
  });

  it("タブをクリックするとonSelectに選んだタブが渡される", async () => {
    const onSelect = vi.fn();
    render(<HomeTabs selected="new" onSelect={onSelect} counts={COUNTS} />);
    await userEvent.click(screen.getByRole("button", { name: "READ 2" }));
    expect(onSelect).toHaveBeenCalledWith("read");
  });
});
