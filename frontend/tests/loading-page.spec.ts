import { test, expect } from '@playwright/test';

test.describe('LoadingPage', () => {
  // Mock API response for story generation
  const mockStoryResponse = {
    story_title: 'The Amazing Adventure',
    target_age: 5,
    style: 'colorful',
    pages: [
      {
        page_number: 1,
        title: 'Chapter 1',
        text: 'Once upon a time...',
        image_url: 'https://example.com/image1.jpg',
        emotion: 'happy',
        image_prompt: 'A happy scene'
      },
      {
        page_number: 2,
        title: 'Chapter 2',
        text: 'The adventure continues...',
        image_url: 'https://example.com/image2.jpg',
        emotion: 'excited',
        image_prompt: 'An exciting scene'
      }
    ]
  };

  test.beforeEach(async ({ page }) => {
    // Intercept the API call and return mock response
    await page.route('**/story', async (route) => {
      // Simulate some delay to make the loading states visible
      await page.waitForTimeout(100);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockStoryResponse),
      });
    });

    // Navigate to the app
    await page.goto('http://localhost:3001');
  });

  test('should display loading page when navigating from landing page', async ({ page }) => {
    // Click "Get Started" button (labeled as "Create Your Book")
    const getStartedButton = page.getByRole('button', { name: /create your book/i });
    await expect(getStartedButton).toBeVisible();
    await getStartedButton.click();

    // Wait for landing page to appear
    await expect(page.getByRole('button', { name: /generate my story/i })).toBeVisible();

    // Fill in the form with test data
    await page.getByPlaceholder(/example/i).fill('My Test Book');
    
    // Fill in story content
    await page.getByPlaceholder(/maximum characters 3000/i).fill('Once upon a time in a magical forest...');

    // Click generate button
    await page.getByRole('button', { name: /generate my story/i }).click();

    // Wait for loading page to appear
    await expect(page.getByRole('heading', { name: /generating your book/i })).toBeVisible({ timeout: 5000 });
  });

  test('should display all generation steps', async ({ page }) => {
    // Navigate through the flow
    await page.getByRole('button', { name: /create your book/i }).click();
    await expect(page.getByRole('button', { name: /generate my story/i })).toBeVisible();
    
    await page.getByPlaceholder(/example/i).fill('My Test Book');
    
    await page.getByPlaceholder(/maximum characters 3000/i).fill('A magical story...');
    await page.getByRole('button', { name: /generate my story/i }).click();

    // Check that all steps are displayed
    await expect(page.getByRole('heading', { name: /generating your book/i })).toBeVisible();
    
    const steps = [
      'Reading your transcript',
      'Interpreting your transcript based on Age and Validation rules',
      'reviewing uploaded imagery',
      'Re aligning imagery based on Age range',
      'Outputting story chapters',
      'Merging story chapter with imagery',
      'Combining all content'
    ];

    for (const stepText of steps) {
      await expect(page.getByText(stepText)).toBeVisible();
    }
  });

  test('should show loading animation on current step', async ({ page }) => {
    // Navigate through the flow
    await page.getByRole('button', { name: /create your book/i }).click();
    await expect(page.getByRole('button', { name: /generate my story/i })).toBeVisible();
    
    await page.getByPlaceholder(/example/i).fill('My Test Book');
    
    await page.getByPlaceholder(/maximum characters 3000/i).fill('A magical story...');
    await page.getByRole('button', { name: /generate my story/i }).click();

    // Wait for loading page
    await expect(page.getByRole('heading', { name: /generating your book/i })).toBeVisible();

    // Check that a loader icon is visible (for the current step)
    // The loader has an animate-spin class
    await expect(page.locator('.animate-spin')).toBeVisible({ timeout: 2000 });
  });

  test('should show completed state after generation', async ({ page }) => {
    // Navigate through the flow
    await page.getByRole('button', { name: /create your book/i }).click();
    await expect(page.getByRole('button', { name: /generate my story/i })).toBeVisible();
    
    await page.getByPlaceholder(/example/i).fill('My Test Book');
    
    await page.getByPlaceholder(/maximum characters 3000/i).fill('A magical story...');
    await page.getByRole('button', { name: /generate my story/i }).click();

    // Wait for completion (API responds quickly with mock)
    // The "Show the book" button should become enabled
    await expect(page.getByRole('button', { name: /show the book/i })).toBeEnabled({ timeout: 10000 });

    // Check that all steps show as completed (checkmarks visible)
    const checkIcons = page.locator('svg[class*="Check"], svg[class*="text-green"]');
    await expect(checkIcons.first()).toBeVisible();
  });

  test('should handle API error gracefully', async ({ page }) => {
    // Override the route to return an error
    await page.route('**/story', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    // Navigate through the flow
    await page.getByRole('button', { name: /create your book/i }).click();
    await expect(page.getByRole('button', { name: /generate my story/i })).toBeVisible();
    
    await page.getByPlaceholder(/example/i).fill('My Test Book');
    
    await page.getByPlaceholder(/maximum characters 3000/i).fill('A magical story...');
    await page.getByRole('button', { name: /generate my story/i }).click();

    // After error, should navigate back to landing page
    await expect(page.getByRole('button', { name: /generate my story/i })).toBeVisible({ timeout: 10000 });
  });

  test('should have disabled "Show the book" button during generation', async ({ page }) => {
    // Navigate through the flow
    await page.getByRole('button', { name: /create your book/i }).click();
    await expect(page.getByRole('button', { name: /generate my story/i })).toBeVisible();
    
    await page.getByPlaceholder(/example/i).fill('My Test Book');
    
    await page.getByPlaceholder(/maximum characters 3000/i).fill('A magical story...');
    await page.getByRole('button', { name: /generate my story/i }).click();

    // Initially the button should be disabled
    const showBookButton = page.getByRole('button', { name: /generating\.\.\.|show the book/i });
    await expect(showBookButton.first()).toHaveClass(/disabled|opacity-50/);

    // Wait for it to become enabled
    await expect(page.getByRole('button', { name: /show the book/i })).toBeEnabled({ timeout: 10000 });
  });
});

