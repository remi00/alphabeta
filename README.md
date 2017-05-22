# AlphaBeta Demo

This is just a showcase on how to deal with request that require long-lasting processing on backend side.

Assumptions, ie. when this pattern can be useful:

1. **HTTP is mandatory.** In case of websockets, some of the handling here could be reused, but in general the flow could be different.
1. **Same input parameters mean same result**. Input parameters could be compound, but the result depends solely on them.
1. **Session mechanism is possible**. So even for the same input parameters, sessions can be managed separately (may have different context/preconditions etc.).

## Endpoint provided by the service

```http
GET /alphabeta/{sessionId}?input={inputString}
```

Both parameters are string-based in the example for simplicity but could be any other sort of data.

## The solution

Pattern used here is based on HTTP and JS promises managed in an elegant way.

  * The service stores sessions with its current input request parameters and promise to the result.
  * While processing a request for particular session S, there are can happen several situations that will be handled:
    1. Request will be processed within the time T - HTTP 200 with a result
    1. Request will not be processed within time T (exceeding the timeout) - HTTP 202 - Request accepted but not processed. In such case, if the same request will be sent by the client, the same promise will handle the response. Again, either 202 or 200 is possible.
    1. During processing the request, another request for the same session may come. Once that is detected (between the "steps" of processing), HTTP 205 is sent for "old" request, with a termination of further processing. CPU is therefore freed to handle new request.

Thanks to promises and asynchornous nature of JS runtime:
  * Sequence of events (incoming requests process order etc.) can be assumed.
  * Handling the timeout is plain simple (Promise.race with actual processing).
  * Although relatively fine-grain http-based solution is defined, the code is plain simple in the construction and analysis.

## Installation 

**Please use recent nodejs version (v7.8.0 or newer), as the sourcecode uses async/await.**

```bash
npm install # install dependencies (express actually)

node app.js # run
```
