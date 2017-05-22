// response codes when not an actual result is to be returned
const Consts = {
  RequestTimedOut: 'request_timedout',
  RequestOutdated: 'request_outdated',
};

// map of the "sessions"  or "subject-matters" to a processing data, including processing promise
const processingMap = {};

// workflow is just a mock pretendending long-lasting processing

const makeCalculate = (operation) =>
  (input) =>
    new Promise((resolve) => setTimeout(resolve, 20 * input.length, `${operation}(${input})`));

const workflow = [
  makeCalculate('Alpha'),
  makeCalculate('Beta'),
  makeCalculate('Gamma'),
  makeCalculate('Delta')
  // ...
];


// our long lasting calculation
const calculateAlphaBeta = async (processing, input) => {
  let result = input;
  for (let step of workflow) {
    result = await step(result);
    // after each discrete step - check if this processing still makes sense
    // ie. no other request with other input?
    if (processing.input !== input) {
      return Consts.RequestOutdated;
    }
  }
  return result;
};
  
const calculatePerSessionInput = (sessionId, input) => {
  // establish a "session" unless it exists
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


const calculate = (sessionId, input, timeout) =>
  // guard the calculation with the timeout
  Promise.race([
    new Promise((resolve) => setTimeout(resolve, timeout, Consts.RequestTimedOut)),
    calculatePerSessionInput(sessionId, input)
  ]);

module.exports = {
  Consts,
  calculate,
};
