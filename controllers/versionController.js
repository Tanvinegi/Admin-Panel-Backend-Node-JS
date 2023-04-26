const Joi = require("joi");
const Response = require("../config/response");
let commonHelper = require("../Helper/common");
let config = require("../config/env")();
let message = require("../config/messages");
const Services = require("../services");



module.exports = {
  getAppDetails: async (payload) => {
    let criteria = {};
    let projection = [
      "id",
      "appname",
      "version",
      "platform",
      "minimumVersion",
      "latestVersion",
      "createdAt"

    ];
    let appDetails = await Services.VersionService.getAppDetails(
      criteria,
      projection,  );
   
    return appDetails;
  },

  addAppDetails: async (payloadData) => {
    try {
      const schema = Joi.object({
        appname: Joi.string().min(3).max(30).required(),
        version: Joi.number().precision(2).required(),
        platform: Joi.string().valid("Android", "IOS"),
      });

      let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
      const { appname, version, platform } = payload;
      if (!payload) {
        throw Response.error_msg.InvalidID;  
      } else {
        let criteria = {
          appname: appname,
        };
        let checkversiondata = await Services.VersionService.checkVersion(
          criteria
        );
        if (checkversiondata == null) {
          dataToSave = {
            appname: appname,
            version: version,
            platform: platform,
            minimumVersion: version,
            latestVersion: version,
          };
          appdata = await Services.VersionService.addAppDetails(dataToSave);
          return appdata;
        } else if (checkversiondata.appname === appname && checkversiondata.platform === platform && checkversiondata.version === version) {
        throw Response.error_msg.appDataExist;
          
        } else if (
          checkversiondata.appname === appname &&
          checkversiondata.platform === platform
        ) {
          if (checkversiondata.version > version) { 
            throw Response.error_msg.greaterVersion;
          } else if (checkversiondata.version === version) {
            throw Response.error_msg.equalVersion;
          } else {
            dataToSave = {
              appname: appname,
              version: version,
              platform: platform,
              minimumVersion: checkversiondata.minimumVersion,
              latestVersion: version,
            };
            appdata = await Services.VersionService.addAppDetails(dataToSave);
            return appdata;
          }
        } else {
          dataToSave = {
            appname: appname,
            version: version,
            platform: platform,
            minimumVersion: checkversiondata.minimumVersion,
            latestVersion: version,
          };
          appdata = await Services.VersionService.addAppDetails(dataToSave);
          return appdata;
        }
      }
    } catch (err) {
      throw Response.error_msg.implementationError;
    }
  },

  getPlatform: async (data) => {
    try{
    let criteria = { platform: data.platform };
    let projection = ["id", "appname", "platform"];
    let PlattformData = await Services.VersionService.getPlatform(
      criteria,
      projection
    );
    return PlattformData;
    }
    catch (err) {
      throw Response.error_msg.implementationError;
    }
  },

  getAppDetail: async (data) => {
    try{
    let criteria = { appname: data.appname };
    console.log(criteria);
    let projection = [
      "appname",
      "platform",
      "version",
      "minimumVersion",
      "latestVersion",
    ];
    let getversionData = await Services.VersionService.getAppDetail(
      criteria,
      projection
    );
    return getversionData;
    }catch(err) {
      throw Response.error_msg.implementationError;
    }
  },

  countAppVersion: async (data) => {
    try{
    let criteria = { appname: data.appname, platform: data.platform };
    let projection = ["appname", "platform", "version"];
    let countAppVersionDetails = await Services.VersionService.countAppVersion(
      criteria,
      projection
    );
    return countAppVersionDetails;
    }
    catch(err) {
      throw Response.error_msg.implementationError;
    }
  },

  appVersionDetails: async (data) => {
    try{
      let criteria = { appname: data.appname };
    console.log(criteria);
    let projection = ["appname", "platform", "version"];
    let versionData = await Services.VersionService.appVersionDetails(
      criteria,
      projection
    );
    return versionData;
    }
  
  catch(err) {
    throw Response.error_msg.implementationError;
  }
  },

  deleteAppVersion: async (data) => {
    try
    {
      let criteria = {
      id: data.id,
    };
    console.log(criteria);
    objectToSave = {
      isdeleted: true,
    };
    let updateWith = await Services.VersionService.updateIsDeleted(
      criteria,
      objectToSave
    );
    console.log(updateWith);
    let DeletedData = await Services.VersionService.deleteAppVersion(criteria);
    return DeletedData;
  }
  catch(err) {
    throw Response.error_msg.implementationError;
  }
  },

  editDetails: async (data) => {
   try{ let dataToUpdate = {};
    if (data && data.appname) dataToUpdate.appname = data.appname;
    if (data && data.platform) dataToUpdate.platform = data.platform;
    if (data && data.version) dataToUpdate.version = data.version;
    let criteria = {
      id: data.id,
    };
    let saveEditDeatils = await Services.VersionService.editDetails(
      criteria,
      dataToUpdate
    );
    return saveEditDeatils;
  }
  catch(err) {
    throw Response.error_msg.implementationError;
  }
  },
};