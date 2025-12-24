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

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const payOwedGroup = async (req, res) => {
  try {
    const { id, groupId } = req.params;
    const { amount } = req.body;

    const payment = Number(amount);
    if (isNaN(payment) || payment <= 0) {
      return res
        .status(400)
        .json({ message: "Payment amount must be positive" });
    }

    const customer = await Customer.findOne({
      _id: id,
      "owedGroups._id": groupId,
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer or group not found" });
    }

    const group = customer.owedGroups.id(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const newAmountPaid = Math.min(group.amountPaid + payment, group.total);
    const newOutstanding = Math.max(group.total - newAmountPaid, 0);
    const outstandingDelta = group.outstanding - newOutstanding;

    group.amountPaid = newAmountPaid;
    group.outstanding = newOutstanding;

    if (customer.amountOwed && outstandingDelta > 0) {
      customer.amountOwed = Math.max(customer.amountOwed - outstandingDelta, 0);
    }

    await customer.save();

    res.status(200).json({ owedGroup: group, amountOwed: customer.amountOwed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  deleteCustomer,
  payOwedGroup,
};
