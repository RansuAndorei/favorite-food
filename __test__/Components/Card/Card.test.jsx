import { screen, render } from "@testing-library/react";
import Card from "./Card";
import React from "react";

const setup = () => {
  render(<Card name={"Adobo"} />);
};

describe("Does it exist?", () => {
  it("renders a food title", () => {
    setup();
    expect(screen.getByTestId("cardTitle")).toBeInTheDocument();
  });
  it("renders a food image", () => {
    setup();
    expect(screen.getByRole("img", { name: /Adobo/i })).toBeInTheDocument();
  });
});

describe("Does it function correctly?", () => {
  it("renders a correct rating", () => {
    setup();
    expect(screen.getByTestId("outlineStar1")).toBeInTheDocument();
    expect(screen.getByTestId("solidStar4")).toBeInTheDocument();
  });
});
