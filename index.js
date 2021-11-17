const fs = require("fs");
const axios = require("axios").default;

let url = "https://xivapi.com/search?string=&indexes=action&columns=ID,Name,Icon,IsPlayerAction,IconHD&filters=IsPlayerAction=1&";

async function fetchPages() {
  let response = await axios.get(url);
  let data = response.data;
  return (pageCount = data.Pagination.PageTotal);
}

let fetchData = async function (page) {
  let response = await axios.get(url + `page=${page}`);
  let data = response.data;
  return data;
};

fetchPages().then(async (pageCount) => {
  let finalObj = {};
  let skillObject;
  for (let i = 1; i <= pageCount; i++) {
    await fetchData(i).then((data) => {
      console.log(`Working on page: ${i}`);
      for (let skill of data.Results) {
        skillObject = { icon: skill.Icon, iconhd: skill.IconHD, id: skill.ID };
        finalObj[skill.Name] = skillObject;
      }
    });
  }
  fs.writeFileSync(__dirname + "/blob.json", JSON.stringify(finalObj));
});
