
//Todo: use routes instead of having them on index.js

router.route('/mortgage/calculate')
    .post(function (req, res, next){
        //post_calculateMortgage(req,res);
        console.log(req.body);
        res.json(req.body).status(200).send();
    })

