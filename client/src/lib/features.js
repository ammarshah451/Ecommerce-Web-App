import moment from "moment";

const transformImage = (url = "", width = 100) => url;

const getLast7DaysLabel = () => {
  const currentDate = moment();

  const last7Days = [];
  for (let i = -1; i < 7; i++) {
    const dayName = currentDate.clone().subtract(i, "days").format("dddd");
    last7Days.push(dayName);
  }

  return last7Days;
};

const getLast4DaysLabel = () => {
  const currentDate = moment();
  const last4Days = [];
  for (let i = 0; i < 5; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");

    last4Days.push(dayName);
  }

  return last4Days;
};

const getCartObj = (product, quantity) => {
  const cartObj = {
    details: `${product.id},${product.name},${product.imgUrl}`,
    price: parseFloat(product.price),
    quantity: quantity,
  };

  return cartObj;
};

const getTodaysDateFormatted = () => moment().format("YYYY-MM-DD");

export {
  getLast4DaysLabel,
  getLast7DaysLabel,
  transformImage,
  getCartObj,
  getTodaysDateFormatted,
};
