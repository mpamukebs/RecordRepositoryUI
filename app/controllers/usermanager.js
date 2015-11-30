'use strict';

/**
 * Module dependencies.
 */

var async = require('async')
  , request = require('request')
  , _ = require('lodash')
  , apiUrl = 'API_URL'



//Controller methods


exports.auth = function (req, res, next) {

  console.log("COMING TO AUTH");
  var email = req.body.email;
  var password = req.body.password;
  if (email=='mpamuk@ebsco.com' && password == 'admin'){
    app.locals.loggedin = true;
    var dbview = {
    dblist: []
    };

    dbview.dblist.push({
        "dbName" : "aftnm",
        "dbDisplayName" : "Art Full Text Biographies",
        "ddfUrl"  : "ddffile"
    });

   dbview.dblist.push({
        "dbName" : "a6h",
        "dbDisplayName" : "ATLASerials, Religion Collection",
        "ddfUrl"  : "ddffile"
    });

    dbview.dblist.push({
        "dbName" : "edsgml",
        "dbDisplayName" : "Making of Modern Law",
        "ddfUrl"  : "ddffile"
    });

    dbview.dblist.push({
        "dbName" : "fb3fdd77",
        "dbDisplayName" : "Thomson Reuters: ISI Web Of Knowledge--Social Sciences Citation Index (SOAP)",
        "ddfUrl"  : "ddffile"
    });

    dbview.dblist.push({
        "dbName" : "poh",
        "dbDisplayName" : "Political Science Complete",
        "ddfUrl"  : "ddffile"
    });

    console.log("DBVIEW RENDER");
    res.render('dbview', {
      'dbview': dbview
    });
  }
  else {

  }

};
