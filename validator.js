const { parser, schemas } = require('openrtb-schema-validator');
const requestValidator = parser(schemas.request['2.5'], { removeAdditional: true });
const fs = require('fs'); 

let jsonData = fs.readFileSync("./SspId_OpenRtbReq.json"); 
let data = JSON.parse(jsonData); 
const check = [];

for (let i = 0; i < data.length; i++) {
  const { error } = requestValidator.validate(JSON.parse(data[i].OpenRtbReq));
  if (error) {
    check.push({
      SSP_ID: data[i].SspId,
      ERROR: { ...error }
    });
  }
}

const result = Object.entries(
  check.reduce((prev, item) => {
    prev[item.SSP_ID] = prev[item.SSP_ID] || [];
    prev[item.SSP_ID].push(item.ERROR);
    return prev;
}, {})).map(([ SSP_ID, ERROR ]) => ({ SSP_ID, ERROR, AMOUNT: ERROR.length }));

console.log("result", result); // Showing all error
// console.log("result", result[0].ERROR[0]); // Showing one error
