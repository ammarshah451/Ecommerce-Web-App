import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { LightBtn } from "../shared/SharedComponents";
import { Link } from "react-router-dom";
import {
  BabyChangingStationOutlined as BabyChangingStationOutlinedIcon,
  BlenderOutlined as BlenderOutlinedIcon,
  CheckroomOutlined as CheckroomOutlinedIcon,
  ComputerOutlined as ComputerOutlinedIcon,
  DiamondOutlined as DiamondOutlinedIcon,
  FavoriteBorderOutlined as FavoriteBorderOutlinedIcon,
  PhoneAndroidOutlined as PhoneAndroidOutlinedIcon,
} from "@mui/icons-material";

const orderColumns = [
  {
    field: "id",
    headerName: "ORDER-ID",
    headerClassName: "table-header",
    width: 170,
  },
  {
    field: "userId",
    headerName: "USER-ID",
    headerClassName: "table-header",
    width: 170,
  },
  {
    field: "Date",
    headerName: "Date",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Typography sx={{ marginTop: ".7rem" }}>{params.value}</Typography>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const data = params.value;
      return (
        <div
          style={{
            backgroundColor:
              data === "cancelled"
                ? `rgb(255, 243, 244)`
                : data === "shipping"
                ? `rgb(255, 251, 240)`
                : `rgb(239, 244, 229)`,
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor:
              data === "cancelled"
                ? `#E2362F`
                : data === "shipping"
                ? `#FEC600`
                : `#006400`,
            color:
              data === "cancelled"
                ? `#E2362F`
                : data === "shipping"
                ? `#FEC600`
                : `#006400`,
          }}
          className={`h-[2rem] text-center rounded-md w-[6rem] flex flex-row justify-center items-center mt-2`}
        >
          <span className="font-thin">{data}</span>
        </div>
      );
    },
  },
  {
    field: "Total",
    headerName: "Total",
    headerClassName: "table-header",
    width: 180,
    renderCell: (params) => (
      <Typography sx={{ marginTop: ".7rem" }}>${params.value}</Typography>
    ),
  },
  {
    field: "details",
    headerName: "Details",
    headerClassName: "table-header",
    width: 200,
    renderCell: ({ row }) => {
      return (
        <Typography
          variant="inherit"
          sx={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => row.action_handler(row.id, row.userId)}
        >
          View Details
        </Typography>
      );
    },
  },
];

const customerColumns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
    renderCell: (params) => (
      <Typography sx={{ marginTop: ".7rem" }}>{params.value}</Typography>
    ),
  },
  {
    field: "email",
    headerName: "Email",
    headerClassName: "table-header",
    width: 300,
    renderCell: (params) => (
      <Typography sx={{ marginTop: ".7rem" }}>{params.value}</Typography>
    ),
  },
  {
    field: "phonenumber",
    headerName: "PhoneNumber",
    headerClassName: "table-header",
    width: 280,
  },
];

const productsColumns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "imgUrl",
    headerName: "Image",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Avatar
        src={params.value}
        sx={{
          borderRadius: "0%",
          marginTop: ".5rem",
          height: "5rem",
          width: "5rem",
        }}
      />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Typography
        sx={{
          marginTop: "2rem",
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: "stocks",
    headerName: "Stocks",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Typography sx={{ marginTop: "2rem" }}>
        <LightBtn data={params.value} width={"5rem"} />
      </Typography>
    ),
  },
  {
    field: "price",
    headerName: "Price",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Typography sx={{ marginTop: "2rem" }} fontWeight={"bold"}>
        ${params.value}
      </Typography>
    ),
  },
  {
    field: "quantity",
    headerName: "Quantity",
    headerClassName: "table-header",
    width: 110,
    renderCell: (params) => (
      <Typography sx={{ marginTop: "2rem" }} fontWeight={"bold"}>
        {params.value}{" "}
      </Typography>
    ),
  },
  {
    field: "categoryname",
    headerName: "Category",
    headerClassName: "table-header",
    width: 180,
    renderCell: (params) => (
      <Typography sx={{ marginTop: "2rem" }}>{params.value}</Typography>
    ),
  },
];

const categoryColumns = [
  {
    field: "ID",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Typography
        fontWeight={"bold"}
        sx={{
          marginTop: ".7rem",
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: "name",
    headerName: "name",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Typography
        fontWeight={"bold"}
        sx={{
          marginTop: ".7rem",
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: "description",
    headerName: "Description",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      return (
        <Typography
          sx={{
            marginTop: ".7rem",
          }}
        >
          {params.value}
        </Typography>
      );
    },
  },
];

const topProductsColumns = [
  {
    field: "imgUrl",
    headerName: "Image",
    headerClassName: "table-header",
    width: 150,
    renderCell: ({ row }) => {
      return (
        <Box sx={{ marginTop: ".9rem" }}>
          <Avatar
            src={row.imgUrl}
            sx={{ borderRadius: "0%", width: "8rem", height: "7rem" }}
          />
        </Box>
      );
    },
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 250,
  },
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "price",
    headerName: "Price",
    headerClassName: "table-header",
    width: 150,
  },
];

const predefinedDepartmentsData = [
  {
    name: "Consumer Electronics",
    url: "/shop?category=electronics",
    icon: <BlenderOutlinedIcon />,
  },

  {
    name: "Clothing & Apparel",
    url: "/shop?category=clothings",
    icon: <CheckroomOutlinedIcon />,
  },

  {
    name: "Health & Beauty",
    url: "/shop?category=health",
    icon: <FavoriteBorderOutlinedIcon />,
  },
  {
    name: "Jewelry & Watches",
    url: "/shop?category=wearable",
    icon: <DiamondOutlinedIcon />,
  },
  {
    name: "Computer & Technology",
    url: "/shop?category=technology",
    icon: <ComputerOutlinedIcon />,
  },
  {
    name: "Baby & Moms",
    url: "/shop?category=accessories",
    icon: <BabyChangingStationOutlinedIcon />,
  },
  {
    name: "Phones & Accessories",
    url: "/shop?category=accessories",
    icon: <PhoneAndroidOutlinedIcon />,
  },
];

const predefinedFooterDivsData = [
  {
    name: "Consumer Electronics",
    details: [
      {
        name: "Air Conditioners",
        url: "/shop?category=electronics",
      },
      {
        name: "Audio & Threats",
        url: "/shop?category=electronics",
      },
      {
        name: "Office Electronics",
        url: "/shop?category=electronics",
      },
      {
        name: "TV Bang",
        url: "/shop?category=electronics",
      },
      {
        name: "Washing Machines",
        url: "/shop?category=electronics",
      },
    ],
  },
  {
    name: "Office & Equipments",
    details: [
      {
        name: "Printers",
        url: "/shop?category=electronics",
      },
      {
        name: "Projectors",
        url: "/shop?category=electronics",
      },
      {
        name: "Scanners",
        url: "/shop?category=electronics",
      },
    ],
  },
  {
    name: "Jewelry & Watches",
    details: [
      {
        name: "Necklace",
        url: "/shop?category=wearable",
      },
      {
        name: "Pendant",
        url: "/shop?category=wearable",
      },
      {
        name: "Diamong Ring",
        url: "/shop?category=wearable",
      },
      {
        name: "Silver Earing",
        url: "/shop?category=wearable",
      },
    ],
  },
  {
    name: "Health & Beauty",
    details: [
      {
        name: "Hair Care",
        url: "/shop?category=health&type=shampoo",
      },
      {
        name: "Decoration",
        url: "/shop?category=dontknow&type=dontknow",
      },
      {
        name: "Fregnance",
        url: "/shop?category=wearable&type=fregnance",
      },
    ],
  },
];

const predefinedCategoriesData = [
  {
    name: "Consumer Electronics",
    image: "#",
    items: ["Iron", "Washing Machines", "Juicer Blender"],
  },
];

const predefinedTypesData = [
  "Men",
  "Women",
  "Kids",
  "Technology",
  "Home Accessories",
  "Kitchen Appliances",
];

const predefinedPagesOfHeader = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Shop",
    url: "/shop?category=electronics",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Contact",
    url: "/contact",
  },
];

export {
  orderColumns,
  customerColumns,
  productsColumns,
  categoryColumns,
  topProductsColumns,
  predefinedDepartmentsData,
  predefinedFooterDivsData,
  predefinedCategoriesData,
  predefinedTypesData,
  predefinedPagesOfHeader,
};
