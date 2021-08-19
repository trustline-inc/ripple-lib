import _ from 'lodash'
import assert from 'assert-diff'
import setupAPI from './setup-api'
import responses from './fixtures/responses'
import ledgerClosed from './fixtures/rippled/ledger-close.json'
import {RippleAPI} from 'ripple-api'
import {ignoreWebSocketDisconnect} from './utils'
const schemaValidator = RippleAPI._PRIVATE.schemaValidator

const TIMEOUT = 20000

function checkResult(expected, schemaName, response) {
  if (expected.txJSON) {
    assert(response.txJSON)
    assert.deepEqual(JSON.parse(response.txJSON), JSON.parse(expected.txJSON))
  }
  assert.deepEqual(_.omit(response, 'txJSON'), _.omit(expected, 'txJSON'))
  if (schemaName) {
    schemaValidator.schemaValidate(schemaName, response)
  }
  return response
}

describe('RippleAPIBroadcast', function () {
  this.timeout(TIMEOUT)
  beforeEach(setupAPI.setupBroadcast)
  afterEach(setupAPI.teardown)

  it('base', function () {
    const expected = {request_server_info: 1}
    this.mocks.forEach((mock) => mock.expect(Object.assign({}, expected)))
    assert(this.api.isConnected())
    return this.api
      .getServerInfo()
      .then(_.partial(checkResult, responses.getServerInfo, 'getServerInfo'))
  })

  it('ledger', function (done) {
    let gotLedger = 0
    this.api.on('ledger', () => {
      gotLedger++
    })
    const ledgerNext = Object.assign({}, ledgerClosed)
    ledgerNext.ledger_index++

    this.api._apis.forEach((api) =>
      api.connection
        .request({
          command: 'echo',
          data: ledgerNext
        })
        .catch(ignoreWebSocketDisconnect)
    )

    setTimeout(() => {
      assert.strictEqual(gotLedger, 1)
      done()
    }, 1250)
  })

  it('error propagation', function (done) {
    this.api.once('error', (type, info) => {
      assert.strictEqual(type, 'type')
      assert.strictEqual(info, 'info')
      done()
    })
    this.api._apis[1].connection
      .request({
        command: 'echo',
        data: {error: 'type', error_message: 'info'}
      })
      .catch(ignoreWebSocketDisconnect)
  })
})
