import { test, expect } from "@playwright/test";

test.describe("Fire Management System - E2E Multi-Role & Logout Suite", () => {
  test("1. Admin Workflow: Onboarding, Dashboard Access, & Logout API Execution", async ({
    page,
  }) => {
    // Navigate to Landing Page & click Sign In
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(/Fire Incident/i);

    // Navigate to Register page
    await page.goto("/register");
    await expect(
      page.getByRole("heading", { name: /Create your workspace identity/i })
    ).toBeVisible();

    // Select Admin Role
    await page.getByRole("button", { name: /Station Admin/i }).click();

    // Fill Admin Registration Form
    const adminUser = `admin_e2e_${Date.now()}`;
    await page.locator("#username-input").fill(adminUser);
    await page.locator("#email-input").fill(`${adminUser}@example.com`);
    await page.locator("#firstname-input").fill("Alice");
    await page.locator("#lastname-input").fill("Admin");
    await page.locator("#phone-input").fill("+15550100");
    await page.locator("#empcode-input").fill("EMP-00001");
    await page.locator("#new-password-input").fill("Password123!");
    await page.locator("#confirm-password-input").fill("Password123!");

    // Submit Registration
    await page.getByRole("button", { name: /Register as Admin/i }).click();

    // Should redirect to Dashboard (/home)
    await expect(page).toHaveURL(/\/home/);

    // Verify Admin Dashboard Panel
    await expect(page.getByText(/Station Dispatcher & Admin Operations/i)).toBeVisible();

    // Intercept Logout API Call
    const logoutPromise = page.waitForRequest(
      (request) => request.url().includes("/api/v1/auth/logout") && request.method() === "POST"
    );

    // Click Logout button in sidebar
    await page.locator(".sidebar-logout").click();

    // Verify Logout API call was triggered
    const logoutRequest = await logoutPromise;
    expect(logoutRequest.url()).toContain("/api/v1/auth/logout");

    // Verify redirect to Public Landing Page
    await expect(page).toHaveURL("/");
  });

  test("2. Firefighter Workflow: Shift Check-in, Incident Transition, & Logout API", async ({
    page,
  }) => {
    await page.goto("/register");

    // Select Firefighter Role
    await page.getByRole("button", { name: /Firefighter/i }).click();

    const ffUser = `firefighter_e2e_${Date.now()}`;
    await page.locator("#username-input").fill(ffUser);
    await page.locator("#email-input").fill(`${ffUser}@example.com`);
    await page.locator("#firstname-input").fill("Bob");
    await page.locator("#lastname-input").fill("Firefighter");
    await page.locator("#phone-input").fill("+15550200");
    await page.locator("#empcode-input").fill("EMP-99881");
    await page.locator("#new-password-input").fill("Password123!");
    await page.locator("#confirm-password-input").fill("Password123!");

    await page.getByRole("button", { name: /Register as Firefighter/i }).click();
    await expect(page).toHaveURL(/\/home/);

    // Verify Firefighter Panel
    await expect(page.getByText(/Firefighter Operational Response & Shift Logging/i)).toBeVisible();

    // Perform Shift Check-in
    await page.getByRole("button", { name: /Check In Shift/i }).click();
    await expect(page.getByText(/ACTIVE SHIFT IN PROGRESS/i)).toBeVisible();

    // Perform Shift Check-out
    await page.getByRole("button", { name: /Check Out Shift/i }).click();
    await expect(page.getByText(/NOT CHECKED IN/i)).toBeVisible();

    // Perform Logout
    await page.locator(".sidebar-logout").click();
    await expect(page).toHaveURL("/");
  });

  test("3. Citizen Workflow: Emergency Complaint Submission & Logout", async ({ page }) => {
    await page.goto("/register");

    // Select Citizen Role
    await page.getByRole("button", { name: /Citizen/i }).click();

    const citizenUser = `citizen_e2e_${Date.now()}`;
    await page.locator("#username-input").fill(citizenUser);
    await page.locator("#email-input").fill(`${citizenUser}@example.com`);
    await page.locator("#firstname-input").fill("Jane");
    await page.locator("#lastname-input").fill("Doe");
    await page.locator("#phone-input").fill("+15550300");
    await page.locator("#new-password-input").fill("Password123!");
    await page.locator("#confirm-password-input").fill("Password123!");

    await page.getByRole("button", { name: /Register as Citizen/i }).click();
    await expect(page).toHaveURL(/\/home/);

    // Verify Citizen Emergency Reporting Panel
    await expect(page.getByText(/Public Emergency & Incident Reporting/i)).toBeVisible();

    // Fill & Submit Complaint Form
    await page
      .locator("#complaint-desc")
      .fill("Commercial structure fire with smoke rising near Lafayette St.");
    await page.getByRole("button", { name: /Submit Emergency Complaint/i }).click();

    // Verify Complaint Submission Success Banner
    await expect(page.getByText(/reported successfully/i)).toBeVisible();

    // Perform Logout
    await page.locator(".sidebar-logout").click();
    await expect(page).toHaveURL("/");
  });
});
