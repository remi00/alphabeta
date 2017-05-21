const Consts = {
  RequestTimedOut: 'request_timedout',
  RequestOutdated: 'request_outdated',
};

const processingWorkflow = [
  makeCalculate('Alpha'),
  makeCalculate('Beta'),
  makeCalculate('Gamma'),
  makeCalculate('Delta'),
  // ...
]

const processingMap = {};

const makeCalculate = (operation) => (input) => {
  return new Promise(resolve => setTimeout(resolve, Math.random() * 1000, `${operation}(${input})`));
};

const calculateAlphaBeta = async (processing, input) => {
  const result = input;
  for (let processStep of processingWorkflow) {
    result = await processStep(result);
    if (processing.input !== input) {
      return Consts.RequestOutdated;
    }
  }
  return result;
};
  

const alphaBetaPerSessionInput = (sessionId, input) => {
  const processing = processingMap[sessionId];
  if (processing && processing.result && processing.input === input) {
    console.info(`Request for ${sessionId}: Existing promise for the same request is there`);
  } else {
    console.info(`Request for ${sessionId}: New input parameters, making new processing`);
    processing.input = input;
    processing.result = calculateAlphaBeta(processing, input);
  }
  return track.tweenframes;
};

app.get('/alphabeta/:session/:input', async () => {
  const alphabetaResult = 
    Promise.race(
      new Promise((resolve) => setTimeout(resolve, 9000, Consts.RequestTimedOut)),
      alphaBetaPerSessionInput(res.params.session, res.params.input)
    );
  if (alphabetaResult === Consts.RequestTimedOut) {
    res.status(202).end();
  } else if (alphabetaResult === Consts.RequestOutdated) {
    res.status(205).end();
  } else {
    res.json({ session: res.params.session, input: res.params.input, result: alphabetaResult });
  }
});
