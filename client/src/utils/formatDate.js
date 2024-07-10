import moment from "moment";

const formatDate = (dateString) => {
  return moment(dateString).format("YYYY-MM-DD");
};

export { formatDate };
