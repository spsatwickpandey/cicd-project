class BasePage {
  constructor() {
    this.baseUrl = Cypress.config('baseUrl');
  }

  // Navigation methods
  visit(path = '') {
    cy.visit(`${this.baseUrl}${path}`);
    this.waitForPageLoad();
    return this;
  }

  waitForPageLoad() {
    cy.waitForPageLoad();
    return this;
  }

  // Element interaction methods
  click(selector, options = {}) {
    cy.get(selector, options).click();
    return this;
  }

  type(selector, text, options = {}) {
    cy.get(selector, options).clear().type(text);
    return this;
  }

  select(selector, option, options = {}) {
    cy.get(selector, options).select(option);
    return this;
  }

  check(selector, options = {}) {
    cy.get(selector, options).check();
    return this;
  }

  uncheck(selector, options = {}) {
    cy.get(selector, options).uncheck();
    return this;
  }

  // Validation methods
  shouldBeVisible(selector, options = {}) {
    cy.get(selector, options).should('be.visible');
    return this;
  }

  shouldNotBeVisible(selector, options = {}) {
    cy.get(selector, options).should('not.be.visible');
    return this;
  }

  shouldContain(selector, text, options = {}) {
    cy.get(selector, options).should('contain', text);
    return this;
  }

  shouldHaveValue(selector, value, options = {}) {
    cy.get(selector, options).should('have.value', value);
    return this;
  }

  // Form methods
  fillForm(formData) {
    Object.entries(formData).forEach(([field, value]) => {
      this.type(`[data-cy=${field}]`, value);
    });
    return this;
  }

  submitForm(selector = '[data-cy=submit-button]') {
    this.click(selector);
    return this;
  }

  // File upload methods
  uploadFile(selector, fileName, fileType = 'image/jpeg') {
    cy.uploadFile(selector, fileName, fileType);
    return this;
  }

  // Screenshot methods
  takeScreenshot(name) {
    cy.compareSnapshot(name);
    return this;
  }

  takeElementScreenshot(selector, name) {
    cy.get(selector).compareSnapshot(name);
    return this;
  }

  // Performance methods
  measurePageLoad() {
    return cy.measurePageLoad();
  }

  // Utility methods
  scrollTo(selector) {
    cy.get(selector).scrollIntoView();
    return this;
  }

  waitForElement(selector, timeout = 10000) {
    cy.get(selector, { timeout });
    return this;
  }

  // URL validation
  shouldBeOnPage(path) {
    cy.url().should('include', path);
    return this;
  }

  // Mobile responsive methods
  setMobileViewport() {
    cy.setMobileViewport();
    return this;
  }

  setTabletViewport() {
    cy.setTabletViewport();
    return this;
  }

  setDesktopViewport() {
    cy.setDesktopViewport();
    return this;
  }

  // Error handling
  shouldShowError(selector, errorMessage) {
    cy.get(selector).should('contain', errorMessage);
    return this;
  }

  shouldNotShowError(selector) {
    cy.get(selector).should('not.exist');
    return this;
  }

  // Loading states
  waitForLoadingToComplete(selector = '[data-cy=loading]') {
    cy.get(selector).should('not.exist');
    return this;
  }

  // Modal handling
  openModal(triggerSelector) {
    this.click(triggerSelector);
    return this;
  }

  closeModal(closeSelector = '[data-cy=modal-close]') {
    this.click(closeSelector);
    return this;
  }

  // Toast/notification handling
  shouldShowToast(message) {
    cy.get('[data-cy=toast]').should('contain', message);
    return this;
  }

  // Table methods
  getTableRow(index) {
    return cy.get(`[data-cy=table-row]:nth-child(${index + 1})`);
  }

  getTableCell(rowIndex, columnIndex) {
    return this.getTableRow(rowIndex).find(`[data-cy=table-cell]:nth-child(${columnIndex + 1})`);
  }

  // Pagination methods
  goToNextPage() {
    this.click('[data-cy=pagination-next]');
    return this;
  }

  goToPreviousPage() {
    this.click('[data-cy=pagination-prev]');
    return this;
  }

  goToPage(pageNumber) {
    this.click(`[data-cy=pagination-page-${pageNumber}]`);
    return this;
  }

  // Search methods
  search(query) {
    this.type('[data-cy=search-input]', query);
    this.click('[data-cy=search-button]');
    return this;
  }

  clearSearch() {
    this.click('[data-cy=search-clear]');
    return this;
  }

  // Filter methods
  applyFilter(filterName, filterValue) {
    this.click(`[data-cy=filter-${filterName}]`);
    this.click(`[data-cy=filter-option-${filterValue}]`);
    return this;
  }

  clearFilters() {
    this.click('[data-cy=clear-filters]');
    return this;
  }

  // Sort methods
  sortBy(columnName, direction = 'asc') {
    this.click(`[data-cy=sort-${columnName}]`);
    if (direction === 'desc') {
      this.click(`[data-cy=sort-${columnName}]`); // Click again to reverse
    }
    return this;
  }

  // Bulk actions
  selectAllItems() {
    this.check('[data-cy=select-all]');
    return this;
  }

  selectItem(index) {
    this.check(`[data-cy=select-item-${index}]`);
    return this;
  }

  performBulkAction(action) {
    this.click(`[data-cy=bulk-action-${action}]`);
    return this;
  }

  // Confirmation dialogs
  confirmAction() {
    this.click('[data-cy=confirm-button]');
    return this;
  }

  cancelAction() {
    this.click('[data-cy=cancel-button]');
    return this;
  }

  // Keyboard shortcuts
  pressKey(key) {
    cy.get('body').type(key);
    return this;
  }

  pressEscape() {
    this.pressKey('{esc}');
    return this;
  }

  pressEnter() {
    this.pressKey('{enter}');
    return this;
  }

  pressTab() {
    this.pressKey('{tab}');
    return this;
  }

  // Accessibility methods
  shouldBeAccessible() {
    // Basic accessibility checks
    cy.get('body').should('have.attr', 'role');
    cy.get('img').should('have.attr', 'alt');
    return this;
  }

  // Network methods
  interceptApiCall(method, url, response) {
    cy.interceptApiCall(method, url, response);
    return this;
  }

  waitForApiCall(method, url) {
    cy.waitForApiCall(method, url);
    return this;
  }

  // Data management
  createTestData(type, data) {
    cy.createTestData(type, data);
    return this;
  }

  cleanupTestData(type, id) {
    cy.cleanupTestData(type, id);
    return this;
  }
}

export default BasePage; 