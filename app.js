const express = require('express');
const static = require('serve-static')

const alphabeta = require('./alphabeta');
const app = express();

// serve the demo client app
app.use(static('assets', {'index': 'index.html'}));


// one and only endpoint to serve "long-lasting" processing capability
app.get('/alphabeta/:session', async (req, res) => {
  try {
    const alphabetaResult = 
      await alphabeta.calculate(req.params.session, req.query.input, 3000);

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
  console.log(`Alphabeta calculator server running.\r\nYou can open http://localhost:${port} to play around with the demo.`);
});
