import {
  Add as AddIcon,
  AddShoppingCartOutlined as AddShoppingCartOutlinedIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Straight as StraightIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  Slider,
  Stack,
  styled,
  Typography,
  SpeedDial,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
const storeName = "SwiftShop";

import { Button } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { transformImage } from "../lib/features";

const SearchBtn = ({
  variable,
  setVariable,
  finalHandler,
  heading = "Search...",
}) => (
  <div className="m-2 border inline-block">
    <input
      type="text"
      id="search"
      className="w-[20rem] h-[3rem] border rounded-0 p-2  focus:outline-none focus:border-yellow-300"
      placeholder={heading}
      value={variable}
      onChange={(e) => setVariable(e.target.value)}
    />

    <IconButton onClick={finalHandler}>
      <SearchIcon />
    </IconButton>
  </div>
);

const GreenPlusBtn = ({ data, handler, icon = "", w = "13rem" }) => {
  return (
    <button
      style={{
        height: "3rem",
        width: w,
        marginLeft: ".4rem",
        border: "1px solid white",
        backgroundColor: "#80bc00",
        color: "white",
        cursor: "pointer",
      }}
      onClick={handler}
    >
      {icon !== "" ? <AddIcon sx={{ color: "white" }} /> : <></>}
      <span>{data}</span>
    </button>
  );
};
const WhiteBtn = ({ data, icon = "", handler, w = "13rem" }) => {
  return (
    <Box
      sx={{
        "&:hover .MuiIconButton-root": {
          transition: "all 0.2s ease-in-out",
          color: "white", // Change icon color on hover
        },
        "&:hover .do-white": {
          color: "white", // Change icon color on hover
        },
      }}
    >
      <button
        style={{
          height: "3rem",
          width: w,
          marginTop: ".2rem",
          marginLeft: ".4rem",
          cursor: "pointer",
          display: "inline-block",
        }}
        className="hover:bg-[#FCB800] bg-[#F3F2ED] transition-all ease-in-out duration-300 flex items-center justify-center"
        onClick={handler}
      >
        {icon !== "" ? (
          <IconButton
            sx={{
              // border: "1px solid red",
              borderRadius: "0%",
              height: "1.5rem",
              width: "1.4rem",
            }}
          >
            {icon}
          </IconButton>
        ) : (
          <></>
        )}
        <span className="do-white hover:text-white transition-all duration-300">
          {data}
        </span>
      </button>
    </Box>
  );
};

const LightBtn = ({ data, width }) => (
  <div
    style={{
      width: width,
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor:
        data === "active" || data === "paid" || data === "stock"
          ? `#006400`
          : `rgb(102, 102, 102)`,
      backgroundColor:
        data === "active" || data === "paid" || data === "stock"
          ? `rgb(239, 244, 229)`
          : `rgb(233, 233, 233)`,
      color:
        data === "active" || data === "paid" || data === "stock"
          ? `#006400`
          : `rgb(102, 102, 102)`,
    }}
    className={`h-[2rem] text-center rounded-md flex flex-row justify-center items-center`}
  >
    <span>{data}</span>
  </div>
);

const SelectDropDownBtn = ({ heading, list, variable, setVar }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{heading}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label={heading}
        value={variable}
        onChange={(e) => setVar(e.target.value)}
      >
        {list.map((item, index) => (
          <MenuItem value={item} key={index}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const InputBtn = ({
  heading,
  variable,
  setVar,
  w = "17rem",
  h = "3rem",
  type = "text",
  m = 2,
}) => (
  <div
    style={{
      margin: m,
      width: w,
      height: h,
    }}
  >
    <input
      type={type}
      id={heading}
      className={`w-full h-full border-1 rounded-0 p-2  focus:border-yellow-300 focus:outline-none`}
      placeholder={`${heading}...`}
      value={variable}
      required
      onChange={(e) => setVar(e.target.value)}
    />
  </div>
);

const HorizontalLine = ({
  marginTop = "0rem",
  w = "100%",
  h = ".01rem",
  bg = "#D3D3D3",
}) => (
  <div
    style={{
      height: h,
      width: w,
      // marginLeft: ".6rem",
      backgroundColor: bg,
      marginTop: marginTop,
    }}
  >
    <br />
  </div>
);

const VerticalLine = ({ w = ".5rem", h = "2rem", marginTop = "1.8rem" }) => (
  <div
    style={{
      height: h,
      width: w,
      marginTop: marginTop,
      backgroundColor: "#DCDCDC",
      marginRight: ".5rem",
    }}
  ></div>
);

const DropDownBtn = ({ list = [], setHandler }) => {
  return (
    <div>
      <div className="w-0 h-[2rem] ml-[3rem] border-l-[15px] border-l-transparent border-b-[20px] border-b-white border-r-[15px] border-r-transparent"></div>
      <Paper
        sx={{
          backgroundColor: "white",
          // marginTop: ".1rem",
          overflowY: "auto",
          maxHeight: "20rem",
          width: "10rem",
        }}
      >
        {list.length > 0 ? (
          list.map((name, index) => (
            <div
              key={index}
              className="cursor-pointer p-2 text-semibold hover:bg-[#fcb800] duration-300 ease-in-out z-10"
              onClick={() => {
                setHandler(name);
              }}
            >
              {name[0].toUpperCase() + name.slice(1)}
            </div>
          ))
        ) : (
          <></>
        )}
      </Paper>
    </div>
  );
};

const DropDownBtnForProducts = ({ list = [] }) => {
  return (
    <Paper
      sx={{
        backgroundColor: "white",
        border: "1px solid #D3D3D3",
        width: "44.1rem",
        borderRadius: 0,
        marginTop: ".01rem",
        marginLeft: "-9.35rem",
      }}
    >
      <Stack
        sx={{
          width: "100%",
          maxHeight: "40rem",
          overflowY: "auto",
          height: "20rem",
        }}
      >
        {list.length > 0 ? (
          list.map(({ imgUrl, url, name, price, rating = "5" }, index) => (
            <Stack
              direction={"row"}
              justifyContent={"center"}
              key={index}
              sx={{
                height: "6rem",
                gap: "1rem",
                width: "100%",
                // border: "1px solid red",
                marginTop: index !== 0 ? "1rem" : "0rem",
                "&:hover": {
                  border: "1px solid gray",
                },
              }}
            >
              {/* Image URl */}
              <Box
                sx={{
                  width: "17%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  // border: "1px solid red",
                  marginLeft: ".5rem",
                }}
              >
                <Avatar
                  src={transformImage(imgUrl)}
                  sx={{ borderRadius: "0%", height: "100%", width: "100%" }}
                />
              </Box>
              <Box
                sx={{
                  width: "80%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  // border: "1px solid black",
                }}
              >
                <Link to={url} className="no-underline">
                  {name}
                </Link>
                <Typography>${price}</Typography>
                <Rating name="read-only" value={rating} readOnly size="small" />
              </Box>
            </Stack>
          ))
        ) : (
          <></>
        )}
      </Stack>
    </Paper>
  );
};

const DropDownUrlBtn = ({ list = [] }) => {
  return (
    <div>
      <div className="w-0 h-[2rem] ml-[3rem] border-l-[15px]  border-l-transparent border-b-[20px] border-b-white border-r-[15px] border-r-transparent"></div>
      <Paper
        sx={{
          backgroundColor: "white",
          marginTop: "-1.7rem",
          overflowY: "auto",
          maxHeight: "50rem",
          width: "20rem",
          border: "1px solid #DCDCDC",
          borderRadius: 0,
        }}
      >
        {list.length > 0 ? (
          list.map(({ icon, name, url }, index) => (
            <Link
              to={url}
              key={index}
              className="no-underline hover:bg-[#fcb800] duration-300 flex flex-row justify-center items-center overflowY-auto cursor-pointer"
            >
              <div className=" flex flex-row justify-center w-[17rem] gap-1 h-[4rem] items-center text-black">
                <div className="mt-[1rem] font-thin text-left cursor-pointer  h-[2.5rem] w-[12rem]  text-semibold order-2 duration-300 ease-in-out ">
                  {name}
                </div>
                <div className="order-1  h-[2.5rem] w-[3rem]">
                  {icon ? (
                    <IconButton sx={{ color: "black" }}>{icon}</IconButton>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <></>
        )}
      </Paper>
    </div>
  );
};

const UnderLineBtn = ({ heading, redirect }) => (
  <Link to={redirect} className="no-underline text-gray-500">
    <Typography
      variant="inherit"
      sx={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
        "::before": {
          content: '""',
          position: "absolute",
          width: "0",
          height: "1px",
          bottom: "0",
          left: "0",
          backgroundColor: "black", // Border color
          transition: "width 0.3s ease-in-out",
        },
        ":hover::before": {
          width: "100%", // Expands the border from LHS to RHS on hover
        },
      }}
    >
      {heading}
    </Typography>
  </Link>
);

const CategoriesOfMonthBox = ({ heading, url, name }) => (
  <Box
    sx={{
      border: "1px solid #DCDCDC",
      marginTop: "1rem",
      "&:hover": {
        border: "1px solid #fcb800",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
      },
    }}
  >
    <Link
      to={`/shop?category=${name.toLowerCase()}`}
      className="no-underline  text-black h-[80%] mt-4 w-[12rem] text-center flex flex-col gap-6 justify-center items-center"
    >
      <Avatar
        src={url}
        sx={{ borderRadius: "0%", height: "60%", width: "50%" }}
      />
      <Typography>{heading}</Typography>
    </Link>
  </Box>
);

const SupportButton = ({ icon, heading, message }) => (
  <Stack direction={"row"} height={"100%"} width={"100%"}>
    <Box
      sx={{
        width: "22%",
        height: "100%",
        paddingTop: ".7rem",
      }}
    >
      <IconButton>{icon ?? icon}</IconButton>
    </Box>
    <Box
      sx={{
        width: "60%",
        height: "100%",
        paddingTop: "1rem",
        // marginLeft: "-1rem",
      }}
    >
      <Typography sx={{ color: "black" }}>{heading}</Typography>
      <Typography caption={"inherit"} sx={{ color: "gray" }}>
        {message}
      </Typography>
    </Box>
  </Stack>
);

const ProductCard = ({ product, addToCart, showAProduct }) => {
  return (
    <div className="hover:border hover:border-gray-400 relative duration-300 flex flex-row justify-center items-center">
      <div
        className={`h-[23rem] mt-4 mx-8 flex z-0 flex-col justify-around items-start group`}
      >
        {/* Render Product Image */}
        <div>
          <Avatar
            src={product.imgUrl}
            sx={{
              borderRadius: "0%",
              height: "13rem",
              width: "15rem",
            }}
          />
        </div>
        <div className="-mb-16 flex flex-row justify-evenly gap-2 bg-white h-[2.5rem] w-[15rem] relative top-[-3rem] opacity-[0.01] transition-all duration-300 group-hover:opacity-100 ">
          <IconButton
            onClick={() => {
              showAProduct(product);
            }}
            sx={{
              "&:hover": {
                borderColor: "#ffc107", // Yellow border on hover
                backgroundColor: "#ffc107",
                transition: "all 0.3s ease-in-out",
              },
              "&:hover .MuiSvgIcon-root": {
                color: "white", // Changes icon color to white on hover
              },
            }}
          >
            <VisibilityOutlinedIcon sx={{ color: "gray" }} />
          </IconButton>
          <IconButton
            onClick={() => {
              addToCart(product, 1);
            }}
            sx={{
              "&:hover": {
                borderColor: "#ffc107", // Yellow border on hover
                backgroundColor: "#ffc107",
                borderWidth: "1rem",
                transition: "all 0.3s ease-in-out",
              },
              "&:hover .MuiSvgIcon-root": {
                color: "white", // Changes icon color to white on hover
              },
            }}
          >
            <AddShoppingCartOutlinedIcon sx={{ color: "gray" }} />
          </IconButton>
        </div>
        <Typography sx={{ marginTop: "1rem" }}>MartFury Shop</Typography>
        <div className="flex flex-row gap-1">
          <Typography>Quantity left:</Typography>
          <Typography sx={{ color: "red" }}>{product.quantity}</Typography>
        </div>
        <HorizontalLine marginTop={"-.2rem"} w={"80%"} />
        {/* Product Text */}
        <div>
          <Link
            to={product.url}
            className="no-underline text-blue-800 hover:text-yellow-400 duration-200"
          >
            {product.name}
          </Link>
          <br />
          <Rating
            name="half-rating-read"
            defaultValue={parseInt(product.rating)}
            readOnly
          />
          <Typography fontWeight={"semibold"}>${product.price}</Typography>
        </div>
      </div>
    </div>
  );
};

const VerticalProductCard = ({ product, addToCart }) => (
  <Stack direction={"row"} width={"100%"} height={"100%"} gap={"0.5rem"}>
    <Box
      sx={{
        width: "30%",
        // border: "1px solid black",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Avatar
        src={product.imgUrl}
        sx={{ borderRadius: "0%", height: "90%", width: "65%" }}
      />
    </Box>

    <Stack
      sx={{
        width: "40%",
        // border: "1px solid black",
        height: "100%",
      }}
      justifyContent={"center"}
    >
      <Link to={product.url} className="no-underline">
        <YellowUnderLineBtn data={product.name} />
      </Link>
      <Typography>Sold By: {storeName}</Typography>
      <Rating
        name="half-rating-read"
        defaultValue={parseInt(product.rating)}
        precision={0.5}
        readOnly
      />
      <ul className="list-disc text-gray-600 -ml-[.8rem]">
        {product.description?.split(",").map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
    </Stack>

    <Stack
      sx={{
        width: "18%",
        // border: "1px solid black",
        height: "100%",
        marginLeft: "8rem",
      }}
      justifyContent={"center"}
    >
      <Typography
        fontWeight={"semi-bold"}
        variant="h6"
        sx={{ marginBottom: "1rem" }}
      >
        ${product.price}
      </Typography>

      <Button
        className="w-[12.5rem] h-[3rem] "
        variant="warning"
        onClick={() => addToCart(product, 1)}
      >
        Add To Cart
      </Button>
    </Stack>
  </Stack>
);

const ProductSliderHeader = ({ data, url }) => (
  <div className="w-[100%] h-[4rem] bg-gray-200 border-b-2 p-4 border-b-gray-300 flex flex-row justify-between items-center">
    <Typography variant="h5">{data}</Typography>
    <div className="text-gray-600">
      <Link
        to={url}
        className="hover:text-yellow-400 text font-thin duration-300 mr-4 no-underline"
      >
        New Arrivals
      </Link>
      <Link
        to={url}
        className="hover:text-yellow-400 text font-thin duration-300 mr-4 no-underline"
      >
        Most popular
      </Link>
      <Link
        to={url}
        className="hover:text-yellow-400 text font-thin duration-300 no-underline "
      >
        View All
      </Link>
    </div>
  </div>
);

const productResponsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 4,
  },
};

const CustomRightArrow = ({ onClick, ...rest }) => {
  const {
    onMove,
    carouselState: { currentSlide, deviceType },
  } = rest;
  // onMove means if dragging or swiping in progress.
  return <button onClick={() => onClick()} />;
};

const imageResponsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const ImageSlider = ({ images = [] }) => {
  return images.length > 0 ? (
    <div
      style={{
        zIndex: 1,
        // position: "relative",
      }}
    >
      <Carousel
        responsive={imageResponsive}
        // customRightArrow={<CustomRightArrow />}
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={index}
              className=" duration-300 flex flex-row justify-center items-center"
            >
              <img src={image} alt={"Loading...."} />
            </div>
          ))
        ) : (
          <div></div>
        )}
      </Carousel>
    </div>
  ) : (
    <></>
  );
};

const ProductSlider = ({ products = [], showAProduct, addToCart }) => {
  return (
    <Carousel
      responsive={productResponsive}
      customRightArrow={<CustomRightArrow />}
    >
      {products.length > 0 ? (
        products.map(
          (pr, index) =>
            pr.quantity > 0 && (
              <ProductCard
                key={index}
                product={pr}
                showAProduct={showAProduct}
                addToCart={addToCart}
              />
            )
        )
      ) : (
        <div></div>
      )}
    </Carousel>
  );
};

const MoveToTopBtn = ({ handler }) => (
  <div
    onClick={handler}
    className="border-2 hover:border-yellow-500 flex justify-center items-center cursor-pointer bg-white transition duration-300 animate-bounce  h-[3.5rem] w-[3.5rem] absolute left-[90rem] top-[290rem]"
  >
    <StraightIcon
      sx={{
        fontSize: 35,
        color: "gray",
        "&:hover": { color: "#eab308" },
      }}
    />
  </div>
);

const YellowUnderLineBtn = ({ data, url }) => (
  <Link
    to={url}
    className="no-underline hover:text-yellow-400 duration-300  cursor-pointer"
  >
    {data}
  </Link>
);

const PriceRangeSelector = ({ prices = [], setPrices, setPage }) => {
  const setRange = (e, newVal) => {
    setPrices(newVal);
    setPage(1);
  };
  return (
    <div
      style={{
        display: "block",
        width: "16rem",
      }}
    >
      <Slider
        value={prices}
        onChange={setRange}
        valueLabelDisplay="auto"
        marks
        min={0}
        max={100}
        step={10}
      />
    </div>
  );
};

const IncrementDecrementBtn = ({ count, handleDecrement, handleIncrement }) => (
  <div className="mt-2 flex flex-row w-[40%] flex-wrap">
    <div className="w-[30%]">
      <Typography sx={{ color: "black" }} variant="inherit">
        Quantity
      </Typography>
      <div className="border-2 h-[3rem] w-[12.5rem] flex items-center justify-between px-4 mt-2">
        <button
          onClick={handleDecrement}
          className="text-gray-600  p-2 text-2xl font-bold rounded transition-all duration-200"
        >
          -
        </button>
        <span className="text-xl">{count}</span>
        <button
          onClick={handleIncrement}
          className="text-gray-600  p-2 text-2xl font-bold rounded transition-all duration-200"
        >
          +
        </button>
      </div>
    </div>
  </div>
);

const CrossBtn = ({ handler }) => (
  <button
    onClick={handler}
    className="absolute left-[54rem] top-[.1rem] rounded-2xl w-[2rem] h-[2rem] flex items-center justify-center text-white bg-red-600 hover:bg-red-700 focus:outline-none"
  >
    <CloseIcon sx={{ fontSize: 20 }} />
  </button>
);

const SpecificProductRenderer = ({
  handlerClose,
  product,
  count,
  handleDecrement,
  handleIncrement,
  lineWidth = "30rem",
  addToCart,
}) => {
  const navigate = useNavigate();
  return (
    <Stack sx={{ height: "46rem" }} direction={"row"}>
      {handlerClose ? (
        <div>
          <CrossBtn handler={handlerClose} />
        </div>
      ) : (
        <></>
      )}
      {/* Product Image */}
      <Stack
        sx={{ height: "100%", width: "45%" }}
        alignItems={"center"}
        paddingTop={"4rem"}
      >
        <Avatar
          src={product?.imgUrl}
          sx={{ borderRadius: "0%", height: "60%", width: "90%" }}
        />
      </Stack>
      {/* Product Image */}

      {/* Product Info */}
      <Stack
        sx={{
          height: "100%",
          width: "55%",
          // border: "1px solid red",
          paddingTop: "3.3rem",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={"semibold"}
            sx={{ color: "black" }}
          >
            {product?.name}
          </Typography>

          <Typography
            variant="inherit"
            sx={{
              color: "black",
              textDecoration: "no-underline",
              display: "inline-block",
            }}
          >
            Product ID:
          </Typography>
          <Link className=" inline-block">
            <Typography
              sx={{
                display: "inline-block",
                marginLeft: ".5rem",
              }}
            >
              {product?.id}
            </Typography>
          </Link>

          <Rating
            name="read-only"
            value={parseInt(product?.rating)}
            readOnly
            size="small"
            sx={{ marginLeft: "1rem" }}
          />
        </Box>
        <HorizontalLine w={lineWidth} />

        {/* Description */}
        <Box sx={{ marginTop: "2rem" }}>
          <Typography
            fontWeight={"bold"}
            fontSize={"1.3rem"}
            sx={{ color: "black" }}
          >
            ${product?.price}
          </Typography>
          <ul className="list-disc text-gray-600 -ml-[.9rem] mt-2 space-y-5">
            {product?.description?.split(",").map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </Box>
        <HorizontalLine w={lineWidth} />

        {/* Quantity Button */}
        <Stack direction={"row"}>
          <IncrementDecrementBtn
            count={count}
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
          />
          <div className="w-[60%]">
            <Button
              className="w-[12.5rem] h-[3rem] mt-[2.5rem] ml-4"
              variant="warning"
              onClick={() => addToCart(product, count)}
            >
              Add To Cart
            </Button>
          </div>
        </Stack>

        <div className="w-[70%]">
          <Button
            className=" h-[3rem] mt-[2rem] w-[30rem]"
            variant="success"
            onClick={() => navigate("/cart")}
          >
            Go to Shopping Cart
          </Button>
        </div>
        <HorizontalLine w={lineWidth} marginTop="1rem" />

        {/* Report Abuse */}
        <Box>
          <Typography
            variant="inherit"
            sx={{ color: "black", textDecoration: "underline" }}
          >
            Report Abuse
          </Typography>
          <Link className="no-underline inline-block">
            <Typography
              sx={{
                color: "black",
                display: "inline-block",
                marginRight: ".5rem",
              }}
            >
              Category:
            </Typography>
            {product?.categoryname}
          </Link>
        </Box>
        <Box>
          {/* <FacebookIcon sx={{ color: "blue", cursor: "pointer" }} />
        <InstagramIcon sx={{ color: "red", cursor: "pointer" }} />
        <EmailIcon sx={{ color: "green", cursor: "pointer" }} />
        <XIcon sx={{ color: "black", cursor: "pointer" }} /> */}
        </Box>
      </Stack>

      {/* Product Info */}
    </Stack>
  );
};
const URLOfPageTopBar = ({ url }) => (
  <Box
    sx={{
      marginBottom: "2rem",
      marginTop: "-1.05rem",
      width: "96rem",
      height: "4rem",
      backgroundColor: "#D3D3D3",
      display: "flex",
      alignItems: "center",
      marginLeft: "-1rem",
    }}
  >
    <Typography variant="inherit" sx={{ paddingLeft: "1.5rem" }}>
      {url}
    </Typography>
  </Box>
);

const ReturnToBackBtn = ({ heading, handler }) => (
  <div
    className="flex flex-row cursor-pointer duration-300 hover:text-yellow-400"
    onClick={handler}
  >
    <div>
      <span className=" text-3xl  mr-2">&#x2190;</span>
    </div>
    <div className="mt-[.5rem]">
      <span>{heading}</span>
    </div>
  </div>
);

const YellowBtn = ({ heading, w = "15rem", h = "3rem", handler }) => (
  <div
    style={{
      width: w,
      height: h,
    }}
  >
    <button
      onClick={handler}
      className={`w-[100%] h-[100%] rounded-md flex items-center justify-center bg-[#fcb800] hover:bg-black hover:text-white duration-300 ease-in-out`}
    >
      {heading}
    </button>
  </div>
);

export {
  CategoriesOfMonthBox,
  CrossBtn,
  DropDownBtn,
  DropDownUrlBtn,
  GreenPlusBtn,
  HorizontalLine,
  ImageSlider,
  IncrementDecrementBtn,
  InputBtn,
  LightBtn,
  MoveToTopBtn,
  PriceRangeSelector,
  ProductCard,
  ProductSlider,
  ProductSliderHeader,
  SearchBtn,
  SelectDropDownBtn,
  SpecificProductRenderer,
  SupportButton,
  UnderLineBtn,
  VerticalLine,
  VerticalProductCard,
  WhiteBtn,
  YellowUnderLineBtn,
  URLOfPageTopBar,
  ReturnToBackBtn,
  DropDownBtnForProducts,
  YellowBtn,
};
