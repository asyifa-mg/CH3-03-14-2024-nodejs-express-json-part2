//console.log("Hello FSW 1 Luar biasa");
const fs = require("fs"); //untuk memanggil isi json dan ini tidak perlu instal karena bawaan nodejs
const express = require("express"); //memanggil express
const app = express(); //inisialisasi app dengan memanggil express
const PORT = 8000; // localhost: 8000

// middleware untuk membaca json dari request body dari client
app.use(express.json());

// inisialisasi untuk membaca data json
const customers = JSON.parse(fs.readFileSync(`${__dirname}/data/dummy.json`));

// function
const defaultRouter = (req, res, next) => {
  res.send("<h1>Hello FSW 1 Tercinta..</h1>");
};

const getCustomers = (req, res, next) => {
  res.status(200).json({
    status: "success",
    totData: customers.length,
    data: {
      customers,
    },
  });
};

const getByID = (req, res, next) => {
  console.log(req.params);
  console.log(req.params.id);
  const id = req.params.id;

  //menggunakan array method untuk mendapatkan data spesifik
  const customer = customers.find((cust) => cust._id === id);
  console.log(customer);

  //shortcut pemanggilan objek dengan params lebih simpel
  // const { id } = req.params;
  // console.log(id);

  //===================
  res.status(200).json({
    status: "success",
    data: {
      customer,
    },
  });
};

const updateCustomers = (req, res) => {
  const id = req.params.id;

  //1. lakukan pencarian data yang sesuai parameter id nya
  const customer = customers.find((cust) => cust._id === id);
  const customerIndex = customers.findIndex((cust) => cust._id === id);

  console.log(customer);
  console.log(customerIndex);
  console.log(!customer);

  // 2. ada gak data customer nya?
  if (!customer) {
    //pencarian jika data tdk ada
    return res.status(404).json({
      status: "fail",
      message: `Customer dengan ID: ${id}" gak ada`,
    });
  }

  //3. kalau ada berarti update data nya sesuai request body dari client/user
  // object assign = menggabungkan object or spread operator (...)
  customers[customerIndex] = { ...customers[customerIndex], ...req.body };
  console.log(customers[customerIndex]);

  //4. melakukan update didokumen json nya
  fs.writeFile(
    `${__dirname}/data/dummy.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "Berhasil update data",
      });
    },
  );
};

const createCustomers = (req, res) => {
  console.log(req.body);

  const newCustomer = req.body;

  customers.push(newCustomer);

  fs.writeFile(
    `${__dirname}/data/dummy.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          customer: newCustomer,
        },
      });
    },
  );
};

const deleteData = (req, res) => {
  const id = req.params.id;
  //console.log("masuk tidak ya");
  //1. lakukan pencarian data yang sesuai parameter id nya
  const customer = customers.find((cust) => cust._id === id);
  const customerIndex = customers.findIndex((cust) => cust._id === id);

  // // 2. ada gak data customer nya
  if (!customer) {
    //pencarian jika data tdk ada
    return res.status(404).json({
      status: "fail",
      message: `Customer dengan ID: ${id}" gak ada`,
    });
  }
  //3. kalau ada berarti delete data nya
  customers.splice(customerIndex, 1);

  //4. melakukan delete didokumen
  fs.writeFile(
    `${__dirname}/data/dummy.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(201).json({
        status: "success",
        message: "berhasil delete data",
        data: {
          customer: customer[customerIndex],
          customer,
        },
      });
    },
  );
};

// URL
app.get("/", defaultRouter);
app.get("/api/v1/customers", getCustomers);
app.get("/api/v1/customers/:id", getByID);
app.patch("/api/v1/customers/:id", updateCustomers);
app.post("/api/v1/customers/", createCustomers);
app.delete("/api/v1/customers/:id", deleteData);

app.route("/api/v1/customers").get(getCustomers).post(createCustomers);

app
  .route("/api/v1/customers/:id")
  .get(getByID)
  .patch(updateCustomers)
  .delete(deleteData);

app.listen(PORT, () => {
  console.log(`APP running on port : ${PORT}`);
});
