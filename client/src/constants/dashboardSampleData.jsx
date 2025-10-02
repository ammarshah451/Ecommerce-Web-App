import moment from "moment";

export const sampleOrdersData = [
  {
    ID: 1,
    userId: "A108",
    Date: "2022-01-01",
    paymentMethod: "CASH",
    status: "Delivered",
    Total: "$1000",
  },
  {
    ID: 2,
    userId: "A109",
    Date: "2022-01-01",
    paymentMethod: "CASH",
    status: "Delivered",
    Total: "$2000",
  },
  {
    ID: 3,
    userId: "A100",
    Date: "2022-01-01",
    paymentMethod: "CASH",
    status: "Delivered",
    Total: "$10000",
  },
];
export const sampleCustomersData = [
  {
    ID: "L105",
    Name: "Ahsan",
    Email: "ahsan@gmail.com",
    PhoneNumber: "1234567890",
    TotalOrders: 100,
  },
  {
    ID: "L106",
    Name: "Ammar",
    Email: "ammar@gmail.com",
    PhoneNumber: "1234567890",
    TotalOrders: 200,
  },
  {
    ID: "L107",
    Name: "Shaaf",
    Email: "shaaf@gmail.com",
    PhoneNumber: "1234567890",
    TotalOrders: 300,
  },
  {
    ID: "L108",
    Name: "Waqi",
    Email: "waqi@gmail.com",
    PhoneNumber: "1234567890",
    TotalOrders: 50,
  },
  {
    ID: "L109",
    Name: "Ali Zuberi",
    Email: "zuberi@gmail.com",
    PhoneNumber: "1234567890",
    TotalOrders: 1000,
  },
];

export const sampleProductsData = [
  {
    ID: 1,
    Name: "Mobile",
    Stocks: "stock",
    Price: "$1000",
    Category: "Electronics",
    Type: "Technology",
    url: "",
  },
  {
    ID: 2,
    Name: "Charger",
    Stocks: "stock",
    Price: "$2000",
    Category: "Electronics",
    Type: "Accessories",
    url: "",
  },
  {
    ID: 3,
    Name: "Shirt",
    Stocks: "stock",
    Price: "$1000",
    Category: "Clothing",
    Type: "Men",
    url: "",
  },

  {
    ID: 4,
    Name: "Socks",
    Stocks: "stock",
    Price: "$10",
    Category: "Wearable",
    Type: "Men",
    url: "",
  },
];

export const sampleCategoryData = [
  {
    ID: 1,
    Name: "Electronics",
    Slug: "electronics",
    CreatedAt: moment().format("DD/MM/YYYY"),
  },
  {
    ID: 2,
    Name: "Clothing",
    Slug: "clothing",
    CreatedAt: moment().format("DD/MM/YYYY"),
  },
  {
    ID: 3,
    Name: "Wearable",
    Slug: "wearable",
    CreatedAt: moment().format("DD/MM/YYYY"),
  },
  {
    ID: 4,
    Name: "Wearable",
    Slug: "wearable",
    CreatedAt: moment().format("DD/MM/YYYY"),
  },
  {
    ID: 5,
    Name: "Wearable",
    Slug: "wearable",
    CreatedAt: moment().format("DD/MM/YYYY"),
  },
  {
    ID: 6,
    Name: "Wearable",
    Slug: "wearable",
    CreatedAt: moment().format("DD/MM/YYYY"),
  },
];

export const topProductsSampleData = [
  {
    ID: 1,
    Name: "Fregnance",
    Price: "$400",
    url: "https://martfuryapi.nouhtml5.com/uploads/ads_3_ab76d440ae.jpeg",
    Category: "Electronics",
    totalSold: "1000",
  },
  {
    ID: 2,
    Name: "Watch",
    Price: "$200",
    url: "https://martfuryapi.nouhtml5.com/uploads/ads_3_ab76d440ae.jpeg",
    Category: "Accessories",
    totalSold: "500",
  },
  {
    ID: 4,
    Name: "Shirt",
    Price: "$800",
    url: "https://martfuryapi.nouhtml5.com/uploads/ads_3_ab76d440ae.jpeg",
    Category: "Clothings",
    totalSold: "400",
  },
  {
    ID: 5,
    Name: "Computer",
    Price: "$700",
    url: "https://martfuryapi.nouhtml5.com/uploads/ads_3_ab76d440ae.jpeg",
    Category: "Electronics",
    totalSold: "200",
  },
];
