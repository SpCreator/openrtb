const { parser, schemas } = require('openrtb-schema-validator');
const requestValidator = parser(schemas.request['2.5'], { removeAdditional: true });
const fs = require('fs'); 

function validate() {
  let jsonData = fs.readFileSync("./SspId_OpenRtbReq.json"); 
  let data = JSON.parse(jsonData); 
  const check = [];

  for (let i = 0; i < data.length; i++) {
    const { error } = requestValidator.validate(JSON.parse(data[i].OpenRtbReq));
    if (error) {
      const errorDetails = prepareErrorDetails(error);
      check.push({
        SSP_ID: data[i].SspId,
        ERROR: errorDetails
      });
    }
  }
  
  const result = Object.entries(
    check.reduce((prev, item) => {
      prev[item.SSP_ID] = prev[item.SSP_ID] || [];
      prev[item.SSP_ID].push(item.ERROR);
      return prev;
  }, {})).map(([ SSP_ID, ERROR ]) => ({ SSP_ID, ERROR, AMOUNT: ERROR.length }));
  
  console.debug("result", result);
}

function prepareErrorDetails(error) {
  const errorData = error._errors;
  const { keyword, message, params } = errorData[0];
  const field = errorData[0].dataPath.split(".")[2];
  return (!params.allowedValues) 
    ? `Error type: "${keyword}", message: field "${field}" ${message}`
    : `Error type: "${keyword}", message: field "${field}" ${message}: "${params.allowedValues.join(", ")}"`;
}

validate();






