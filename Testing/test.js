const ed = {};

fetch(
  "https://nij8z6ztle.execute-api.ap-south-1.amazonaws.com/Post_Initial_test"
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data.tasks);
  });
