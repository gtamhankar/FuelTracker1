var db = require("../models");

module.exports = function(app) {
    

    app.get("/", function(req, res) {
        db.Reading.findAll({
           ////look to order in descend
           limit: 6,
           order: [['createdAt', 'DESC']]
        }).then(function(data) {
           console.log(data);
           var allReadings = {
               readings: data
           };
           res.render("index", allReadings);
            
        });
    });
    
    app.post("/api/readings", function(req, res) {
       db.Reading.create({
           place:  req.body.place,
           address: req.body.address,
           gallons: req.body.gallons,
           price: req.body.total,
           perGallon: req.body.perGallon
       }).then(function(result) {
           res.json(result);
       });
    });

    app.get("/database", function(req, res) {
        db.Reading.findAll({
           ////look to order in descend
        }).then(function(data) {
           console.log(data);
           res.json(data);
            
        });
    });

    app.delete("/api/delete/:id", function(req, res) {
        db.Reading.destroy({
          where: {
              id: req.params.id
          }
        }).then(function(dbReadings){
          res.json(dbReadings)
        });
    });

    app.get("/api/find/:id", function(req, res) {
        db.Reading.findOne({
        where: {
            id: req.params.id
        }
      }).then(function(dbReadings) {
        res.json(dbReadings);
      });
    });
    
    app.put("/api/update/:id", function(req, res) {
        db.Reading.update({
          place: req.body.place,
          address: req.body.address,
          gallons: req.body.gallons,
          price: req.body.total,
          perGallon: req.body.perGallon
        }, 
    { where: { id: req.params.id }
            
        }).then(function(result) {
            res.json(result);
        });
    });

    app.get("/api/lowest", function(req, res) {
        db.Reading.findAll({
           ////look to order in descend
           limit: 6,
           order: [['perGallon', 'ASC']]
        }).then(function(data) {
           console.log(data);
           res.render("lowest", { readings: data });
            
        });
    });

    app.get("/api/store", function(req, res) {
        db.Reading.findAll({
           ////look to order in descend
           limit: 6,
           order: [['place', 'ASC']]
        }).then(function(data) {
           console.log(data);
           res.render("store", { readings: data });
            
        });
    });

    app.post("/api/image", function(req, res) {
        res.json({
          id: 0,
          place: "Joe's Gas @ 123 Fake St",
          date: "2019-01-03",
          gallons: 9.142,
          price: 26.32,
          perGallon: 2.879
        });
      });
      
       app.get("/api/pricePerGallon", function(req, res) {
        db.Reading.findAll({           
           order: [['id', 'ASC']]
        }).then(function(dbReadings) {
        console.log (dbReadings);
		    res.json(dbReadings);		
      });
    });
/*
 app.get("/api/expensePerMonth", function(req, res) {       
        db.Reading.query("select price, concat(MONTH(createdAt) ,' - ' , YEAR(createdAt)) as vdate FROM readings WHERE createdAt is not null GROUP BY YEAR(createdAt) , MONTH(createdAt);" , { type: sequelize.QueryTypes.SELECT})
		.then(function(users) {
        console.log (users);
        res.json(users);		                
      });      
    }); 
    */

   app.get("/api/storeschart", function(req, res) {
    db.Reading.findAll({
		 attributes: [
    'place',
    [db.Reading.sequelize.literal('COUNT(place)'), 'countOfplace']
  ],
  group: 'place'			
		
    }).then(function(dbReadings) {
    console.log (dbReadings);
        res.json(dbReadings);		
  });
}); 

app.get("/api/expensePerMonth", function(req, res) {
    db.Reading.findAll({
        attributes: [ [
            db.Reading.sequelize.fn('sum',  db.Reading.sequelize.col('price')),
            db.Reading.sequelize.fn('MONTH', db.Reading.sequelize.col('createdAt')), 
            db.Reading.sequelize.fn('YEAR', db.Reading.sequelize.col('createdAt')) ] ] ,                    
        group:  [ db.Reading.sequelize.fn('YEAR', db.Reading.sequelize.col('createdAt')) , 
                  db.Reading.sequelize.fn('MONTH', db.Reading.sequelize.col('createdAt'))
                ]
    }).then(function(dbReadings) {
    console.log (dbReadings);
        res.json(dbReadings);		
  });
});


}