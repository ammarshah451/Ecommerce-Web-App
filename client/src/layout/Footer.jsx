import {
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  X as XIcon,
} from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import {
  HorizontalLine,
  UnderLineBtn,
  VerticalLine,
} from "../shared/SharedComponents";
import { predefinedFooterDivsData } from "../constants/necessaryConstants";

const helperDivs = (heading, list, index) => (
  <div
    className="h-[4rem] w-[99%] flex flex-row justify-start items-center"
    key={index}
  >
    <span className="font-semibold">{heading}:</span>
    <div className="flex flex-row justify-start items-center gap-2 ml-4">
      {list.length > 0 ? (
        list.map((item, index) => (
          <div key={index}>
            <UnderLineBtn heading={item.name} redirect={item.url} />
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  </div>
);
const Footer = () => {
  return (
    <Stack direction={"column"} sx={{ width: "100%", height: "100%" }}>
      <HorizontalLine marginTop="0rem" w={"98%"} />
      <Stack
        sx={{ height: "80%", width: "100%", marginTop: "3rem" }}
        direction={"row"}
        gap={"1rem"}
        justifyContent={"space-between"}
      >
        <Box
          sx={{
            // border: "1px solid black",
            width: "20%",
            height: "100%",
            paddingLeft: "1rem",
            paddingTop: "2rem",
          }}
        >
          <Typography variant="h6" fontWeight={"bold"}>
            Contact Us
          </Typography>
          <Typography
            variant="inherit"
            sx={{ color: "gray", marginTop: "2rem" }}
          >
            Call us 24/7
          </Typography>
          <Typography
            variant="h6"
            fontWeight={"bold"}
            sx={{ color: "#fcb800", marginTop: "1rem" }}
          >
            888 110188 8277
          </Typography>
          <Typography
            variant="inherit"
            sx={{ color: "gray", marginTop: ".5rem" }}
          >
            502 New Design Str, Melbourne, Australia contact@martfury.co
          </Typography>
          <Stack
            direction={"row"}
            gap={".5rem"}
            alignItems={"center"}
            sx={{ marginTop: "1rem" }}
          >
            <FacebookIcon sx={{ color: "blue", cursor: "pointer" }} />
            <InstagramIcon sx={{ color: "red", cursor: "pointer" }} />
            <EmailIcon sx={{ color: "green", cursor: "pointer" }} />
            <XIcon sx={{ color: "black", cursor: "pointer" }} />
          </Stack>
        </Box>

        <Stack
          sx={{ width: "20%", height: "100%" }}
          direction={"column"}
          gap={".5rem"}
          alignItems={"center"}
        >
          <Typography
            fontWeight={"bold"}
            variant="h6"
            sx={{
              paddingTop: "2rem",
              paddingBottom: "1rem",
              marginLeft: "-1rem",
            }}
          >
            Quick Links
          </Typography>
          <Stack gap={".5rem"}>
            <UnderLineBtn heading={"Policy"} redirect={"/page/policy"} />
            <UnderLineBtn
              heading={"Terms & Condition"}
              redirect={"/page/termsandcondition"}
            />
            <UnderLineBtn heading={"Shipping"} redirect={"/page/shipping"} />
            <UnderLineBtn heading={"Return"} redirect={"/page/return"} />
            <UnderLineBtn heading={"FAQS"} redirect={"/page/faq"} />
          </Stack>
        </Stack>

        <Stack
          sx={{ width: "20%", height: "100%" }}
          direction={"column"}
          gap={".5rem"}
          alignItems={"center"}
        >
          <Typography
            fontWeight={"bold"}
            variant="h6"
            sx={{
              paddingTop: "2rem",
              paddingBottom: "1rem",
              marginLeft: "1rem",
            }}
          >
            Company
          </Typography>
          <Stack gap={".5rem"}>
            <UnderLineBtn heading={"About Us"} redirect={"/page/about"} />
            <UnderLineBtn heading={"Contact"} redirect={"/page/contact"} />
            <UnderLineBtn heading={"Career"} redirect={"/page/career"} />
          </Stack>
        </Stack>

        <Stack
          sx={{ width: "20%", height: "100%" }}
          direction={"column"}
          gap={".5rem"}
          alignItems={"center"}
        >
          <Typography
            fontWeight={"bold"}
            variant="h6"
            sx={{
              paddingTop: "2rem",
              paddingBottom: "1rem",
            }}
          >
            Buisness
          </Typography>
          <Stack gap={".5rem"}>
            <UnderLineBtn heading={"Our Press"} redirect={"/page/press"} />
            <UnderLineBtn heading={"My Account"} redirect={"/account"} />
            <UnderLineBtn heading={"Shop"} redirect={"/shop"} />
          </Stack>
        </Stack>
      </Stack>
      <HorizontalLine marginTop="4rem" w={"98%"} />
      <Stack
        sx={{ height: "80%", width: "100%", marginTop: "3rem" }}
        direction={"column"}
        justifyContent={"space-start"}
      >
        {predefinedFooterDivsData?.map((item, index) =>
          helperDivs(item.name, item.details, index)
        )}
      </Stack>
      <HorizontalLine marginTop="4rem" w={"98%"} />

      <Stack
        sx={{ height: "20%", width: "100%" }}
        direction={"column"}
        flexWrap={"wrap"}
        marginLeft={".6rem"}
      >
        <Box
          sx={{
            height: "100%",
            width: "30%",
            textAlign: "left",
            paddingTop: "4rem",
          }}
        >
          <Typography sx={{ color: "gray" }}>
            © 2024 Martfury. All Rights Reserved
          </Typography>
        </Box>
        <Stack
          sx={{
            height: "100%",
            width: "30%",
            marginLeft: "32.5rem",
            paddingTop: "4rem",
          }}
        >
          <Typography variant="inherit" sx={{ color: "black" }}>
            We Using Safe Payment For:
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Footer;
