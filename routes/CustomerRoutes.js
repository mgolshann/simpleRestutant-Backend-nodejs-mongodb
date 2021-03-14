const express = require("express");
const Customer = require("../models/CustomerModel");
const {validateCreateCustomer} = require("../validators/CustomerValidator");
const router = express.Router();

let customers = [
  { id: 1, name: "ali" },
  { id: 2, name: "saeed" },
  { id: 3, name: "mohammad" },
  { id: 4, name: "yalda" },
];

router.get("/api/customers", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});


router.post("/api/customers", async function (req, res) {

  // Validate data from client
  const { error } = validateCreateCustomer(req.body);
  if (error) return res.status(400).send({ message: error.message });

  let customer = new Customer ({
    name: req.body.name,
  });

  customer = await customer.save();
  res.send(customer);
});



router.get("/api/customers/:id", (req, res) => {
  const customer = customers.find(item => item.id == req.params.id);
  if (customer)
    res.send(customer);
  else res.status(404).send("not found");
});


router.put("/api/customers/:customerId", (req, res) => {
  // input validation
  const schema = Joi.object({
    name: Joi.string().min(2).max(10).required(),
    customerId: Joi.number().required()
  });
  const { error } = schema.validate({ ...req.body, customerId: req.params.customerId });
  if (error)
    return res.status(400).send({ message: error.message });

  const index = customers.findIndex(item => item.id == req.params.customerId);
  if (index === -1)
    return res.status(404).send({ message: "مشتری مورد نظر یافت نشد" })
  customers[index].name = req.body.name;
  res.send(customers[index]);
});

router.delete("/api/customers/:customerId", (req, res) => {
  const index = customers.findIndex(item => item.id == req.params.customerId);
  if (index === -1)
    return res.status(404).send({ message: "مشتری مورد نظر یافت نشد" })
  customers = [...customers.slice(0, index), ...customers.slice(index + 1)];
  res.status(200).send();
});


module.exports = router;
/*
* [1,2,3,4,5]
* */