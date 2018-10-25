import PageManager from '../pageManager';
import FacetedSearch from './components/faceted-search';
import Loading from 'bc-loading';
import Tabs from 'bc-tabs';
import compareToggle from "./global/compare-toggles";
import AdvancedSearch from './core/AdvancedSearch';
import bonsai from 'jquery-bonsai';

export default class Search extends PageManager {
  constructor() {
    super();
    compareToggle();

    const loadingOptions = {
      loadingMarkup: '<div class="loading"></div>',
      visibleClass: 'visible',
      scrollLockClass: 'scroll-locked',
    };

    if ($('[data-faceted-search]').length) {
      this._initializeFacetedSearch();
      this.sidebarOverlay = new Loading(loadingOptions, true, '[data-category-sidebar]');
    }

    if ($('.advanced-search-dropdown').length) {
      this.$closeAdvancedSearch = $('[data-advanced-search-cancel]');
      this.$toggleAdvancedSearch = $('.advanced-search-toggle');

      this._bindEvents();

      new AdvancedSearch();
    }

    this._initTabs();
  }

  loaded() {
    if ($('.advanced-search-dropdown').length) {
      this._advancedSearchCategories();
    }
  }

  _initializeFacetedSearch() {
    const facetedSearchOptions = {
      config: {
        category: {
          shop_by_price: true,
        },
      },
      template: {
        productListing: 'search/product-listing',
        sidebar: 'search/sidebar',
      },
      showMore: 'search/show-more'
    };

    const facetedSearch = new FacetedSearch(facetedSearchOptions, {
      willUpdate: () => this.sidebarOverlay.show(),
      didUpdate: () => this.sidebarOverlay.hide(),
    });
  }

  _bindEvents() {
    $('[data-dropdown-toggle]').on('click', (event) => {
      this._toggleAdvancedSearch();
    });

    this.$toggleAdvancedSearch.on('click', (event) => {
      $('[data-search-title]').toggle();
      $('[data-search-form]').toggle();
      this.$toggleAdvancedSearch.toggle();
    });

    this.$closeAdvancedSearch.on('click', (event) => {
      this.$toggleAdvancedSearch.trigger('click');
    });
  }

  _initTabs() {
    this.tabs = new Tabs({
      titleSelector: $('.tab-title'),
      afterSetup: (activeTab) => {
        if (!$('#product-results .product-listing').length || (window.location.search.indexOf('section=content') > -1)) {
          setTimeout(() => {
            $('[href="#content-results"]').trigger('click');
          }, 10);
        }
      },
    });
  }

  _toggleAdvancedSearch() {
    const $target = $(event.currentTarget).closest('[data-dropdown]');
    const $dropdown = $('[data-dropdown]');

    // Close any open ones first
    $dropdown
      .not($target)
      .removeClass('dropdown-open')
      .find('[data-dropdown-panel]')
      .revealer('hide');

    $dropdown
      .not($target)
      .find('[data-dropdown-toggle]')
      .removeClass('panel-opens');

    // Toggle panel
    $target
      .toggleClass('dropdown-open', open)
      .find('[data-dropdown-panel]')
      .revealer('toggle');

    $target
      .find('[data-dropdown-toggle]')
      .toggleClass('panel-opens');
  }

  _advancedSearchCategories() {
    $('#advanced-search-checkboxes').bonsai({
      expanAll: true,
      checkboxes: true,
      createInputs: 'checkbox'
    });
  }
}
