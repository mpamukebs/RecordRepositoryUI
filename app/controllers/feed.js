'use strict';

/**
 * Module dependencies.
 */

var async = require('async')
  , request = require('request')
  , _ = require('lodash')
  , apiUrl = 'API_URL'



//Controller methods


exports.userInfo = function (req, res, next) {

  request(userInfoUrl + req.session.fbToken, function(err, resp, body) {
    body = JSON.parse(body);
    res.send(body);
  });

};

exports.logout = function (req,res,next){
  console.log("LOGOUT");
  req.session.fbToken = undefined;
  app.locals.loggedin = false;
  res.redirect("/signin.html");
}

exports.addFriends = function (req,res,next){
  console.log("ADD FRIENDS");
  var userId = req.body.userId;
  console.log("userid" + userId);
  console.log("req params " + JSON.stringify(req.body));
  request({
    url: addFriendsUrl, //URL to hit
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify(req.body),
    method: 'POST'
  }, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        res.redirect("/addWhitelisted?userId=" + userId);
    }
  });
}


exports.saveShareMode = function (req,res,next){
  console.log("SAVE SHARE MODE" + JSON.stringify(req.body));
  request({
    url: saveShareModeUrl, //URL to hit
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify(req.body),
    method: 'POST'
  }, function(error, response, body){
    if(error || response.statusCode != 200) {
        console.log(error);
    } else {
        console.log("userid" + req.body.userId);
        console.log("req params " + JSON.stringify(req.body));
        var onboard = {"shareMode":true};
        onboard.payload = {};
        onboard.payload.results = JSON.parse(decodeURIComponent(req.body.friendsStr));
        onboard.payload.user_id = req.body.userId;
        console.log("FRIENDS");
        console.log(JSON.stringify(req.body.friends));
        res.render("onboard.jade", {
          'onboard': onboard
        });
    }
  });

}

exports.saveOnboarded = function (req,res,next){
  console.log("save onboarded" + req.body.userId);
  request({
    url: saveOnboardedUrl, //URL to hit
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify(req.body),
    method: 'POST'
  }, function(error, response, body){
    console.log(response);
    if(error || response.statusCode != 200) {
        console.log(error);
    } else {
        res.redirect("/");
    }
  });
}

exports.addWhitelisted = function (req,res,next){
  console.log("whitelist domains");
  request(whitelistedHostsUrl + "?userId=" + req.query.userId , function(err, resp, body) {
    console.log('\n' + 'fetching whitelist domains... ' + whitelistedHostsUrl + "?userId=" + req.query.userId + '\n');
    if (!err && resp.statusCode == 200) {
        body = JSON.parse(body);
        res.render('whitelistedhosts', {
          'whitelistedhosts': body
        });
    } else if (resp.statusCode != 200) {
        console.log('\n'+'ERROR fetching user info...'+'\n');
    }
  });
}


exports.deleteFeedItem = function (req, res, next) {

  var feedItemId = req.body.feedItemId;
  console.log("feed item id" + JSON.stringify(req.body));
  request({
    url: deleteFeedItemUrl, //URL to hit
    qs: {feedItemId: feedItemId}, //Query string data
    method: 'DELETE'
  }, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        res.redirect(req.get('referer'));
    }
  });
};

exports.newUser = function (req,res,next){
  console.log("NEW USER");
  var token = req.session.fbToken;
  request(friendUrl +  "?accessToken=" + token , function(err, resp, body) {
    console.log('\n' + 'fetching user info... ' + friendUrl +  "?accessToken=" + token + '\n');
    if (!err && resp.statusCode == 200) {
        body = JSON.parse(body);
        res.render('fbfriends', {
          'fbfriends': body
        });
    } else if (resp.statusCode != 200) {
        console.log('\n'+'ERROR fetching user info...'+'\n');
        console.log("FRIENDS NOT FOUND");
    }
  });
}

exports.settings= function (req,res,next){
  var token = req.session.fbToken;
  var onboard = {"shareMode":false};

  request(friendUrl +  "?accessToken=" + token , function(err, resp, body) {
    console.log('\n' + 'fetching user info... ' + friendUrl +  "?accessToken=" + token + '\n');
    if (!err && resp.statusCode == 200) {
        body = JSON.parse(body);
        onboard.payload = body.payload;
        console.log("Onboard friends");
        console.log(JSON.stringify(onboard.payload.results));
        res.render("onboard.jade", {
          'onboard': onboard
        });
    } else if (resp.statusCode != 200) {
        console.log('\n'+'ERROR fetching user info...'+'\n');
        console.log("FRIENDS NOT FOUND");
    }
  });
}

exports.jsonFeeds = function (req, res, next) {
  app.locals.loggedin = true;
  fecthUser(req.session.fbToken, function(err, user) {
    if (err) {
      console.log('ERROR in getting user id...');
      throw err;
    } else {
      console.log("USER ONBOARDED " + (user.onboarded));
      if (!user.onboarded){
        var onboard = {"shareMode":false};
        var token = req.session.fbToken;
        request(friendUrl +  "?accessToken=" + token , function(err, resp, body) {
          console.log('\n' + 'fetching user info... ' + friendUrl +  "?accessToken=" + token + '\n');
          if (!err && resp.statusCode == 200) {
              body = JSON.parse(body);
              onboard.payload = body.payload;
              console.log("Onboard friends");
              console.log(JSON.stringify(onboard.payload.results));
              res.render("onboard.jade", {
                'onboard': onboard
              });
          } else if (resp.statusCode != 200) {
              console.log('\n'+'ERROR fetching user info...'+'\n');
              console.log("FRIENDS NOT FOUND");
          }
        });
      }
      else {
      async.series({
        friendFeed: function(callback) {
          console.log('\n' + 'fetching main feed... ' + userFeedUrl + user.user_id + '\n');
          request(userFeedUrl + user.user_id, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
              body = JSON.parse(body);
              callback(null, body);
            } else if (resp.statusCode != 200) {
              console.log('ERROR fetching friend feed...');
              callback(resp.error, null);
            }
          });
        },
        personalFeed: function(callback) {
          console.log('\n' + 'fetching personal feed... ' + personalFeedUrl + user.user_id + '\n');
          request(personalFeedUrl + user.user_id, function (err, resp, body) {
            if (!err && resp.statusCode == 200) {
              body = JSON.parse(body);
              callback(null, body);
            } else if (resp.statusCode != 200) {
              console.log('ERROR fetching personal feed...');
              callback(resp.error, null);
            }
          });
        }
      },
      function(err, results) {
        res.render('feed', {
          'feed': results.friendFeed,
          'myFeed': results.personalFeed,
        });
      });

    }
    }

  });

};


var fecthUser = function userId(token, callback) {
  request(userInfoUrl + token, function(err, resp, body) {
    console.log('\n' + 'fetching user info... ' + userInfoUrl + token + '\n');
    if (!err && resp.statusCode == 200) {
        body = JSON.parse(body);
        callback(null, body.payload.user);
    } else if (resp.statusCode != 200) {
        console.log('\n'+'ERROR fetching user info...'+'\n');
        callback(resp.error, null);
    }
  });
};
