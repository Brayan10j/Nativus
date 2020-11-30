const express = require('express');
const router = express.Router();

router.get('/brain', async (req, res) => {
  res.json({ responsive: "GET"});
});

router.post('/brain', async (req, res) => {
  try {
    const data = {
			data: req.body.data,
			date: req.body.fecha,
			timeframe: req.body.timeframe,
			price: req.body.precio
		};
    const signal = new Signal(data);
    await signal.save();

		return res.status(200).send("Dark Alex Deep scanning saved successfully");

	} catch (error) {
	  	return res.status(404).send({ message: "Error saving deep scanning", error });
  }

});

module.exports = router;
