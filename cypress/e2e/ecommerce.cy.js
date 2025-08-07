describe('E-commerce User Journey', () => {
  beforeEach(() => {
    cy.dbReset();
    cy.fixture('users').as('users');
    cy.fixture('products').as('products');
  });

  describe('Product Browsing', () => {
    it('should display product catalog with pagination', () => {
      cy.visit('/products');

      // Verify product grid is displayed
      cy.get('[data-cy=product-grid]').should('be.visible');
      cy.get('[data-cy=product-card]').should('have.length.at.least', 1);

      // Test pagination
      cy.get('[data-cy=pagination]').should('be.visible');
      cy.get('[data-cy=pagination-next]').click();
      cy.url().should('include', 'page=2');

      // Verify products load on new page
      cy.get('[data-cy=product-card]').should('have.length.at.least', 1);
    });

    it('should display product details correctly', () => {
      cy.get('@products').then((products) => {
        cy.visit(`/products/${products.laptop.id}`);

        // Verify product information
        cy.get('[data-cy=product-name]').should('contain', products.laptop.name);
        cy.get('[data-cy=product-price]').should('contain', products.laptop.price);
        cy.get('[data-cy=product-description]').should('contain', products.laptop.description);
        cy.get('[data-cy=product-rating]').should('be.visible');
        cy.get('[data-cy=product-reviews]').should('be.visible');

        // Verify product images
        cy.get('[data-cy=product-images]').should('be.visible');
        cy.get('[data-cy=product-image]').should('have.length', products.laptop.images.length);

        // Verify specifications
        cy.get('[data-cy=product-specifications]').should('be.visible');
        Object.entries(products.laptop.specifications).forEach(([key, value]) => {
          cy.get(`[data-cy=spec-${key}]`).should('contain', value);
        });
      });
    });

    it('should handle out of stock products', () => {
      cy.get('@products').then((products) => {
        cy.visit(`/products/${products.outOfStock.id}`);

        // Verify out of stock indicators
        cy.get('[data-cy=out-of-stock-badge]').should('be.visible');
        cy.get('[data-cy=add-to-cart-button]').should('be.disabled');
        cy.get('[data-cy=notify-when-available]').should('be.visible');
      });
    });
  });

  describe('Search and Filtering', () => {
    it('should search products by keyword', () => {
      cy.visit('/products');

      const searchTerm = 'laptop';
      cy.get('[data-cy=search-input]').type(searchTerm);
      cy.get('[data-cy=search-button]').click();

      // Verify search results
      cy.get('[data-cy=search-results]').should('be.visible');
      cy.get('[data-cy=product-card]').each(($card) => {
        cy.wrap($card).should('contain', searchTerm);
      });
    });

    it('should filter products by category', () => {
      cy.visit('/products');

      cy.get('[data-cy=category-filter]').click();
      cy.get('[data-cy=filter-option-Electronics]').click();

      // Verify filtered results
      cy.get('[data-cy=product-card]').each(($card) => {
        cy.wrap($card).find('[data-cy=product-category]').should('contain', 'Electronics');
      });
    });

    it('should filter products by price range', () => {
      cy.visit('/products');

      cy.get('[data-cy=price-filter]').click();
      cy.get('[data-cy=price-min]').type('100');
      cy.get('[data-cy=price-max]').type('1000');
      cy.get('[data-cy=apply-price-filter]').click();

      // Verify price filtered results
      cy.get('[data-cy=product-card]').each(($card) => {
        cy.wrap($card).find('[data-cy=product-price]').then(($price) => {
          const price = parseFloat($price.text().replace(/[^0-9.]/g, ''));
          expect(price).to.be.at.least(100);
          expect(price).to.be.at.most(1000);
        });
      });
    });

    it('should sort products by different criteria', () => {
      cy.visit('/products');

      // Sort by price low to high
      cy.get('[data-cy=sort-select]').select('price-asc');
      cy.get('[data-cy=product-card]').first().find('[data-cy=product-price]').then(($firstPrice) => {
        const firstPrice = parseFloat($firstPrice.text().replace(/[^0-9.]/g, ''));
        cy.get('[data-cy=product-card]').last().find('[data-cy=product-price]').then(($lastPrice) => {
          const lastPrice = parseFloat($lastPrice.text().replace(/[^0-9.]/g, ''));
          expect(firstPrice).to.be.at.most(lastPrice);
        });
      });

      // Sort by rating high to low
      cy.get('[data-cy=sort-select]').select('rating-desc');
      cy.get('[data-cy=product-card]').first().find('[data-cy=product-rating]').then(($firstRating) => {
        const firstRating = parseFloat($firstRating.text());
        cy.get('[data-cy=product-card]').last().find('[data-cy=product-rating]').then(($lastRating) => {
          const lastRating = parseFloat($lastRating.text());
          expect(firstRating).to.be.at.least(lastRating);
        });
      });
    });
  });

  describe('Shopping Cart', () => {
    it('should add products to cart', () => {
      cy.get('@products').then((products) => {
        cy.visit(`/products/${products.laptop.id}`);

        // Add to cart
        cy.get('[data-cy=add-to-cart-button]').click();
        cy.get('[data-cy=cart-count]').should('contain', '1');

        // Verify cart contents
        cy.get('[data-cy=cart-icon]').click();
        cy.get('[data-cy=cart-item]').should('contain', products.laptop.name);
        cy.get('[data-cy=cart-total]').should('contain', products.laptop.price);
      });
    });

    it('should update cart quantities', () => {
      cy.get('@products').then((products) => {
        cy.visit(`/products/${products.laptop.id}`);
        cy.get('[data-cy=add-to-cart-button]').click();

        // Open cart
        cy.get('[data-cy=cart-icon]').click();

        // Increase quantity
        cy.get('[data-cy=quantity-increase]').click();
        cy.get('[data-cy=quantity-value]').should('contain', '2');

        // Verify total updates
        const expectedTotal = products.laptop.price * 2;
        cy.get('[data-cy=cart-total]').should('contain', expectedTotal);
      });
    });

    it('should remove items from cart', () => {
      cy.get('@products').then((products) => {
        cy.visit(`/products/${products.laptop.id}`);
        cy.get('[data-cy=add-to-cart-button]').click();

        // Open cart and remove item
        cy.get('[data-cy=cart-icon]').click();
        cy.get('[data-cy=remove-item]').click();

        // Verify cart is empty
        cy.get('[data-cy=empty-cart]').should('be.visible');
        cy.get('[data-cy=cart-count]').should('contain', '0');
      });
    });

    it('should persist cart across sessions', () => {
      cy.get('@products').then((products) => {
        cy.visit(`/products/${products.laptop.id}`);
        cy.get('[data-cy=add-to-cart-button]').click();

        // Verify cart has item
        cy.get('[data-cy=cart-count]').should('contain', '1');

        // Reload page
        cy.reload();

        // Verify cart still has item
        cy.get('[data-cy=cart-count]').should('contain', '1');
      });
    });
  });

  describe('Checkout Process', () => {
    beforeEach(() => {
      // Login as user
      cy.get('@users').then((users) => {
        cy.login(users.user.email, users.user.password);
      });
    });

    it('should complete checkout process', () => {
      cy.get('@products').then((products) => {
        // Add product to cart
        cy.visit(`/products/${products.laptop.id}`);
        cy.get('[data-cy=add-to-cart-button]').click();

        // Proceed to checkout
        cy.get('[data-cy=cart-icon]').click();
        cy.get('[data-cy=checkout-button]').click();

        // Fill shipping information
        cy.fillForm({
          'shipping-name': 'John Doe',
          'shipping-email': 'john@example.com',
          'shipping-phone': '1234567890',
          'shipping-address': '123 Main St',
          'shipping-city': 'New York',
          'shipping-state': 'NY',
          'shipping-zip': '10001',
        });

        // Fill billing information
        cy.get('[data-cy=billing-same-as-shipping]').check();
        cy.get('[data-cy=billing-address]').should('not.be.visible');

        // Fill payment information
        cy.fillForm({
          'card-number': '4242424242424242',
          'card-expiry': '12/25',
          'card-cvc': '123',
          'card-name': 'John Doe',
        });

        // Complete order
        cy.get('[data-cy=place-order-button]').click();

        // Verify order confirmation
        cy.url().should('include', '/order-confirmation');
        cy.get('[data-cy=order-success]').should('be.visible');
        cy.get('[data-cy=order-number]').should('be.visible');
      });
    });

    it('should validate checkout form fields', () => {
      cy.get('@products').then((products) => {
        // Add product to cart and go to checkout
        cy.visit(`/products/${products.laptop.id}`);
        cy.get('[data-cy=add-to-cart-button]').click();
        cy.get('[data-cy=cart-icon]').click();
        cy.get('[data-cy=checkout-button]').click();

        // Try to submit empty form
        cy.get('[data-cy=place-order-button]').click();

        // Verify validation errors
        cy.validateFormErrors({
          'shipping-name': 'Name is required',
          'shipping-email': 'Email is required',
          'shipping-phone': 'Phone is required',
          'shipping-address': 'Address is required',
          'card-number': 'Card number is required',
        });
      });
    });

    it('should calculate taxes and shipping correctly', () => {
      cy.get('@products').then((products) => {
        // Add product to cart and go to checkout
        cy.visit(`/products/${products.laptop.id}`);
        cy.get('[data-cy=add-to-cart-button]').click();
        cy.get('[data-cy=cart-icon]').click();
        cy.get('[data-cy=checkout-button]').click();

        // Fill shipping information
        cy.fillForm({
          'shipping-name': 'John Doe',
          'shipping-email': 'john@example.com',
          'shipping-address': '123 Main St',
          'shipping-city': 'New York',
          'shipping-state': 'NY',
          'shipping-zip': '10001',
        });

        // Verify order summary
        cy.get('[data-cy=subtotal]').should('contain', products.laptop.price);
        cy.get('[data-cy=shipping-cost]').should('be.visible');
        cy.get('[data-cy=tax-amount]').should('be.visible');
        cy.get('[data-cy=total-amount]').should('be.visible');

        // Verify total calculation
        cy.get('[data-cy=subtotal]').then(($subtotal) => {
          const subtotal = parseFloat($subtotal.text().replace(/[^0-9.]/g, ''));
          cy.get('[data-cy=shipping-cost]').then(($shipping) => {
            const shipping = parseFloat($shipping.text().replace(/[^0-9.]/g, ''));
            cy.get('[data-cy=tax-amount]').then(($tax) => {
              const tax = parseFloat($tax.text().replace(/[^0-9.]/g, ''));
              cy.get('[data-cy=total-amount]').then(($total) => {
                const total = parseFloat($total.text().replace(/[^0-9.]/g, ''));
                expect(total).to.equal(subtotal + shipping + tax);
              });
            });
          });
        });
      });
    });

    it('should handle different payment methods', () => {
      cy.get('@products').then((products) => {
        // Add product to cart and go to checkout
        cy.visit(`/products/${products.laptop.id}`);
        cy.get('[data-cy=add-to-cart-button]').click();
        cy.get('[data-cy=cart-icon]').click();
        cy.get('[data-cy=checkout-button]').click();

        // Fill shipping information
        cy.fillForm({
          'shipping-name': 'John Doe',
          'shipping-email': 'john@example.com',
          'shipping-address': '123 Main St',
          'shipping-city': 'New York',
          'shipping-state': 'NY',
          'shipping-zip': '10001',
        });

        // Test credit card payment
        cy.get('[data-cy=payment-method-credit-card]').click();
        cy.fillForm({
          'card-number': '4242424242424242',
          'card-expiry': '12/25',
          'card-cvc': '123',
          'card-name': 'John Doe',
        });

        cy.get('[data-cy=place-order-button]').click();
        cy.get('[data-cy=order-success]').should('be.visible');

        // Test PayPal payment
        cy.visit('/checkout');
        cy.get('[data-cy=payment-method-paypal]').click();
        cy.get('[data-cy=paypal-button]').should('be.visible');
      });
    });
  });

  describe('User Account Management', () => {
    beforeEach(() => {
      cy.get('@users').then((users) => {
        cy.login(users.user.email, users.user.password);
      });
    });

    it('should view order history', () => {
      cy.visit('/account/orders');

      // Verify order history page
      cy.get('[data-cy=order-history]').should('be.visible');
      cy.get('[data-cy=order-item]').should('have.length.at.least', 1);

      // Click on order to view details
      cy.get('[data-cy=order-item]').first().click();
      cy.get('[data-cy=order-details]').should('be.visible');
    });

    it('should update profile information', () => {
      cy.visit('/account/profile');

      // Update profile information
      cy.fillForm({
        'profile-name': 'Updated Name',
        'profile-email': 'updated@example.com',
        'profile-phone': '9876543210',
      });

      cy.get('[data-cy=save-profile-button]').click();
      cy.get('[data-cy=success-message]').should('contain', 'Profile updated successfully');
    });

    it('should manage saved addresses', () => {
      cy.visit('/account/addresses');

      // Add new address
      cy.get('[data-cy=add-address-button]').click();
      cy.fillForm({
        'address-name': 'Home Address',
        'address-street': '456 Oak St',
        'address-city': 'Los Angeles',
        'address-state': 'CA',
        'address-zip': '90210',
      });

      cy.get('[data-cy=save-address-button]').click();
      cy.get('[data-cy=success-message]').should('contain', 'Address added successfully');

      // Verify address is saved
      cy.get('[data-cy=saved-address]').should('contain', 'Home Address');
    });

    it('should manage payment methods', () => {
      cy.visit('/account/payment-methods');

      // Add new payment method
      cy.get('[data-cy=add-payment-method-button]').click();
      cy.fillForm({
        'card-number': '5555555555554444',
        'card-expiry': '12/25',
        'card-cvc': '123',
        'card-name': 'John Doe',
      });

      cy.get('[data-cy=save-payment-method-button]').click();
      cy.get('[data-cy=success-message]').should('contain', 'Payment method added successfully');

      // Verify payment method is saved
      cy.get('[data-cy=saved-payment-method]').should('contain', '**** **** **** 4444');
    });
  });

  describe('Product Reviews and Ratings', () => {
    beforeEach(() => {
      cy.get('@users').then((users) => {
        cy.login(users.user.email, users.user.password);
      });
    });

    it('should submit product review', () => {
      cy.get('@products').then((products) => {
        cy.visit(`/products/${products.laptop.id}`);

        // Scroll to reviews section
        cy.get('[data-cy=reviews-section]').scrollIntoView();

        // Click write review button
        cy.get('[data-cy=write-review-button]').click();

        // Fill review form
        cy.fillForm({
          'review-rating': '5',
          'review-title': 'Great Product!',
          'review-comment': 'This laptop exceeded my expectations. Fast performance and great build quality.',
        });

        cy.get('[data-cy=submit-review-button]').click();
        cy.get('[data-cy=success-message]').should('contain', 'Review submitted successfully');

        // Verify review appears
        cy.get('[data-cy=review-item]').should('contain', 'Great Product!');
      });
    });

    it('should validate review form', () => {
      cy.get('@products').then((products) => {
        cy.visit(`/products/${products.laptop.id}`);
        cy.get('[data-cy=reviews-section]').scrollIntoView();
        cy.get('[data-cy=write-review-button]').click();

        // Try to submit empty review
        cy.get('[data-cy=submit-review-button]').click();

        // Verify validation errors
        cy.validateFormErrors({
          'review-rating': 'Rating is required',
          'review-title': 'Title is required',
          'review-comment': 'Comment is required',
        });
      });
    });

    it('should filter and sort reviews', () => {
      cy.get('@products').then((products) => {
        cy.visit(`/products/${products.laptop.id}`);
        cy.get('[data-cy=reviews-section]').scrollIntoView();

        // Filter by rating
        cy.get('[data-cy=rating-filter-5]').click();
        cy.get('[data-cy=review-item]').each(($review) => {
          cy.wrap($review).find('[data-cy=review-rating]').should('contain', '5');
        });

        // Sort by date
        cy.get('[data-cy=sort-reviews]').select('newest');
        cy.get('[data-cy=review-item]').first().should('contain', '2024');
      });
    });
  });

  describe('Wishlist Functionality', () => {
    beforeEach(() => {
      cy.get('@users').then((users) => {
        cy.login(users.user.email, users.user.password);
      });
    });

    it('should add products to wishlist', () => {
      cy.get('@products').then((products) => {
        cy.visit(`/products/${products.laptop.id}`);

        // Add to wishlist
        cy.get('[data-cy=add-to-wishlist-button]').click();
        cy.get('[data-cy=wishlist-count]').should('contain', '1');

        // Verify product is in wishlist
        cy.visit('/wishlist');
        cy.get('[data-cy=wishlist-item]').should('contain', products.laptop.name);
      });
    });

    it('should remove products from wishlist', () => {
      cy.get('@products').then((products) => {
        // Add product to wishlist
        cy.visit(`/products/${products.laptop.id}`);
        cy.get('[data-cy=add-to-wishlist-button]').click();

        // Remove from wishlist
        cy.visit('/wishlist');
        cy.get('[data-cy=remove-from-wishlist]').click();

        // Verify wishlist is empty
        cy.get('[data-cy=empty-wishlist]').should('be.visible');
      });
    });

    it('should move wishlist items to cart', () => {
      cy.get('@products').then((products) => {
        // Add product to wishlist
        cy.visit(`/products/${products.laptop.id}`);
        cy.get('[data-cy=add-to-wishlist-button]').click();

        // Move to cart
        cy.visit('/wishlist');
        cy.get('[data-cy=move-to-cart]').click();

        // Verify item is in cart and removed from wishlist
        cy.get('[data-cy=cart-count]').should('contain', '1');
        cy.get('[data-cy=empty-wishlist]').should('be.visible');
      });
    });
  });

  describe('Mobile Responsive Testing', () => {
    it('should work correctly on mobile devices', () => {
      cy.setMobileViewport();
      cy.visit('/products');

      // Verify mobile navigation
      cy.get('[data-cy=mobile-menu-button]').click();
      cy.get('[data-cy=mobile-menu]').should('be.visible');

      // Test mobile product browsing
      cy.get('[data-cy=product-card]').first().click();
      cy.get('[data-cy=product-details]').should('be.visible');

      // Test mobile cart
      cy.get('[data-cy=add-to-cart-button]').click();
      cy.get('[data-cy=mobile-cart-button]').click();
      cy.get('[data-cy=cart-items]').should('be.visible');
    });

    it('should handle mobile checkout process', () => {
      cy.setMobileViewport();
      cy.get('@users').then((users) => {
        cy.login(users.user.email, users.user.password);
      });

      cy.get('@products').then((products) => {
        // Add product to cart
        cy.visit(`/products/${products.laptop.id}`);
        cy.get('[data-cy=add-to-cart-button]').click();

        // Mobile checkout
        cy.get('[data-cy=mobile-cart-button]').click();
        cy.get('[data-cy=checkout-button]').click();

        // Fill mobile-optimized forms
        cy.fillForm({
          'mobile-shipping-name': 'John Doe',
          'mobile-shipping-email': 'john@example.com',
          'mobile-shipping-phone': '1234567890',
        });

        cy.get('[data-cy=place-order-button]').click();
        cy.get('[data-cy=order-success]').should('be.visible');
      });
    });
  });

  describe('Performance Testing', () => {
    it('should load product catalog within acceptable time', () => {
      const startTime = Date.now();
      cy.visit('/products');
      cy.get('[data-cy=product-grid]').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(3000);
      });
    });

    it('should handle large product catalogs', () => {
      // Mock large product catalog
      cy.intercept('GET', '**/api/products**', {
        statusCode: 200,
        body: {
          products: Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`,
            price: 99.99 + i,
            category: 'Electronics',
          })),
          total: 100,
        },
      });

      cy.visit('/products');
      cy.get('[data-cy=product-card]').should('have.length', 20); // Default page size
    });

    it('should handle concurrent user actions', () => {
      cy.get('@products').then((products) => {
        const concurrentActions = [
          () => cy.visit('/products'),
          () => cy.visit(`/products/${products.laptop.id}`),
          () => cy.visit('/categories'),
          () => cy.visit('/search?q=laptop'),
        ];

        const startTime = Date.now();
        cy.wrap(Promise.all(concurrentActions.map(action => action()))).then(() => {
          const totalTime = Date.now() - startTime;
          expect(totalTime).to.be.lessThan(5000);
        });
      });
    });
  });
});
