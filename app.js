//console.log("Hello FSW 1 Luar biasa");
const fs = require("fs"); //untuk memanggil isi json dan ini tidak perlu instal karena bawaan nodejs
const express = require("express"); //memanggil express
const app = express(); //inisialisasi app dengan memanggil express
const PORT = 8000; // localhost: 8000

// middleware untuk membaca json dari request body dari client
app.use(express.json());

// inisialisasi untuk membaca data json
const customers = JSON.parse(fs.readFileSync(`${__dirname}/data/dummy.json`));

// ================== GET ================================
//anonymous function menggunakan parameter req,res,next
app.get("/", (req, res, next) => {
  res.send("<h1>Hello FSW 1 Tercinta..</h1>");
});

// memanggil data dummy json yg ada di folder data
// /api/v1/customers  => merupakan penamaan yg sesuai dengan aturan API dimana nama api terus versi dan collection atau datanya
//api get all data
app.get("/api/v1/customers", (req, res, next) => {
  res.status(200).json({
    status: "success",
    totData: customers.length,
    data: {
      customers,
    },
  });
});

// ================================= GET Data BY ID ======================================
//api utk get data by id menggunakan params untuk memanggil parameter
app.get("/api/v1/customers/:id", (req, res, next) => {
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
});
// =============================== END ================================

// =============================== PATCH ================================
// API untuk update data
//put mengharuskan update semua objek data
//patch hanya spesifik data yg mau diupdate

app.patch("/api/v1/customers/:id", (req, res) => {
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
});
// =============================== END ================================

// ======================== POST ================================
// app.post("/api/v1/customers", (req, res) => {
//   console.log(req.body);
//   res.send("selesai"); //harus ada akhiran res dalam rest api dengan express agar tidak mutar terus req nya atau load
// });

//api post atau insert data dummy
app.post("/api/v1/customers/", (req, res) => {
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
});
// =============================== END ================================

// ======================== DELETE ================================
app.delete("/api/v1/customers/:id", (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`APP running on port : ${PORT}`);
});

// app.get("/", defaultRouter);
// app.route("/api/v1/customers").get(getCustomers).post(createCustomer);
// app
//   .route("/api/v1/customers/:id")
//   .get(getCustomersById)
//   .patch(updateCustomer)
//   .delete(deleteCustomer);
