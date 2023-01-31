const express = require("express");
const router = express.Router();
const { validatorMiddleware } = require("../middleware/validatorMiddleware");

/**@import Employee validators  */
const { CreateEmployeeValidations } = require("../validators/userValidator");

/**@import @auth_middleware */
const { protect } = require("../middleware/authMiddleware");

/**@import employee CRUD functions from employee controller */
const {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} = require("../controllers/employeeController");

/**@all employee routes */
router
  .route("/")
  .post(
    protect,
    CreateEmployeeValidations,
    validatorMiddleware,
    createEmployee
  );
router.route("/").get(protect, getEmployees);
router.route("/:id").patch(protect, updateEmployee);
router.route("/:id").delete(protect, deleteEmployee);

module.exports = router;
