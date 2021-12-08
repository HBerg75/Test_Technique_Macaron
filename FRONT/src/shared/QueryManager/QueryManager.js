import {fetchCreatorGet, fetchCreatorPost} from "./fetchCreator";

const getArrondissement = (arrondissement) =>  {
  return new Promise((resolve, reject) =>  {
    const bodyParam = {
      code: arrondissement
    }
    fetchCreatorPost("/arrondissement/", bodyParam)
      .then(res => {
        if (res.statusCode !== 200) return;
        resolve({success: true, data: res.responseBody})
      })
      .catch(err => {
        reject({success: false, err: err})
      })
  })
}

const getAllArrondissement = () =>  {
  return new Promise((resolve, reject) =>  {
    fetchCreatorGet("/arrondissements/")
      .then(res => {
        if (res.statusCode !== 200) return;
        resolve({success: true, data: res.responseBody})
      })
      .catch(err => {
        reject({success: false, err: err})
      })
  })
}

const getLieuxTournage = (arrondissement) =>  {
  return new Promise((resolve, reject) =>  {
    const bodyParam = {
      code: arrondissement
    }
    fetchCreatorPost("/lieuxTournage/", bodyParam)
      .then(res => {
        if (res.statusCode !== 200) return;
        resolve({success: true, data: res.responseBody})
      })
      .catch(err => {
        reject({success: false, err: err})
      })
  })
}

const getAllLieuxTournage = () =>  {
  return new Promise((resolve, reject) =>  {
    fetchCreatorGet("/lieuxTournages/")
      .then(res => {
        if (res.statusCode !== 200) return;
        resolve({success: true, data: res.responseBody})
      })
      .catch(err => {
        reject({success: false, err: err})
      })
  })
}

export {getArrondissement, getAllArrondissement, getAllLieuxTournage, getLieuxTournage}

