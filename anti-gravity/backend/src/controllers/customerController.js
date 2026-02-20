const customerService = require("../services/customerService");

class CustomerController {
  /**
   * Get customer by phone
   */
  async getByPhone(req, res, next) {
    try {
      const { phone } = req.params;
      const customer = await customerService.findByPhone(phone);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer tidak ditemukan",
        });
      }

      res.json({
        success: true,
        data: customer,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all customers (Admin)
   */
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const result = await customerService.getAll(page, limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CustomerController();
