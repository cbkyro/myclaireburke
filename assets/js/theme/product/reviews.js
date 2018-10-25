import FormValidator from '../utils/FormValidator';

export default class Reviews {
  constructor(context) {
    this.context = context;
    this.url = location.href;
    this.Validator = new FormValidator(this.context);

    this._productReviewHandler();
    this._bindEvents();
  }

  _toggleReviewForm() {
    $('.reviews-leave-review').addClass('hidden');
    $('.reviews-form-wrapper').revealer();
  }

  _bindEvents() {
    $('.reviews-leave-review').on('click', (e) => {
      this._toggleReviewForm();
    });
  }

  _productReviewHandler() {
    if (this.url.indexOf('#write_review') !== -1) {
      this._toggleReviewForm();
    }
  }
}
