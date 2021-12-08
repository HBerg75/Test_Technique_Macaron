const baseURL = 'http://localhost:5000'

function fetchCreatorPost(url, bodyParams) {
  return new Promise((resolve, reject) => {

    url = baseURL+url+"?format=json"

    let formBody = []

    for (let property in bodyParams) {
      if (bodyParams.hasOwnProperty(property)) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(bodyParams[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
    }

    let formContent = formBody.join("&");

    let statusCode;
    let responseBody;
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formContent
    }).then(r => {
      statusCode = r.status;
      return r.json();
    }).then(d => {
      responseBody = d;
      const response = {
        statusCode: statusCode,
        responseBody: responseBody
      }
      resolve(response);
    }).catch(e => {
      console.log(e)
      reject();
    })
  })
}

function fetchCreatorGet(url) {
  return new Promise((resolve, reject) => {

    if (!url.includes("http")) {
      url = baseURL+url
    }



    let statusCode;
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(r => {
      statusCode = r.status;
      if (r.body !== undefined) {
        return r.json()
      }else {
        resolve(statusCode)
      }
    }).then(response => {
      const responseToSend = {
        statusCode: statusCode,
        responseBody: response
      }
      resolve(responseToSend);
    }).catch(e => {
      console.log(e)
      reject();
    })
  })
}

export {fetchCreatorPost, fetchCreatorGet};