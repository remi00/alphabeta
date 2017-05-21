
const Consts = {
  RequestTimedOut: 'request_timedout',
  RequestOutdated: 'request_outdated',
};

const processingMap = {};

const makeCalculate = (operation) =>
  (input) =>
    new Promise((resolve) => setTimeout(resolve, 20 * input.length, `${operation}(${input})`));

const workflow = [
  makeCalculate('Alpha'),
  makeCalculate('Beta'),
  makeCalculate('Gamma'),
  makeCalculate('Delta')
  // ...
]


const calculateAlphaBeta = async (processing, input) => {
  let result = input;
  for (let step of workflow) {
    result = await step(result);
    if (processing.input !== input) {
      return Consts.RequestOutdated;
    }
  }
  return result;
};
  
const calculatePerSessionInput = (sessionId, input) => {
  // establish a session if not existing yet
  if (!processingMap[sessionId]) {
    processingMap[sessionId] = { input };
  }

  const processing = processingMap[sessionId];

  // verify if matching set of request processing already exists
  if (processing.result && processing.input === input) {
    console.info(`[${sessionId}]: Existing promise for the same request is there`);
  } else {
    console.info(`[${sessionId}]: New input parameters, making new processing`);
    processing.input = input;
    processing.result = calculateAlphaBeta(processing, input);
  }
  return processing.result;
};


const calculate = (sessionId, input, delay) =>
  Promise.race([
    new Promise((resolve) => setTimeout(resolve, 3000, Consts.RequestTimedOut)),
    calculatePerSessionInput(sessionId, input)
  ]);

module.exports = {
  Consts,
  calculate,
};
