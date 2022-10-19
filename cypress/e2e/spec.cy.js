/// <reference types="cypress" />

import Change from "chance";
const change = new Change();

describe("Home Page", () => {
  it("passes", () => {
    cy.visit("localhost:3000/");
  });
  it("renders the logo", () => {
    cy.contains("FavoriteFoods");
  });
  it("renders the add Food button", () => {
    cy.contains("List your Favorite Food");
  });
  it("renders the Login button", () => {
    cy.contains("Log in");
  });
  it("renders the public food title", () => {
    cy.contains("Top-rated foods to eat");
  });
  it("renders the public food subtitle", () => {
    cy.contains("Explore some of the best foods in the world");
  });
  it("shows modal on login click", () => {
    cy.get("#loginButton").click();
    cy.contains("Create your account");
  });
  it("remove modal on close", () => {
    cy.get("#closeModal").click();
    !cy.contains("Create your account");
  });
  it("shows modal on add food click", () => {
    cy.get("#addFoodButton").click();
    cy.contains("Create your account");
  });
  it("remove modal on close", () => {
    cy.get("#closeModal").click();
    !cy.contains("Create your account");
  });
});

describe("Functionality", () => {
  it("Login through user and password", () => {
    // cy.pause();
    cy.get("#loginButton").click();
    cy.get("#changeToLogin").click();
    cy.get("#usernameInput").type("LanceJuat");
    cy.get("#passwordInput").type("lancejuat");
    cy.get("#signInButton").click();
  });
  it("Add Food", () => {
    cy.wait(1000);
    cy.visit("localhost:3000/create");
    cy.get("input[name=title]").type("Sample Food");
    cy.get("#descriptionInput").type("Lorem Ipsum Doloret");
    cy.get("input[name=rating]").type("{backspace}5");
    cy.get("#addNewFoodButton").click();
  });
  it("Logout", () => {
    cy.get("#dropdown").click();
    cy.get("#Logout").click();
    cy.visit("localhost:3000/");
  });
});
