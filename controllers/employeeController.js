const asyncHandler = require("express-async-handler");

/**@import @Employee model */
const Employee = require("../models/Employees");

/**
 * @description To create a new Employee
 * @api api/v1/employee/create
 * @access public
 * @type POST
 */
const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, dateOfBirth, salary, gender } = req.body;

  try {
    /**@check if employee exists*/
    const employeeExist = await Employee.findOne({ email });
    if (employeeExist) {
      res.status(409).json({
        success: false,
        message: "Employee already exists",
      });
    } else {
      /**@create employee*/
      const employee = await Employee.create({
        name,
        email,
        dateOfBirth,
        salary,
        gender,
        createdBy: req.userData.id,
      });

      if (employee) {
        res.status(201).json({
          success: true,
          message: "Employee created successfully",
          data: employee,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid employee data",
        });
      }
    }
  } catch (e) {
    throw new Error(e);
  }
});

/**
 * @description Get employee
 * @api api/v1/employee/
 * @access public
 * @type GET
 */
const getEmployees = asyncHandler(async (req, res) => {
  /**@defining total @page per request, @limit and @search */
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";

  try {
    const employees = await Employee.find({
      name: { $regex: search, $options: "i" },
      isDeleted: false,
    })
      .skip(page * limit)
      .limit(limit);

    /**@counter for total number of @documents */
    const total = await Employee.countDocuments({
      name: { $regex: search, $options: "i" },
      isDeleted: false,
    });

    res.status(200).json({
      success: true,
      data: employees,
      total,
    });
  } catch (e) {
    throw new Error(e);
  }
});

/**
 * @description Update employee
 * @api api/v1/employee/update
 * @access private
 * @type PATCH
 */
const updateEmployee = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, email, dateOfBirth, salary, createdBy, gender } = req.body;

  try {
    const employee = await Employee.findById({ _id: id });
    const employeeNotExist = (await employee.isDeleted) === true;
    if (employeeNotExist) {
      res.status(400);
      throw new Error("Employee not found");
    } else {
      const updateData = {
        name,
        email,
        dateOfBirth,
        salary,
        createdBy,
        gender,
        updatedBy: req.userData.id,
      };

      const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (updatedEmployee) {
        res.status(201).json({
          success: true,
          message: "Employee updated successfully",
          data: updatedEmployee,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid employee data",
        });
      }
    }
  } catch (e) {
    throw new Error(e);
  }
});

/**
 * @description Delete employee, personally i prefer soft deletion, for real deletion i put the code below this function
 * @api api/v1/employee/update
 * @access private
 * @type PATCH
 */
const deleteEmployee = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const isDeleted = {
      isDeleted: true,
    };

    const employee = await Employee.findById({ _id: id });
    const employeeNotExist = (await employee.isDeleted) === true;
    if (employeeNotExist) {
      res.status(400);
      throw new Error("Employee not found");
    } else {
      const deletedEmployee = await Employee.findByIdAndUpdate(id, isDeleted);
      if (deletedEmployee) {
        res.status(201).json({
          success: true,
          message: "Employee deleted successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid employee data",
        });
      }
    }
  } catch (e) {
    throw new Error(e);
  }
});

/**@real deletion or employee from the database  */
// const deleteEmployee = asyncHandler(async (req, res) => {
//   const id = req.params.id;
//   try {
//     const isDeleted = {
//       isDeleted: true,
//     };

//     const employee = await Employee.findById({ _id: id });
//     const condition = (await employee.isDeleted) === true;

//     if (condition) {
//       req.status(400);
//       throw new Error("Employee not found");
//     }

//     const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
//     if (deletedEmployee) {
//       res.status(201).json({
//         success: true,
//         message: "Employee deleted successfully",
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Invalid employee data",
//       });
//     }
//   } catch (e) {
//        throw new Error(e);
//   }
// });

module.exports = {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
};
