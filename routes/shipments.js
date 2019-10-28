var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({
  type: 'application/**json'
});
let config = require('../config');
let ORDER_STATUS = require('../model/orderStatus');
let SHIPMENTS = require('../model/shipments');
var auth = require('../security/auth');

const store = require('data-store')({ path: process.cwd() + '/SaloodoStore.json' });
 
router.get('/getAllBikers',jsonParser,auth.authorizeManager,(req, res, next) => {
  var allObj = config.BIKERS; 
  return res.send(allObj);
});

router.get('/getAllShipments',jsonParser, auth.authorizeManager,   (req, res, next) => {
    var SHIPMENTS_STORE = store.get('SHIPMENTS');
    if(SHIPMENTS_STORE == undefined){
      store.set('SHIPMENTS', SHIPMENTS); 
      return res.send(SHIPMENTS);
    } else{
      return res.send(SHIPMENTS_STORE);
    }
});
router.post('/getBikerOrders',jsonParser, auth.authorizeBiker,   (req, res, next) => {
  var SHIPMENTS_STORE = store.get('SHIPMENTS');
  if(SHIPMENTS_STORE == undefined){
    store.set('SHIPMENTS', SHIPMENTS); 
    SHIPMENTS_STORE = SHIPMENTS;
  } 
  var BikersOrders = SHIPMENTS_STORE.filter(item => item.BIKERID == req.body.BikerId);
  BikersOrders = BikersOrders == undefined ? [] : BikersOrders;
  return res.send(BikersOrders);
});
router.post('/assignOrder',jsonParser, auth.authorizeManager,   (req, res, next) => {
  var SHIPMENTS = store.get('SHIPMENTS'); 
  var BikerId = req.body.BikerId;
  var ShipmentId = req.body.ShipmentId;
   
  SHIPMENTS=SHIPMENTS.map(item => {
    if(item.ID ==  ShipmentId) {
        item.STATUS = ORDER_STATUS.ASSIGNED; 
        item.BIKERID = BikerId;
        item.ASSIGN_DATE = new Date().toUTCString()
    } 
    return item;
    });
  store.set('SHIPMENTS', SHIPMENTS); 
  return res.send(SHIPMENTS);
});
router.post('/updateOrder',jsonParser, auth.authorizeBiker,   (req, res, next) => {
  var SHIPMENTS = store.get('SHIPMENTS'); 
   
  var ShipmentId = req.body.ShipmentId;
  var BikerId = req.body.BikerId;
  var Status = req.body.Status;
  var PickUpDate = req.body.PickUpDate;
  var DeliveredDate = req.body.DeliveredDate;
  SHIPMENTS=SHIPMENTS.map(item => {
    if(item.ID ==  ShipmentId) {
        item.STATUS = Status; 
        item.EXPECTED_DELIVER_DATE = DeliveredDate

        if(Status == ORDER_STATUS.PICKED_UP)
          item.PICKED_UP_DATE =  PickUpDate;
    } 
    return item;
    });

  store.set('SHIPMENTS', SHIPMENTS); 
  var BikersOrders = SHIPMENTS.filter(item => item.BIKERID == BikerId);
  BikersOrders = BikersOrders == undefined ? [] : BikersOrders;
  return res.send(BikersOrders); 
});
module.exports = router;