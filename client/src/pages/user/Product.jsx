import {
  AccountBalanceWalletOutlined as AccountBalanceWalletOutlinedIcon,
  Language as LanguageIcon,
  LocalShippingOutlined as LocalShippingOutlinedIcon,
  ReceiptOutlined as ReceiptOutlinedIcon,
  TableRowsTwoTone,
} from "@mui/icons-material";
import { Box, Rating, Stack, Tab, Tabs, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hooks";
import AppLayout from "../../layout/AppLayout";
import Footer from "../../layout/Footer";
import { Loader } from "../../layout/Loader";
import { getCartObj } from "../../lib/features";
import {
  useGetAProductQuery,
  useGiveFeedbackMutation,
} from "../../redux/api/api";
import { addToCart } from "../../redux/reducers/cart";
import {
  HorizontalLine,
  InputBtn,
  SpecificProductRenderer,
} from "../../shared/SharedComponents";

const Product = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [product, setProduct] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [count, setCount] = useState(1);

  const dispatch = useDispatch();

  const { isLoading, data, isError, error } = useGetAProductQuery({
    id,
  });

  const [giveFeedbackQuery] = useGiveFeedbackMutation();

  useErrors([{ isError, error }]);

  const fetchFeedbacks = async () => {
    try {
      const resp = await axios.get(
        `${server}/api/v1/user/getFeedbacks?productId=${id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (resp?.data?.success) {
        setFeedbacks(resp?.data?.message || []);
      }
    } catch (error) {
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    if (data) {
      setProduct(data?.message);
    }
    fetchFeedbacks();
  }, [data]);

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => {
    if (count > 1) setCount(count - 1);
  };

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (e, newVal) => setSelectedTab(newVal);

  const addToCartHandler = (product, quantity) => {
    const cartObj = getCartObj(product, quantity);

    dispatch(addToCart(cartObj));
    toast.success(`Added to cart successfully!`);
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(3);

  const feedbackSubmitHandler = async () => {
    if (name === "" || email === "" || feedback === "")
      return toast.error("Please fill all the fields of feedback section");

    const toastId = toast.loading("Submitting your Feedback...");

    try {
      const obj = {
        productId: id,
        name,
        email,
        feedback,
        rating,
        userId: user.id,
      };

      const response = await giveFeedbackQuery(obj);
      console.log(response.error);
      if (response?.data?.success) {
        toast.success(response?.data?.message, {
          id: toastId,
        });
        navigate(`/product/${id}`);
      } else {
        toast.error(
          response?.error?.data?.message || "Oops! Something went wrong",
          {
            id: toastId,
          }
        );
        navigate(`/product/${id}`);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Oops! Something went wrong", {
        id: toastId,
      });
      navigate(`/product/${id}`);
    } finally {
      setName("");
      setEmail("");
      setFeedback("");
    }
  };

  const FeedbackComponent = (
    <div className=" w-full container mx-auto  bg-white p-8 rounded-lg">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-[25rem]">
          <div className="text-6xl text-[#80bc00]">4.00</div>
          <Rating
            name="simple-controlled"
            value={parseInt(product?.rating)}
            readOnly
          />
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span>5 Star</span>
              <div className="flex-1 mx-4 bg-gray-300 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-2 w-full"></div>
              </div>
              <span>100%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>4 Star</span>
              <div className="flex-1 mx-4 bg-gray-300 h-2 rounded-full">
                <div className="bg-yellow-500 h-2 w-[80%]"></div>
              </div>
              <span>80%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>3 Star</span>
              <div className="flex-1 mx-4 bg-gray-300 h-2 rounded-full">
                <div className="bg-yellow-500 h-2 w-[60%]"></div>
              </div>
              <span>60%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>2 Star</span>
              <div className="flex-1 mx-4 bg-gray-300 h-2 rounded-full">
                <div className="bg-yellow-500 h-2 w-[20%]"></div>
              </div>
              <span>40%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>1 Star</span>
              <div className="flex-1 mx-4 bg-gray-300 h-2 rounded-full">
                <div className="bg-yellow-500 h-2 w-[5%]"></div>
              </div>
              <span>20%</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold mb-4">Submit Your Review</h3>
          <p className="text-gray-600 text-sm mb-2">
            Your email address will not be published. Required fields are marked{" "}
            <span className="text-red-500">*</span>
          </p>
          <p className="text-gray-700 font-medium mb-4">
            Your rating of this product
            <Rating
              value={rating}
              precision={1}
              onChange={(e, newVal) => setRating(newVal)}
              size="small"
            />
          </p>

          <textarea
            className="w-full p-4 border border-gray-500 rounded mb-4 focus:border-yellow-500 focus:outline-none"
            placeholder="Write your review here"
            rows="4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <div className="mb-4 flex flex-row justify-between">
            <InputBtn
              heading={"Name"}
              type={"text"}
              variable={name}
              setVar={setName}
              w={"20rem"}
            />
            <InputBtn
              heading={"Email"}
              type={"email"}
              variable={email}
              setVar={setEmail}
              w={"20rem"}
            />
          </div>
          <Button
            onClick={feedbackSubmitHandler}
            variant="success"
            className="w-[25rem]"
          >
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );

  const ReviewsComponent = (
    <Stack>
      {feedbacks.length > 0 ? (
        <Stack>
          {feedbacks.map(
            ({ user_id, item_id, rating, feedback, name, email }) => (
              <div className="w-[70rem] bg-white border-2 border-gray rounded-lg p-6 mt-2">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex justify-center items-center text-white font-bold">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      {name}
                    </p>
                    <div className="-mt-4">
                      <Rating value={parseInt(rating)} readOnly />
                    </div>
                  </div>
                </div>

                <p className="ml-[4rem] -mt-4">{feedback}</p>
              </div>
            )
          )}
        </Stack>
      ) : (
        <Typography
          variant="h5"
          sx={{ marginTop: "1rem" }}
          textAlign={"center"}
          fontWeight={600}
        >
          NO REVIEWS YET!
        </Typography>
      )}
    </Stack>
  );

  return (
    <AppLayout>
      <Box sx={{ width: "100%" }}>
        {/* URL of page */}
        <Box
          sx={{
            marginBottom: "2rem",
            marginTop: "-1.05rem",
            width: "102%",
            height: "4rem",
            marginLeft: "-1rem",
            backgroundColor: "#D3D3D3",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="inherit" sx={{ paddingLeft: "1.5rem" }}>
            Home/Shop/{id}
          </Typography>
        </Box>
        {/* URL of page */}
        {/* Product */}
        <Stack
          sx={{ height: "40rem", width: "99%" }}
          justifyContent={"space-between"}
          direction={"row"}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <Stack sx={{ height: "100%", width: "95%" }}>
              {data?.success ? (
                <SpecificProductRenderer
                  product={product}
                  count={count}
                  handleDecrement={handleDecrement}
                  handleIncrement={handleIncrement}
                  addToCart={addToCartHandler}
                />
              ) : (
                <div>No Such Product Exists</div> //Give here no products Found message
              )}
            </Stack>
          )}
          <Stack
            sx={{
              height: "100%",
              width: "30%",
              marginLeft: "2rem",
            }}
            direction={"row"}
            justifyContent={"center"}
          >
            {/* Top Left Box */}
            <Stack
              sx={{
                height: "16rem",
                width: "20rem",
                backgroundColor: "#eaeaeafa",
                padding: "1rem", // Added padding to make it look better
              }}
            >
              <div>
                {/* Shipping World Wide */}
                <div className="flex items-center space-x-4 mb-4">
                  <LanguageIcon />
                  <span className="text-md">Shipping World Wide</span>
                </div>

                {/* 15 days exchange policy */}
                <div className="flex items-center space-x-4 mb-4">
                  <LocalShippingOutlinedIcon />
                  <span className="text-md">15 days exchange policy</span>
                </div>

                {/* Cash on delivery available */}
                <div className="flex items-center space-x-4 mb-4">
                  <AccountBalanceWalletOutlinedIcon />
                  <span className="text-md">Cash on delivery available</span>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <ReceiptOutlinedIcon />
                  <span className="text-md">Free 7 Day Trial Easy!</span>
                </div>
              </div>
            </Stack>
            {/* Top Left Box */}
          </Stack>
        </Stack>
        {/* Product */}

        {/* FeedBack Section */}
        <Stack sx={{ height: "30rem", width: "75%" }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Feedback" />
            <Tab label="Reviews" />
          </Tabs>
          <HorizontalLine marginTop={"0rem"} w={"70rem"} />
          {selectedTab === 0 && FeedbackComponent}
          {selectedTab === 1 && ReviewsComponent}
        </Stack>
        {/* FeedBack Section */}

        {/* <HorizontalLine marginTop={"5rem"} w={"70rem"} /> */}

        {/* Footer Section */}
        <Box sx={{ marginTop: "10rem" }}>
          <Footer />
        </Box>
        {/* Footer Section */}
      </Box>
    </AppLayout>
  );
};

export default Product;
