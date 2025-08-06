
const Customer = require("../../models/customer.mongo");
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { customerName, phone, email, address } = req.body;

    // Validation
    if (!customerName || !phone) {
      return res.status(400).json({
        message: "Customer name and phone are required",
        errors: {
          customerName: !customerName ? "Customer name is required" : null,
          phone: !phone ? "Phone number is required" : null,
        },
      });
    }

    // Check for existing customer by name or phone
    const existingCustomer = await Customer.findOne({
      $or: [{ customerName: customerName.trim() }, { phone: phone.trim() }],
    });

    if (existingCustomer) {
      return res.status(400).json({
        message: "Customer with this name or phone number already exists",
      });
    }

    const customer = await Customer.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      address: address?.trim(),
    });

    res.status(201).json(customer);
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
};
