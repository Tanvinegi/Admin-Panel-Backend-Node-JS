"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");

exports.getAppDetails = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Models.Version
      .findAndCountAll({
        where: criteria,
        attributes: projection,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
      console.log("getAll err ==>>  ", err)
      reject(Response.error_msg.implementationError)
    });
  });
};

exports.appVersionDetails=(criteria, projection)=>{
  return new Promise ((resolve, reject) => {
    Models.Version
    .findAll({
    where: criteria,
    attributes: projection,
  })
  .then((res) => {
    resolve(res);
  })
  .catch((err) =>{
    console.log("getAll err ==>>  ", err)
    reject(Response.error_msg.implementationError)
  });
  });
};

exports.addAppDetails = (objToSave) => {
  return new Promise((resolve, reject) => {
    Models.Version
      .create(objToSave)
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("ADD Deatils ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};

exports.checkVersion = (criteria) => {
  return new Promise((resolve, reject) => {
    Models.Version
      .findOne({
        where: criteria,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("getAll err ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};

exports.countAppVersion = (criteria) => {
  return new Promise((resolve, reject) => {
   Models.Version.findAndCountAll({  where:criteria })
      .then((res) => {
      
        resolve(res);
      })
      .catch((err) =>{
        console.log("Count Error  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};

exports.updateIsDeleted = (criteria,objToSave) => {
  return new Promise((resolve, reject) => {
    Models.Version.update(objToSave,{
     where :criteria
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("update err ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};

exports.getPlatform = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Models.Version
      .findAll({
        where: criteria,
        attributes: projection,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("GetPlatform err ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};

exports.getAppDetail = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Models.Version
      .findAll({
        where: criteria,
        attributes: projection,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("getAll err ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};

exports.deleteAppVersion = (criteria) => {
  return new Promise((resolve, reject) => {
    Models.Version.destroy({ where: criteria })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("getAll err ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};

exports.editDetails = (criteria, objToUpdate) => {
  return new Promise((resolve, reject) => {
    Models.Version.update(objToUpdate, { where: criteria })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("getAll err ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};