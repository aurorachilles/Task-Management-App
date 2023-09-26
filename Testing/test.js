// const ed = {};

// fetch(
//   "https://nij8z6ztle.execute-api.ap-south-1.amazonaws.com/Post_Initial_test"
// )
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data.tasks);
//   });

const id = "123145";
const input = {
  url: "",
  title: "main",
  description: "evce",
  type: "aaa",
};

const ss = { ...input, id };

const test = (obj) => {
  console.log(obj);
};

test(ss);
