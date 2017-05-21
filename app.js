const express = require('express');
const alphabeta = require('./alphabeta');

const app = express();

app.get('/alphabeta/:session/:input', async (req, res) => {
  try {
    const alphabetaResult = await Promise.race([
      new Promise((resolve) => setTimeout(resolve, 3000, alphabeta.Consts.RequestTimedOut)),
      alphabeta.calculate(req.params.session, req.params.input)
    ]);
    if (alphabetaResult === alphabeta.Consts.RequestTimedOut) {
      res.status(202).end();
    } else if (alphabetaResult === alphabeta.Consts.RequestOutdated) {
      res.status(205).end();
    } else {
      res.json({
        session: req.params.session,
        input: req.params.input,
        result: alphabetaResult
      });
    }
  } catch (err) {
    console.log(err);
  }
});

const port = 53434;
app.listen(port, () => {
  console.log(`Alphabeta calculator server running: http://localhost:${port}`);
});
