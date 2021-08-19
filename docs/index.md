<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# RippleAPI Reference

- [Introduction](#introduction)
  - [Boilerplate](#boilerplate)
  - [Offline functionality](#offline-functionality)
- [Basic Types](#basic-types)
  - [Address](#address)
  - [Account Sequence Number](#account-sequence-number)
  - [Currency](#currency)
  - [Value](#value)
  - [Amount](#amount)
- [Transaction Overview](#transaction-overview)
  - [Transaction Types](#transaction-types)
  - [Transaction Flow](#transaction-flow)
  - [Transaction Fees](#transaction-fees)
  - [Transaction Instructions](#transaction-instructions)
  - [Transaction ID](#transaction-id)
  - [Transaction Memos](#transaction-memos)
- [Transaction Specifications](#transaction-specifications)
  - [Account Delete](#account-delete)
  - [Check Cancel](#check-cancel)
  - [Check Cash](#check-cash)
  - [Check Create](#check-create)
  - [Deposit Preauth](#deposit-preauth)
  - [Escrow Cancellation](#escrow-cancellation)
  - [Escrow Creation](#escrow-creation)
  - [Escrow Execution](#escrow-execution)
  - [Order](#order)
  - [Order Cancellation](#order-cancellation)
  - [Payment](#payment)
  - [Payment Channel Claim](#payment-channel-claim)
  - [Payment Channel Create](#payment-channel-create)
  - [Payment Channel Fund](#payment-channel-fund)
  - [Settings](#settings)
  - [Ticket Create](#ticket-create)
  - [Trustline](#trustline)
- [rippled APIs](#rippled-apis)
  - [Listening to streams](#listening-to-streams)
  - [request](#request)
  - [hasNextPage](#hasnextpage)
  - [requestNextPage](#requestnextpage)
- [Static Methods](#static-methods)
  - [computeBinaryTransactionHash](#computebinarytransactionhash)
  - [classicAddressToXAddress](#classicaddresstoxaddress)
  - [xAddressToClassicAddress](#xaddresstoclassicaddress)
  - [renameCounterpartyToIssuer](#renamecounterpartytoissuer)
  - [formatBidsAndAsks](#formatbidsandasks)
- [API Methods](#api-methods)
  - [connect](#connect)
  - [disconnect](#disconnect)
  - [isConnected](#isconnected)
  - [getServerInfo](#getserverinfo)
  - [getFee](#getfee)
  - [getLedgerVersion](#getledgerversion)
  - [getTransaction](#gettransaction)
  - [getTransactions](#gettransactions)
  - [getTrustlines](#gettrustlines)
  - [getBalances](#getbalances)
  - [getBalanceSheet](#getbalancesheet)
  - [getPaths](#getpaths)
  - [getOrders](#getorders)
  - [getOrderbook](#getorderbook)
  - [getSettings](#getsettings)
  - [getAccountInfo](#getaccountinfo)
  - [getAccountObjects](#getaccountobjects)
  - [getPaymentChannel](#getpaymentchannel)
  - [getLedger](#getledger)
  - [parseAccountFlags](#parseaccountflags)
  - [prepareTransaction](#preparetransaction)
  - [preparePayment](#preparepayment)
  - [prepareTrustline](#preparetrustline)
  - [prepareOrder](#prepareorder)
  - [prepareOrderCancellation](#prepareordercancellation)
  - [prepareSettings](#preparesettings)
  - [prepareEscrowCreation](#prepareescrowcreation)
  - [prepareEscrowCancellation](#prepareescrowcancellation)
  - [prepareEscrowExecution](#prepareescrowexecution)
  - [preparePaymentChannelCreate](#preparepaymentchannelcreate)
  - [preparePaymentChannelClaim](#preparepaymentchannelclaim)
  - [preparePaymentChannelFund](#preparepaymentchannelfund)
  - [prepareCheckCreate](#preparecheckcreate)
  - [prepareCheckCancel](#preparecheckcancel)
  - [prepareCheckCash](#preparecheckcash)
  - [prepareTicketCreate](#prepareticketcreate)
  - [sign](#sign)
  - [combine](#combine)
  - [submit](#submit)
  - [generateXAddress](#generatexaddress)
  - [generateAddress](#generateaddress)
  - [isValidAddress](#isvalidaddress)
  - [isValidSecret](#isvalidsecret)
  - [deriveKeypair](#derivekeypair)
  - [deriveAddress](#deriveaddress)
  - [generateFaucetWallet](#generatefaucetwallet)
  - [signPaymentChannelClaim](#signpaymentchannelclaim)
  - [verifyPaymentChannelClaim](#verifypaymentchannelclaim)
  - [computeLedgerHash](#computeledgerhash)
  - [xrpToDrops](#xrptodrops)
  - [dropsToXrp](#dropstoxrp)
  - [iso8601ToRippleTime](#iso8601torippletime)
  - [rippleTimeToISO8601](#rippletimetoiso8601)
  - [txFlags](#txflags)
  - [accountSetFlags](#accountsetflags)
  - [schemaValidator](#schemavalidator)
  - [schemaValidate](#schemavalidate)
- [API Events](#api-events)
  - [ledger](#ledger)
  - [error](#error)
  - [connected](#connected)
  - [disconnected](#disconnected)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Introduction

RippleAPI (ripple-lib) is the official client library to the XRP Ledger. Currently, RippleAPI is only available in JavaScript/TypeScript.

Using RippleAPI, you can:

* [Query transactions from the XRP Ledger history](#gettransaction)
* [Sign](#sign) transactions securely without connecting to any server
* [Submit](#submit) transactions to the XRP Ledger, including [Payments](#payment), [Orders](#order), [Settings changes](#settings), and [other types](#transaction-types)
* [Generate a new XRP Ledger Address](#generateaddress)
* ... and [much more](#api-methods).

This page contains documentation for ripple-lib. To use ripple-lib with npm/yarn, begin with the [Getting Started](https://github.com/ripple/ripple-lib#getting-started) steps.

**What is ripple-lib used for?** Here's a [list of applications that use `ripple-lib`](https://github.com/ripple/ripple-lib/blob/develop/APPLICATIONS.md). Open a PR to add your app or project to the list!

## Boilerplate

Use the following [boilerplate code](https://en.wikipedia.org/wiki/Boilerplate_code) to wrap your custom code using RippleAPI.

```javascript
const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://xrplcluster.com' // Public cluster
});
api.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage);
});
api.on('connected', () => {
  console.log('connected');
});
api.on('disconnected', (code) => {
  // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
  // the code is 1000 for a normal closure
  console.log('disconnected, code:', code);
});
api.connect().then(() => {
  /* insert code here */
}).then(() => {
  return api.disconnect();
}).catch(console.error);
```

[Node.js v14](https://nodejs.org/) is recommended. Other versions may work but are not frequently tested.

<aside class="notice">
All the code snippets in this documentation assume that you have surrounded them with this boilerplate.
</aside>

<aside class="notice">
If you omit the "catch" section, errors may not be visible.
</aside>

<aside class="notice">
The API emits an "error" event whenever an error occurs that cannot be associated with a specific request. If there is no listener registered for this event, the API throws an exception whenever the event is emitted.
</aside>

### Parameters

The RippleAPI constructor optionally takes one argument, an object with the following options:

Name | Type | Description
---- | ---- | -----------
authorization | string | *Optional* Username and password for HTTP basic authentication to the rippled server in the format **username:password**.
certificate | string | *Optional* A string containing the certificate key of the client in PEM format. (Can be an array of certificates).
connectionTimeout | integer | *Optional* Connection timeout, in milliseconds, before considering connect() to have failed.
feeCushion | number | *Optional* Factor to multiply estimated fee by to provide a cushion in case the required fee rises during submission of a transaction. Defaults to `1.2`.
key | string | *Optional* A string containing the private key of the client in PEM format. (Can be an array of keys).
maxFeeXRP | string | *Optional* Maximum fee to use with transactions, in XRP. Must be a string-encoded number. Defaults to `'2'`.
passphrase | string | *Optional* The passphrase for the private key of the client.
proxy | uri string | *Optional* URI for HTTP/HTTPS proxy to use to connect to the rippled server.
proxyAuthorization | string | *Optional* Username and password for HTTP basic authentication to the proxy in the format **username:password**.
server | uri string | *Optional* URI for rippled websocket port to connect to. Must start with `wss://`, `ws://`, `wss+unix://`, or `ws+unix://`.
timeout | integer | *Optional* Request timeout in milliseconds before considering a request to have failed. See also: connectionTimeout.
trace | boolean | *Optional* If true, log rippled requests and responses to stdout.
trustedCertificates | array\<string\> | *Optional* Array of PEM-formatted SSL certificates to trust when connecting to a proxy. This is useful if you want to use a self-signed certificate on the proxy server. Note: Each element must contain a single certificate; concatenated certificates are not valid.

If you omit the `server` parameter, RippleAPI operates [offline](#offline-functionality).


### Installation ###

1. Install [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com/en/docs/install). Most Linux distros have a package for Node.js; check that it's the version you want.
2. Use yarn to install RippleAPI:
      `yarn add ripple-lib`

After you have installed ripple-lib, you can create scripts using the [boilerplate](#boilerplate) and run them using the Node.js executable, typically named `node`:

      `node script.js`

## Offline functionality

RippleAPI can also function without internet connectivity, so you can generate secrets and sign transactions from a secure, isolated machine.

To instantiate RippleAPI in offline mode, use the following code:

```javascript
const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI();
/* insert code here */
```

Methods that depend on the state of the XRP Ledger are unavailable in offline mode. To prepare transactions offline, you **must** specify  the `fee`, `sequence`, and `maxLedgerVersion` parameters in the [transaction instructions](#transaction-instructions). You can use the following methods while offline:

* [preparePayment](#preparepayment)
* [prepareTrustline](#preparetrustline)
* [prepareOrder](#prepareorder)
* [prepareOrderCancellation](#prepareordercancellation)
* [prepareSettings](#preparesettings)
* [prepareEscrowCreation](#prepareescrowcreation)
* [prepareEscrowCancellation](#prepareescrowcancellation)
* [prepareEscrowExecution](#prepareescrowexecution)
* [sign](#sign)
* [generateAddress](#generateaddress)
* [generateXAddress](#generatexaddress)
* [computeLedgerHash](#computeledgerhash)

# Basic Types

## Address

```json
"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
```

```json
"X7AcgcsBL6XDcUb289X4mJ8djcdyKaB5hJDWMArnXr61cqZ"
```

An *address* refers to a specific XRP Ledger account. It is a base-58 encoding of a hash of the account's public key. There are two kinds of addresses in common use:

### Classic Address

A *classic address* encodes a hash of the account's public key and a checksum. It has no other data. This kind of address always starts with the lowercase letter `r`.

### X-address

An *X-address* encodes a hash of the account's public key, a tag, and a checksum. This kind of address starts with the uppercase letter `X` if it is intended for use on the production XRP Ledger (mainnet). It starts with the uppercase letter `T` if it is intended for use on a test network such as Testnet or Devnet.

## Account Sequence Number

Every XRP Ledger account has a *sequence number* that is used to keep transactions in order. Every transaction must have a sequence or a ticketSequence number. A transaction can only be executed if it has the next sequence number in order, of the account sending it, or uses a previously generated ticketSequence number. This prevents one transaction from executing twice and transactions executing out of order. The sequence number starts at `1` and increments for each transaction that the account makes.

## Currency

Currencies are represented as either 3-character currency codes or 40-character uppercase hexadecimal strings. We recommend using uppercase [ISO 4217 Currency Codes](http://www.xe.com/iso4217.php) only. The string "XRP" is disallowed on trustlines because it is reserved for the XRP Ledger's native currency. The following characters are permitted: all uppercase and lowercase letters, digits, as well as the symbols `?`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `<`, `>`, `(`, `)`, `{`, `}`, `[`, `]`, and `|`.

## Value
A *value* is a quantity of a currency represented as a decimal string. Be careful: JavaScript's native number format does not have sufficient precision to represent all values. XRP has different precision from other currencies.

**XRP** has 6 significant digits past the decimal point. In other words, XRP cannot be divided into positive values smaller than `0.000001` (1e-6). This smallest unit is called a "drop". XRP has a maximum value of `100000000000` (1e11). Some RippleAPI methods accept XRP to maintain compatibility with older versions of the API. For consistency with the `rippled` APIs, we recommend formally specifying XRP values in *drops* in all API requests, and converting them to XRP for display. This is like Bitcoin's *satoshis* and Ethereum's *wei*. 1 XRP = 1,000,000 drops.

**Non-XRP values** have 16 decimal digits of precision, with a maximum value of `9999999999999999e80`. The smallest positive non-XRP value is `1e-81`.

## Amount

Example 100.00 USD amount:

```json
{
  "currency": "USD",
  "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM",
  "value": "100"
}
```

Example 3.0 XRP amount, in drops:
```json
{
  "currency": "drops",
  "value": "3000000"
}
```
(Requires `ripple-lib` version 1.0.0 or higher.)

An *amount* is an object specifying a currency, a quantity of that currency, and the counterparty (issuer) on the trustline that holds the value. For XRP, there is no counterparty.

A *lax amount* allows the counterparty to be omitted for all currencies. If the counterparty is not specified in an amount within a transaction specification, then any counterparty may be used for that amount.

A *lax lax amount* allows either or both the counterparty and value to be omitted.

A *balance* is an amount than can have a negative value.

Name | Type | Description
---- | ---- | -----------
currency | [currency](#currency) | The three-character code or hexadecimal string used to denote currencies, or "drops" for the smallest unit of XRP.
counterparty | [address](#address) | *Optional* The XRP Ledger address of the account that owes or is owed the funds (omitted if `currency` is "XRP" or "drops")
value | [value](#value) | *Optional* The quantity of the currency, denoted as a string so that it does not lose precision

# Transaction Overview

## Transaction Types

A transaction type is specified by the strings in the first column in the table below.

Type | Description
---- | -----------
[payment](#payment) | A `payment` transaction represents a transfer of value from one account to another. Depending on the [path](https://xrpl.org/paths.html) taken, additional exchanges of value may occur atomically to enable the payment.
[order](#order) | An `order` transaction creates a limit order. It defines an intent to exchange currencies, and creates an order in the XRP Ledger's order book if not completely fulfilled when placed. Orders can be partially fulfilled.
[orderCancellation](#order-cancellation) | An `orderCancellation` transaction cancels an order in the XRP Ledger's order book.
[trustline](#trustline) | A `trustline` transaction creates or modifies a trust line between two accounts.
[settings](#settings) | A `settings` transaction modifies the settings of an account in the XRP Ledger.
[escrowCreation](#escrow-creation) | An `escrowCreation` transaction creates an escrow on the ledger, which locks XRP until a cryptographic condition is met or it expires. It is like an escrow service where the XRP Ledger acts as the escrow agent.
[escrowCancellation](#escrow-cancellation) | An `escrowCancellation` transaction unlocks the funds in an escrow and sends them back to the creator of the escrow, if the escrow has expired.
[escrowExecution](#escrow-execution) | An `escrowExecution` transaction unlocks the funds in an escrow and sends them to the destination of the escrow, if the conditions for the escrow are met.
[checkCreate](#check-create) | A `checkCreate` transaction creates a check on the ledger, which is a deferred payment that can be cashed by its intended destination.
[checkCancel](#check-cancel) | A `checkCancel` transaction cancels an unredeemed Check, removing it from the ledger without sending any money.
[checkCash](#check-cash) | A `checkCash` transaction redeems a Check to receive up to the amount authorized by the corresponding `checkCreate` transaction. Only the `destination` address of a Check can cash it.
[paymentChannelCreate](#payment-channel-create) | A `paymentChannelCreate` transaction opens a payment channel between two addresses with XRP set aside for asynchronous payments.
[paymentChannelFund](#payment-channel-fund) | A `paymentChannelFund` transaction adds XRP to a payment channel and optionally sets a new expiration for the channel.
[paymentChannelClaim](#payment-channel-claim) | A `paymentChannelClaim` transaction withdraws XRP from a channel and optionally requests to close it.
[ticketCreate](#ticket-create) | A successful `ticketCreate` transaction adds a Ticket in the directory of the owning account.

## Transaction Flow

Executing a transaction with `RippleAPI` requires the following four steps:

1. Prepare - Create an unsigned transaction based on a [specification](#transaction-specifications) and [instructions](#transaction-instructions). There is a method to prepare each type of transaction:
    * [preparePayment](#preparepayment)
    * [prepareTrustline](#preparetrustline)
    * [prepareOrder](#prepareorder)
    * [prepareOrderCancellation](#prepareordercancellation)
    * [prepareSettings](#preparesettings)
    * [prepareEscrowCreation](#prepareescrowcreation)
    * [prepareEscrowCancellation](#prepareescrowcancellation)
    * [prepareEscrowExecution](#prepareescrowexecution)
    * [prepareCheckCreate](#preparecheckcreate)
    * [prepareCheckCancel](#preparecheckcancel)
    * [prepareCheckCash](#preparecheckcash)
    * [prepareTicketCreate](#prepareticketcreate)
2. [Sign](#sign) - Cryptographically sign the transaction locally and save the [transaction ID](#transaction-id). Signing is how the owner of an account authorizes a transaction to take place. For multisignature transactions, the `signedTransaction` fields returned by `sign` must be collected and passed to the [combine](#combine) method.
3. [Submit](#submit) - Submit the transaction to the connected server.
4. Verify - Verify that the transaction got validated by querying with [getTransaction](#gettransaction). This is necessary because transactions may fail even if they were successfully submitted.

## Transaction Fees

Every transaction must destroy a small amount of XRP as a cost to apply the transaction to the ledger. This is also called a *transaction fee*. The transaction cost is designed to increase along with the load on the XRP Ledger, making it very expensive to deliberately or inadvertently overload the peer-to-peer network that powers the XRP Ledger.

You can choose the size of the fee you want to pay or let a default be used. You can get an estimate of the fee required to be included in the next ledger closing with the [getFee](#getfee) method.

For a multi-signed transaction, ripple-lib automatically multiplies the `fee` by (1 + Number of Signatures Provided). For example, if you set `instructions.fee = '0.000020'` and `instructions.signersCount = 2`, the prepared transaction's `Fee` is 20 drops × (1 + 2 Signatures) = 60 drops. See [Transaction Cost](https://xrpl.org/transaction-cost.html).

## Transaction Instructions

Transaction instructions indicate how to execute a transaction, complementary with the [transaction specification](#transaction-specifications).

Name | Type | Description
---- | ---- | -----------
fee | [value](#value) | *Optional* An exact fee to pay for the transaction, before multiplying for multi-signed transactions. See [Transaction Fees](#transaction-fees) for more information.
maxFee | [value](#value) | *Optional* Deprecated: Use `maxFeeXRP` in the RippleAPI constructor instead. The maximum fee to pay for this transaction. If this exceeds `maxFeeXRP`, use `maxFeeXRP` instead. See [Transaction Fees](#transaction-fees) for more information.
maxLedgerVersion | integer,null | *Optional* The highest ledger version that the transaction can be included in. If this option and `maxLedgerVersionOffset` are both omitted, the default is 3 greater than the current validated ledger version (equivalent to `maxLedgerVersionOffset=3`). Use `null` to not set a maximum ledger version. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
maxLedgerVersion | string,null | *Optional* The highest ledger version that the transaction can be included in. If this option and `maxLedgerVersionOffset` are both omitted, the default is 3 greater than the current validated ledger version (equivalent to `maxLedgerVersionOffset=3`). Use `null` to not set a maximum ledger version. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
maxLedgerVersionOffset | integer | *Optional* Offset from current validated ledger version to highest ledger version that the transaction can be included in.
sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
signersCount | integer | *Optional* Number of signers that can multi-sign this transaction.
ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The ticket sequence to be used for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

We recommend that you specify a `maxLedgerVersion` so that you can quickly determine that a failed transaction can never succeed in the future. It is impossible for a transaction to succeed after the XRP Ledger's consensus-validated ledger version exceeds the transaction's `maxLedgerVersion`. If you omit `maxLedgerVersion`, the "prepare\*" method automatically supplies a `maxLedgerVersion` equal to the current ledger plus 3, which it includes in the return value from the "prepare\*" method.

## Transaction ID

```json
"F4AB442A6D4CBB935D66E1DA7309A5FC71C7143ED4049053EC14E3875B0CF9BF"
```

A transaction ID is a 64-bit hexadecimal string that uniquely identifies the transaction. The transaction ID is derived from the transaction instruction and specifications, using a strong hash function.

You can look up a transaction by ID using the [getTransaction](#gettransaction) method.

## Transaction Memos

Every transaction can optionally have an array of memos for user applications. The `memos` field in each [transaction specification](#transaction-specifications) is an array of objects with the following structure:

Name | Type | Description
---- | ---- | -----------
data | string | *Optional* Arbitrary string, conventionally containing the content of the memo.
format | string | *Optional* Conventionally containing information on how the memo is encoded, for example as a [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml). Only characters allowed in URLs are permitted.
type | string | *Optional* Conventionally, a unique relation (according to [RFC 5988](http://tools.ietf.org/html/rfc5988#section-4)) that defines the format of this memo. Only characters allowed in URLs are permitted.

# Transaction Specifications

A *transaction specification* specifies what a transaction should do. Each [Transaction Type](#transaction-types) has its own type of specification, which corresponds to the [native XRP Ledger transaction types](https://xrpl.org/transaction-types.html).

## Account Delete

Delete your account and send the remaining XRP elsewhere. (Native transaction type: [AccountDelete](https://xrpl.org/accountdelete.html))

Name | Type | Description
---- | ---- | -----------
destination | [address](#address) | *Optional* Address of an account to receive any leftover XRP after deleting the sending account. Must be a funded account in the ledger, and must not be the sending account.
destinationTag | integer | *Optional* (Optional) Arbitrary destination tag that identifies a hosted recipient or other information for the recipient of the deleted account's leftover XRP.
destinationXAddress | [address](#address) | *Optional* X-address of an account to receive any leftover XRP after deleting the sending account. Must be a funded account in the ledger, and must not be the sending account.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.

> **Note:** To prepare an Account Delete transaction, use [`prepareTransaction()`](#preparetransaction) with the [native transaction format](https://xrpl.org/accountdelete.html).

## Check Cancel

Cancel a Check that has not been redeemed. (Native transaction type: [CheckCancel](https://xrpl.org/checkcancel.html))

Name | Type | Description
---- | ---- | -----------
checkID | string | The ID of the Check ledger object to cancel, as a 64-character hexadecimal string.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.

#### Example


```json
{
  "checkID": "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0"
}
```



## Check Cash

Redeem a Check for up to its stated value. (Native transaction type: [CheckCash](https://xrpl.org/checkcash.html))

Name | Type | Description
---- | ---- | -----------
checkID | string | The ID of the Check ledger object to cash, as a 64-character hexadecimal string.
amount | [laxAmount](#amount) | *Optional* Redeem the Check for exactly this amount, if possible. The currency must match that of the sendMax of the corresponding CheckCreate transaction. You must provide either this field or deliverMin.
deliverMin | [laxAmount](#amount) | *Optional* Redeem the Check for at least this amount and for as much as possible. The currency must match that of the sendMax of the corresponding CheckCreate transaction. You must provide either this field or amount.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.

#### Example


```json
{
  "amount": {
    "currency": "drops",
    "value": "1000000"
  },
  "checkID": "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334"
}
```



## Check Create

Create a Check, a deferred payment that can be redeemed by the destination. (Native transaction type: [CheckCreate](https://xrpl.org/checkcreate.html))

Name | Type | Description
---- | ---- | -----------
destination | [address](#address) | Address of the account that can cash the check.
sendMax | [laxAmount](#amount) | Amount of source currency the check is allowed to debit the sender, including transfer fees on non-XRP currencies.
destinationTag | integer | *Optional* Destination tag that identifies the reason for the check, or a hosted recipient to pay.
expiration | date-time string | *Optional* Time after which the check is no longer valid.
invoiceID | string | *Optional* 256-bit hash, as a 64-character hexadecimal string, representing a specific reason or identifier for this check.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.

#### Example


```json
{
  "destination": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
  "sendMax": {
    "currency": "drops",
    "value": "1000000"
  }
}
```



## Deposit Preauth

Preauthorize an sender to deposit money at an account using [Deposit Authorization](https://xrpl.org/depositauth.html). (Native transaction type: [DepositPreauth](https://xrpl.org/depositpreauth.html))

Name | Type | Description
---- | ---- | -----------
authorize | [address](#address) | *Optional* Address of the account that can cash the check.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.
unauthorize | [address](#address) | *Optional* Address of the account that can cash the check.

> **Note:** To prepare a Deposit Preauth transaction, use [`prepareTransaction()`](#preparetransaction) with the [native transaction format](https://xrpl.org/depositpreauth.html).


## Escrow Cancellation

Cancel an Escrow that has passed its expiration. (Native transaction type: [EscrowCancel](https://xrpl.org/escrowcancel.html))

Name | Type | Description
---- | ---- | -----------
owner | [address](#address) | The address of the owner of the escrow to cancel.
escrowSequence | [sequence](#account-sequence-number) | The [account sequence number](#account-sequence-number) of the [Escrow Creation](#escrow-creation) transaction for the escrow to cancel.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.

#### Example


```json
{
  "owner": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "escrowSequence": 1234
}
```



## Escrow Creation

Create an Escrow that locks up XRP until a given time or condition is met. (Native transaction type: [EscrowCreate](https://xrpl.org/escrowcreate.html))

Name | Type | Description
---- | ---- | -----------
amount | [value](#value) | Amount of XRP for sender to escrow.
destination | [address](#address) | Address to receive escrowed XRP.
allowCancelAfter | date-time string | *Optional* If present, the escrow may be cancelled after this time.
allowExecuteAfter | date-time string | *Optional* If present, the escrow can not be executed before this time.
condition | string | *Optional* A hex value representing a [PREIMAGE-SHA-256 crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1). If present, `fulfillment` is required upon execution.
destinationTag | integer | *Optional* Destination tag.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.
sourceTag | integer | *Optional* Source tag.

#### Example


```json
{
  "destination": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
  "amount": "0.01",
  "allowExecuteAfter": "2014-09-24T21:21:50.000Z",
  "allowCancelAfter":  "2017-01-01T00:00:00.000Z"
}
```



## Escrow Execution

Deliver XRP from an Escrow after its conditions have been met. (Native transaction type: [EscrowFinish](https://xrpl.org/escrowfinish.html))

Name | Type | Description
---- | ---- | -----------
owner | [address](#address) | The address of the owner of the escrow to execute.
escrowSequence | [sequence](#account-sequence-number) | The [account sequence number](#account-sequence-number) of the [Escrow Creation](#escrow-creation) transaction for the escrow to execute.
condition | string | *Optional* A hex value representing a [PREIMAGE-SHA-256 crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1). This must match the original `condition` from the escrow creation transaction.
fulfillment | string | *Optional* A hex value representing the [PREIMAGE-SHA-256 crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1) fulfillment for `condition`.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.

#### Example


```json
{
  "owner": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "escrowSequence": 1234,
  "condition": "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100",
  "fulfillment": "A0028000"
}
```



## Order

Create and execute a limit order in the decentralized exchange. (Native transaction type: [OfferCreate](https://xrpl.org/offercreate.html))

Name | Type | Description
---- | ---- | -----------
direction | string | Equal to "buy" for buy orders and "sell" for sell orders.
quantity | [amount](#amount) | The amount of currency to buy or sell.
totalPrice | [amount](#amount) | The total price to be paid for the `quantity` to be bought or sold.
expirationTime | date-time string | *Optional* Time after which the offer is no longer active, as an [ISO 8601 date-time](https://en.wikipedia.org/wiki/ISO_8601).
fillOrKill | boolean | *Optional* Treat the offer as a [Fill or Kill order](http://en.wikipedia.org/wiki/Fill_or_kill). Only attempt to match existing offers in the ledger, and only do so if the entire quantity can be exchanged. This cannot be used with `immediateOrCancel`.
immediateOrCancel | boolean | *Optional* Treat the offer as an [Immediate or Cancel order](http://en.wikipedia.org/wiki/Immediate_or_cancel). If enabled, do not create an object in the ledger that can be matched later: instead, only execute as much as can be fulfilled immediately. This cannot be used with `fillOrKill`.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.
orderToReplace | [sequence](#account-sequence-number) | *Optional* The [account sequence number](#account-sequence-number) of an order to cancel before the new order is created, effectively replacing the old order.
passive | boolean | *Optional* If enabled, the offer does not consume offers that exactly match it, and instead becomes an Offer node in the ledger. It still consumes offers that cross it.

The following invalid flag combination causes a `ValidationError`: `immediateOrCancel` and `fillOrKill`. These fields are mutually exclusive, and cannot both be set at the same time.

#### Example


```json
{
  "direction": "buy",
  "quantity": {
    "currency": "USD",
    "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM",
    "value": "10.1"
  },
  "totalPrice": {
    "currency": "drops",
    "value": "2000000"
  },
  "passive": false,
  "fillOrKill": true
}
```



## Order Cancellation

Cancel an order in the decentralized exchange. (Native transaction type: [OfferCancel](https://xrpl.org/offercancel.html))

Name | Type | Description
---- | ---- | -----------
orderSequence | [sequence](#account-sequence-number) | The [account sequence number](#account-sequence-number) of the order to cancel.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.

#### Example


```json
{
  "orderSequence": 23
}
```



## Payment

Send value from one account to another. (Native transaction type: [Payment](https://xrpl.org/payment.html))

Name | Type | Description
---- | ---- | -----------
source | object | The source of the funds to be sent.
*source.* address | [address](#address) | The address to send from.
*source.* amount | [laxAmount](#amount) | An exact amount to send. If the counterparty is not specified, amounts with any counterparty may be used. (This field cannot be used with source.maxAmount)
*source.* tag | integer | *Optional* An arbitrary 32-bit unsigned integer. It typically maps to an off-ledger account; for example, a hosted wallet or exchange account.
*source.* maxAmount | [laxAmount](#amount) | The maximum amount to send. (This field cannot be used with source.amount)
destination | object | The destination of the funds to be sent.
*destination.* address | [address](#address) | An address representing the destination of the transaction.
*destination.* amount | [laxAmount](#amount) | An exact amount to deliver to the recipient. If the counterparty is not specified, amounts with any counterparty may be used. (This field cannot be used with `destination.minAmount`.)
*destination.* tag | integer | *Optional* An arbitrary 32-bit unsigned integer. It typically maps to an off-ledger account; for example, a hosted wallet or exchange account.
*destination.* minAmount | [laxAmount](#amount) | The minimum amount to be delivered. (This field cannot be used with destination.amount)
allowPartialPayment | boolean | *Optional* If true, this payment can deliver less than the full amount.
invoiceID | string | *Optional* A 256-bit hash that can be used to identify a particular payment.
limitQuality | boolean | *Optional* Only take paths where all the conversions have an input:output ratio that is equal or better than the ratio of destination.amount:source.maxAmount.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.
noDirectRipple | boolean | *Optional* If true and paths are specified, the sender would like the XRP Ledger to disregard any direct paths from the source account to the destination account. This may be used to take advantage of an arbitrage opportunity or by gateways wishing to issue balances from a hot wallet to a user who has mistakenly set a trustline directly to the hot wallet.
paths | string | *Optional* The paths of trustlines and orders to use in executing the payment.

#### Example


```json
{
  "source": {
    "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "maxAmount": {
      "value": "0.01",
      "currency": "USD",
      "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
    }
  },
  "destination": {
    "address": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
    "amount": {
      "value": "0.01",
      "currency": "USD",
      "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
    }
  }
}
```



## Payment Channel Claim

Redeem XRP from a Payment Channel. (Native transaction type: [PaymentChannelClaim](https://xrpl.org/paymentchannelclaim.html))

Name | Type | Description
---- | ---- | -----------
channel | string | 256-bit hexadecimal channel identifier.
amount | [value](#value) | *Optional* Amount of XRP authorized by this signature.
balance | [value](#value) | *Optional* Total XRP balance delivered by this channel after claim is processed.
close | boolean | *Optional* Request to close the channel. If the channel has no XRP remaining or the destination address requests it, closes the channel immediately (returning unclaimed XRP to the source address). Otherwise, sets the channel to expire after settleDelay seconds have passed.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.
publicKey | string | *Optional* Public key of the channel. (For verifying the signature.)
renew | boolean | *Optional* Clear the channel's expiration time.
signature | string | *Optional* Signed claim authorizing withdrawal of XRP from the channel. (Required except from the channel's source address.)

#### Example


```json
{
  "channel": "C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198"
}
```



## Payment Channel Create

Create a Payment Channel with XRP set aside for asynchronous payments. (Native transaction type: [PaymentChannelCreate](https://xrpl.org/paymentchannelcreate.html))

Name | Type | Description
---- | ---- | -----------
amount | [value](#value) | Amount of XRP for sender to set aside in this channel.
destination | [address](#address) | Address to receive XRP claims against this channel.
settleDelay | number | Amount of seconds the source address must wait before closing the channel if it has unclaimed XRP.
publicKey | string | Public key of the key pair the source may use to sign claims against this channel.
cancelAfter | date-time string | *Optional* Time when this channel expires. This expiration cannot be changed after creating the channel.
destinationTag | integer | *Optional* Destination tag.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.
sourceTag | integer | *Optional* Source tag.

#### Example


```json
{
  "amount": "1",
  "destination": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
  "settleDelay": 86400,
  "publicKey": "32D2471DB72B27E3310F355BB33E339BF26F8392D5A93D3BC0FC3B566612DA0F0A"
}
```



## Payment Channel Fund

Add XRP to a Payment Channel. (Native transaction type: [PaymentChannelFund](https://xrpl.org/paymentchannelfund.html))

Name | Type | Description
---- | ---- | -----------
amount | [value](#value) | Amount of XRP to fund the channel with.
channel | string | 256-bit hexadecimal channel identifier.
expiration | date-time string | *Optional* New expiration for this channel. (This does not change the cancelAfter expiration, if the channel has one.) Cannot move the expiration sooner than settleDelay seconds from time of the request.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.

#### Example


```json
{
  "channel": "C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198",
  "amount": "1"
}
```




## Settings

Change account settings. (Native transaction types: [AccountSet](https://xrpl.org/accountset.html), [SetRegularKey](https://xrpl.org/setregularkey.html), [SignerListSet](https://xrpl.org/signerlistset.html))

Name | Type | Description
---- | ---- | -----------
defaultRipple | boolean | *Optional* Enable [rippling](https://xrpl.org/rippling.html) on this account’s trust lines by default. Currency issuers should enable this setting; most others should not.
depositAuth | boolean | *Optional* Enable [Deposit Authorization](https://xrpl.org/depositauth.html) on this account. If set, transactions cannot send value of any kind to this account unless the sender of those transactions is the account itself. (Requires the [DepositAuth amendment](https://xrpl.org/known-amendments.html#depositauth))
disableMasterKey | boolean | *Optional* Disallows use of the master key to sign transactions for this account. To disable the master key, you must authorize the transaction by signing it with the master key pair. You cannot use a regular key pair or a multi-signature. You can re-enable the master key pair using a regular key pair or multi-signature. See [AccountSet](https://xrpl.org/accountset.html).
disallowIncomingXRP | boolean | *Optional* Indicates that client applications should not send XRP to this account. Not enforced by rippled.
domain | string | *Optional* The domain that owns this account, as a hexadecimal string representing the ASCII for the domain in lowercase.
emailHash | string,null | *Optional* Hash of an email address to be used for generating an avatar image. Conventionally, clients use Gravatar to display this image. Use `null` to clear.
enableTransactionIDTracking | boolean | *Optional* Track the ID of this account’s most recent transaction.
globalFreeze | boolean | *Optional* Freeze all assets issued by this account.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.
messageKey | string | *Optional* Public key for sending encrypted messages to this account. Conventionally, it should be a secp256k1 key, the same encryption that is used by the rest of Ripple.
noFreeze | boolean | *Optional* Permanently give up the ability to freeze individual trust lines. This flag can never be disabled after being enabled.
passwordSpent | boolean | *Optional* Indicates that the account has used its free SetRegularKey transaction.
regularKey | [address](#address),null | *Optional* The public key of a new keypair, to use as the regular key to this account, as a base-58-encoded string in the same format as an account address. Use `null` to remove the regular key.
requireAuthorization | boolean | *Optional* If set, this account must individually give other users permission to hold this account’s issued tokens.
requireDestinationTag | boolean | *Optional* Requires incoming payments to specify a destination tag.
signers | object | *Optional* Settings that determine what sets of accounts can be used to sign a transaction on behalf of this account using multisigning.
*signers.* threshold | integer | A target number for the signer weights. A multi-signature from this list is valid only if the sum weights of the signatures provided is equal or greater than this value. To delete the signers setting, use the value `0`.
*signers.* weights | array | *Optional* Weights of signatures for each signer.
*signers.* weights[] | object | An association of an address and a weight.
*signers.weights[].* address | [address](#address) | An account address on the XRP Ledger
*signers.weights[].* weight | integer | The weight that the signature of this account counts as towards the threshold.
tickSize | string | *Optional* Tick size to use for offers involving a currency issued by this address. The exchange rates of those offers is rounded to this many significant digits. Valid values are 3 to 15 inclusive, or 0 to disable.
transferRate | number,null | *Optional* The fee to charge when users transfer this account’s issuances, as the decimal amount that must be sent to deliver 1 unit. Has precision up to 9 digits beyond the decimal point. Use `null` to set no fee.
walletLocator | string,null | *Optional* Transaction hash or any other 64 character hexadecimal string, that may or may not represent the result of a hash operation. Use `null` to clear.

#### Example


```json
{
  "domain": "example.com",
  "memos": [
    {
      "type": "test",
      "format": "text/plain",
      "data": "texted data"
    }
  ]
}
```



## Ticket Create

Set aside account Sequence numbers as Tickets to be used by later transactions.

> **Caution:** As of 2021-01-22, Tickets are not yet available on the XRP Ledger.

> **Note:** To prepare a Ticket Create transaction, use [`prepareTransaction()`](#preparetransaction) with the native transaction format. <!-- Future link: https://xrpl.org/ticketcreate.html -->


## Trustline

Create or modify a trust line between two accounts, for an issued currency. (Native transaction type: [TrustSet](https://xrpl.org/trustset.html))

Name | Type | Description
---- | ---- | -----------
currency | [currency](#currency) | The currency this trustline applies to.
counterparty | [address](#address) | The address of the account this trustline extends trust to.
limit | [value](#value) | The maximum amount that the owner of the trustline can be owed through the trustline.
authorized | boolean | *Optional* If true, authorize the counterparty to hold issuances from this account.
frozen | boolean | *Optional* If true, the trustline is frozen, which means that funds can only be sent to the owner.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.
qualityIn | number | *Optional* Incoming balances on this trustline are valued at this ratio.
qualityOut | number | *Optional* Outgoing balances on this trustline are valued at this ratio.
ripplingDisabled | boolean | *Optional* If true, payments cannot ripple through this trustline.

#### Example


```json
{
  "currency": "USD",
  "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM",
  "limit": "10000",
  "qualityIn": 0.91,
  "qualityOut": 0.87,
  "ripplingDisabled": true,
  "frozen": false,
  "memos": [
    {
      "type": "test",
      "format": "text/plain",
      "data": "texted data"
    }
  ]
}
```


# rippled APIs

ripple-lib uses the XRP Ledger's [WebSocket API](https://xrpl.org/rippled-api.html) for online functionality. You can use ripple-lib to call these APIs directly. Use the `request()`, `hasNextPage()`, and `requestNextPage()` methods:

* Use `request()` to issue any `rippled` command, including `account_currencies`, `subscribe`, and `unsubscribe`. [Full list of API Methods](https://xrpl.org/public-rippled-methods.html).
* Use `hasNextPage()` to determine whether a response has more pages. This is true when the response includes a [`marker` field](https://xrpl.org/markers-and-pagination.html).
* Use `requestNextPage()` to request the next page of data.

When using rippled APIs:

* [Specify XRP amounts in drops](https://xrpl.org/basic-data-types.html#specifying-currency-amounts).
* [Specify timestamps as the number of seconds since the "Ripple Epoch"](https://xrpl.org/basic-data-types.html#specifying-time).
* Instead of `counterparty`, use `issuer`.

## Listening to streams

The `rippled` server can push updates to your client when various events happen.
Refer to [Subscriptions in the `rippled` API docs](https://xrpl.org/subscribe.html) for details.

Note that the `streams` parameter for generic streams takes an array. For example, to subscribe to the `validations` stream, use `{ streams: [ 'validations' ] }`.

The string names of some generic streams to subscribe to are in the table below. (Refer to `rippled` for an up-to-date list of streams.)

Type | Description
---- | -----------
`server` | Sends a message whenever the status of the `rippled` server (for example, network connectivity) changes.
`ledger` | Sends a message whenever the consensus process declares a new validated ledger.
`transactions` | Sends a message whenever a transaction is included in a closed ledger.
`transactions_proposed` | Sends a message whenever a transaction is included in a closed ledger, as well as some transactions that have not yet been included in a validated ledger and may never be. Not all proposed transactions appear before validation. Even some transactions that don't succeed are included in validated ledgers because they take the anti-spam transaction fee.
`validations` | Sends a message whenever the server receives a validation message, also called a validation vote, regardless of whether the server trusts the validator.
`manifests` | Sends a message whenever the server receives a manifest.
`peer_status` | (Admin-only) Information about connected peer `rippled` servers, especially with regards to the consensus process.

When you subscribe to a stream, you must also listen to the relevant message type(s). Some of the available message types are in the table below. (Refer to `rippled` for an up-to-date list of message types.)

Type | Description
---- | -----------
`ledgerClosed` | Sent by the `ledger` stream when the consensus process declares a new fully validated ledger. The message identifies the ledger and provides some information about its contents.
`validationReceived` | Sent by the `validations` stream when the server receives a validation message, also called a validation vote, regardless of whether the server trusts the validator.
`manifestReceived` | Sent by the `manifests` stream when the server receives a manifest.
`transaction` | Sent by many subscriptions including `transactions`, `transactions_proposed`, `accounts`, `accounts_proposed`, and `book` (Order Book). See [Transaction Streams](https://xrpl.org/subscribe.html#transaction-streams) for details.
`peerStatusChange` | (Admin-only) Reports a large amount of information on the activities of other `rippled` servers to which the server is connected.
`path_find` | Asynchronous follow-up response to the currently open path\_find request. See [rippled path\_find method](https://xrpl.org/path_find.html) for details.

To register your listener function, use `connection.on(type, handler)`.

Here is an example of listening for transactions on given account(s):
```
const account = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn' // Replace with the account you want notifications for
api.connect().then(() => {

  // 'transaction' can be replaced with the relevant `type` from the table above
  api.connection.on('transaction', (event) => {

      // Do something useful with `event`
      console.log(JSON.stringify(event, null, 2))
  })

  api.request('subscribe', {
      accounts: [ account ]
  }).then(response => {
      console.log('Successfully subscribed')
  }).catch(error => {
      // Handle `error`
  })
})
```

The subscription ends when you unsubscribe or the WebSocket connection is closed.

For full details, see the [subscribe method](https://xrpl.org/subscribe.html).

## request

`request(command: string, options: object): Promise<object>`

Returns the response from invoking the specified command, with the specified options, on the connected rippled server.

Refer to [HTTP / WebSocket APIs](https://xrpl.org/rippled-api.html) for commands and options. All XRP amounts must be specified in drops. One drop is equal to 0.000001 XRP. See [Specifying Currency Amounts](https://xrpl.org/basic-data-types.html#specifying-currency-amounts).

Most commands return data for the `current` (in-progress, open) ledger by default. Do not rely on this. Always specify a ledger version in your request. In the example below, the 'validated' ledger is requested, which is the most recent ledger that has been validated by the whole network. See [Specifying Ledgers](https://xrpl.org/basic-data-types.html#specifying-ledgers).

### Return Value

This method returns a promise that resolves with the response from rippled.

### Example

```javascript
// Replace 'ledger' with your desired rippled command
return api.request('ledger', {
  ledger_index: 'validated'
}).then(response => {
  /* Do something useful with response */
  console.log(JSON.stringify(response, null, 2))
}).catch(console.error);
```


```json
{
  "ledger": {
    "account_hash": "F9E9653EA76EA0AEA58AC98A8E19EDCEC8299C2940519A190674FFAED3639A1F",
    "close_flags": 0,
    "close_time": 577999430,
    "close_time_human": "2018-Apr-25 19:23:50",
    "close_time_resolution": 10,
    "closed": true,
    "ledger_hash": "450E5CB0A39495839DA9CD9A0FED74BD71CBB929423A907ADC00F14FC7E7F920",
    "ledger_index": "38217406",
    "parent_close_time": 577999422,
    "parent_hash": "B8B364C63EB9E13FDB89CB729FEF833089B8438CBEB8FC41744CB667209221B3",
    "total_coins": "99992286058637091",
    "transaction_hash": "5BDD3D2780C28FB2C91C3404BD8ED04786B764B1E18CF319888EDE2C09834726"
  },
  "ledger_hash": "450E5CB0A39495839DA9CD9A0FED74BD71CBB929423A907ADC00F14FC7E7F920",
  "ledger_index": 38217406,
  "validated": true
}
```


## hasNextPage

`hasNextPage(currentResponse): boolean`

Returns `true` when there are more pages available.

When there are more results than contained in the response, the response includes a `marker` field. You can use this convenience method, or check for `marker` yourself.

See [Markers and Pagination](https://xrpl.org/markers-and-pagination.html).

### Return Value

This method returns `true` if `currentResponse` includes a `marker`.

### Example

```javascript
return api.request('ledger_data', {
  ledger_index: 'validated'
}).then(response => {
  /* Do something useful with response */

  if (api.hasNextPage(response)) {
    /* There are more pages available */
  }
}).catch(console.error);
```

## requestNextPage

`requestNextPage(command: string, params: object = {}, currentResponse: object): Promise<object>`

Requests the next page of data.

You can use this convenience method, or include `currentResponse.marker` in `params` yourself, when using `request`.

See [Markers and Pagination](https://xrpl.org/markers-and-pagination.html).

### Return Value

This method returns a promise that resolves with the next page of data from rippled.

If the response does not have a next page, the promise rejects with `new errors.NotFoundError('response does not have a next page')`.

### Example

```javascript
const command = 'ledger_data'
const params = {
  ledger_index: 'validated'
}
return api.request(command, params).then(response => {
  return api.requestNextPage(command, params, response)
}).then(response_page_2 => {
  /* Do something useful with second page of response */
}).catch(console.error);
```


# Static Methods

You can access static methods directly on the `RippleAPI` class. For example, `RippleAPI.computeBinaryTransactionHash(...)`.

A few of the most commonly-used methods are documented below.

For a full list, refer to these docs:

- [XRP Ledger Hashes](https://github.com/ripple/ripple-lib/blob/develop/src/common/hashes/README.md)
- [ripple-address-codec API](https://github.com/ripple/ripple-address-codec/blob/master/README.md#api)

## computeBinaryTransactionHash

`computeBinaryTransactionHash(txBlobHex: string): string`

Returns the hash (id) of a binary transaction blob.

This is a static method on the `RippleAPI` class.

### Parameters

This method takes one parameter, a string containing a binary transaction in hex.

### Return Value

This method returns a string representing the transaction's id (hash).

### Example

```javascript
const signed_blob = '120000228000000024000B2E5A201B0066374B61400000003B9ACA0068400000000000000C732102356E89059A75438887F9FEE2056A2890DB82A68353BE9C0C0C8F89C0018B37FC74473045022100B3721EEB1ED6DFF29FB8B209E2DE6B54A0A6E44D52D926342F3D334BE98F08640220367A74107AD5DEAEFA3AB2984C161FC23F30B2704BB5CC984358BA262177A4568114F667B0CA50CC7709A220B0561B85E53A48461FA883142B71D8B09B4EE8DAA68FB936C23E3A974713BDAC'
if (typeof signed_blob === 'string' && signed_blob.match(/^[A-F0-9]+$/)) {
  const id = RippleAPI.computeBinaryTransactionHash(signed_blob)
  console.log('Transaction hash:', id')
}
```

```
Transaction hash: 80C5E11E1A21A626759D6CB944B33DBAAC66BD704A289C86E330B847904F5C13
```

[RunKit Example: computeBinaryTransactionHash](https://runkit.com/intelliot/computebinarytransactionhash-example)

## classicAddressToXAddress

`classicAddressToXAddress(classicAddress: string, tag: number | false[, test: boolean]): string`

Convert a classic address and tag to an X-address.

If `test` is `true`, the address starts with `T` to show that the address is intended for use on a test network.

### Example: Encode an X-address with tag 4294967295

```javascript
const RippleAPI = require('ripple-lib').RippleAPI
const xAddress = RippleAPI.classicAddressToXAddress('rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf', 4294967295)
console.log(xAddress)
```

```
XVLhHMPHU98es4dbozjVtdWzVrDjtV18pX8yuPT7y4xaEHi
```

### Example: Encode a test address for use with Testnet or Devnet

```javascript
const RippleAPI = require('ripple-lib').RippleAPI
const address = RippleAPI.classicAddressToXAddress('r3SVzk8ApofDJuVBPKdmbbLjWGCCXpBQ2g', 123, true)
console.log(address)
```

```
T7oKJ3q7s94kDH6tpkBowhetT1JKfcfdSCmAXbS75iATyLD
```

## xAddressToClassicAddress

`xAddressToClassicAddress(xAddress: string): {classicAddress: string, tag: number | false, test: boolean}`

Convert an X-address to a classic address and tag.

Since `0` is a valid tag, use `if (tag !== false)` to you want to check for a tag.

If the address is intended for use on a test network, `test === true`. Otherwise, `test === false`.

### Example

```javascript
const RippleAPI = require('ripple-lib').RippleAPI
const address = RippleAPI.xAddressToClassicAddress('XVLhHMPHU98es4dbozjVtdWzVrDjtV18pX8yuPT7y4xaEHi')
console.log(address)
```

```
{
  classicAddress: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf',
  tag: 4294967295,
  test: false
}
```

## renameCounterpartyToIssuer

`renameCounterpartyToIssuer(issue: {currency: string, counterparty: address}): {currency: string, issuer: address}`

Returns an object with the `counterparty` field renamed to `issuer`. This is useful because RippleAPI generally uses the name `counterparty` while the rippled API generally uses the name `issuer`.

This is a static method on the `RippleAPI` class.

### Parameters

This method takes one parameter, an object with a `counterparty` field.

### Return Value

This method returns a new object based on the source object, but with `issuer` instead of `counterparty`.

### Example

```javascript
const orderbookInfo = {
  "base": {
    "currency": "USD",
    "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  "counter": {
    "currency": "BTC",
    "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  }
};
console.log(RippleAPI.renameCounterpartyToIssuer(orderbookInfo.base))
console.log(RippleAPI.renameCounterpartyToIssuer(orderbookInfo.counter))
```

```
{ currency: 'USD', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' }
{ currency: 'BTC', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' }
```

## formatBidsAndAsks

`formatBidsAndAsks(orderbookInfo: {base: Issue, counter: Issue}, offers: BookOffer[]): orderbook`

Returns formatted bids and asks, which make up an orderbook.

This is a static method on the `RippleAPI` class.

### Parameters

This method takes two parameters.

1. An `OrderbookInfo` object: `{ base: Issue, counter: Issue }`.
2. An array of `BookOffer` objects.

### Return Value

This method returns an object with two properties: `bids` and `asks`, each of which is an array of bids (buy orders) or asks (sell orders), respectively. Both `bids` and `asks` are formatted the same way.

Object structure:

Name | Type | Description
---- | ---- | -----------
bids | array | The buy orders in the order book.
bids[] | object | An order in the order book.
*bids[].* specification | [order](#order) | An order specification that would create an order equivalent to the current state of this order.
*bids[].* properties | object | Properties of the order not in the specification.
*bids[].properties.* maker | [address](#address) | The address of the account that submitted the order.
*bids[].properties.* sequence | [sequence](#account-sequence-number) | The account sequence number of the transaction that created this order.
*bids[].properties.* makerExchangeRate | [value](#value) | The exchange rate from the point of view of the account that submitted the order (also known as "quality").
*bids[].data.* \* | object | 
*bids[].* state | object | *Optional* The state of the order.
*bids[].state.* fundedAmount | [amount](#amount) | How much of the amount the maker would have to pay that the maker currently holds.
*bids[].state.* priceOfFundedAmount | [amount](#amount) | How much the `fundedAmount` would convert to through the exchange rate of this order.
asks | array | The sell orders in the order book.
asks[] | object | An order in the order book.
*asks[].* specification | [order](#order) | An order specification that would create an order equivalent to the current state of this order.
*asks[].* properties | object | Properties of the order not in the specification.
*asks[].properties.* maker | [address](#address) | The address of the account that submitted the order.
*asks[].properties.* sequence | [sequence](#account-sequence-number) | The account sequence number of the transaction that created this order.
*asks[].properties.* makerExchangeRate | [value](#value) | The exchange rate from the point of view of the account that submitted the order (also known as "quality").
*asks[].data.* \* | object | 
*asks[].* state | object | *Optional* The state of the order.
*asks[].state.* fundedAmount | [amount](#amount) | How much of the amount the maker would have to pay that the maker currently holds.
*asks[].state.* priceOfFundedAmount | [amount](#amount) | How much the `fundedAmount` would convert to through the exchange rate of this order.

**Raw order data:** The response includes a `data` property containing the raw order data. This may include `owner_funds`, `Flags`, and other fields.

For details, see the `rippled` [book_offers method](https://xrpl.org/book_offers.html).

### Example

```javascript
const orderbookInfo = {
  "base": {
    "currency": "USD",
    "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  "counter": {
    "currency": "BTC",
    "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  }
};

const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';

return Promise.all(
  [
    this.api.request('book_offers', {
      taker_gets: RippleAPI.renameCounterpartyToIssuer(orderbookInfo.base),
      taker_pays: RippleAPI.renameCounterpartyToIssuer(orderbookInfo.counter),
      ledger_index: 'validated',
      limit: 20,
      taker: address
    }),
    this.api.request('book_offers', {
      taker_gets: RippleAPI.renameCounterpartyToIssuer(orderbookInfo.counter),
      taker_pays: RippleAPI.renameCounterpartyToIssuer(orderbookInfo.base),
      ledger_index: 'validated',
      limit: 20,
      taker: address
    })
  ]
).then((directOfferResults, reverseOfferResults) => {
  const directOffers = (directOfferResults ? directOfferResults : []).reduce((acc, res) => acc.concat(res.offers), [])
  const reverseOffers = (reverseOfferResults ? reverseOfferResults : []).reduce((acc, res) => acc.concat(res.offers), [])
  const orderbook = RippleAPI.formatBidsAndAsks(orderbookInfo, [...directOffers, ...reverseOffers]);
  console.log(JSON.stringify(orderbook, null, 2));
});
```

```
{
  "bids": [
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "USD",
          "value": "0.71800168",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.00016708342",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rUKoQ1Zhn6c8EfPsaVa2Yx5NqaKN1JQSvq",
        "sequence": 262660,
        "makerExchangeRate": "4297.264683713081"
      },
      "data": {
        "Account": "rUKoQ1Zhn6c8EfPsaVa2Yx5NqaKN1JQSvq",
        "BookDirectory": "6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC98580F4456E6FA8239",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "000000000000001D",
        "PreviousTxnID": "16D75506C6317723FC03543130B5E0AAB13E8AD22514C1DB098BE05771C90447",
        "PreviousTxnLgrSeq": 43127860,
        "Sequence": 262660,
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.00016708342"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.71800168"
        },
        "index": "DE877FB94EF892A4BCC58DB8CDE063D97AB5133201905DE6C8650B5DEA19E11B",
        "owner_funds": "0.03358376764081196",
        "quality": "4297.264683713081"
      }
    },
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "USD",
          "value": "1.6770875",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.00038681218",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rpmL45YbZWKgp8AH8EjBSknWo5c8dNuuBM",
        "sequence": 231459,
        "makerExchangeRate": "4335.663628792661"
      },
      "data": {
        "Account": "rpmL45YbZWKgp8AH8EjBSknWo5c8dNuuBM",
        "BookDirectory": "6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC98580F67435A75B355",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000001",
        "PreviousTxnID": "F049EAFDDDA7B99970F77533743D95C9E12A16FE6C56215A0B09C32C4D23163F",
        "PreviousTxnLgrSeq": 43127094,
        "Sequence": 231459,
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.00038681218"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "1.6770875"
        },
        "index": "3B314A51BD57601CA1509834DF9462037BF4B05AFCC1E1EFD334DB4E2D7B2AA6",
        "owner_funds": "0.03906802968738533",
        "quality": "4335.663628792661"
      }
    },
    // ... trimmed for brevity ...
  ],
  "asks": [
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "USD",
          "value": "0.71085738",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.00016876265",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rUKoQ1Zhn6c8EfPsaVa2Yx5NqaKN1JQSvq",
        "sequence": 262664,
        "makerExchangeRate": "0.0002374071856720401"
      },
      "data": {
        "Account": "rUKoQ1Zhn6c8EfPsaVa2Yx5NqaKN1JQSvq",
        "BookDirectory": "20294C923E80A51B487EB9547B3835FD483748B170D2D0A451086F34ADB0EA11",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "000000000000001D",
        "PreviousTxnID": "54CE0B2783AF973718FAFA35E864A3C172BE488EBBB6F2852611C6DAC8893BDF",
        "PreviousTxnLgrSeq": 43127875,
        "Sequence": 262664,
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.71085738"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.00016876265"
        },
        "index": "2D4ED103D6B3FEFA21BC385C53B63359F5678E5AA5429DDE6E1D8FE8B41CD6A8",
        "owner_funds": "142.8821425048244",
        "quality": "0.0002374071856720401"
      }
    },
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "USD",
          "value": "1.6438778",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.00039462656",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rpmL45YbZWKgp8AH8EjBSknWo5c8dNuuBM",
        "sequence": 231483,
        "makerExchangeRate": "0.0002400583303698121"
      },
      "data": {
        "Account": "rpmL45YbZWKgp8AH8EjBSknWo5c8dNuuBM",
        "BookDirectory": "20294C923E80A51B487EB9547B3835FD483748B170D2D0A4510887515B1216C9",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000001",
        "PreviousTxnID": "6FA370F52C45F6149482156FF7B4226713AECE991FB7D053F74172CB0B8F24E9",
        "PreviousTxnLgrSeq": 43127158,
        "Sequence": 231483,
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "1.6438778"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.00039462656"
        },
        "index": "735F9661AD006BA0776859BE371D445555FC0815604603AC056469C16AC84AE3",
        "owner_funds": "166.0316626329364",
        "quality": "0.0002400583303698121"
      }
    },
    // ... trimmed for brevity ...
  ]
}
```


# API Methods

## connect

`connect(): Promise<void>`

Tells the RippleAPI instance to connect to its rippled server.

### Parameters

This method has no parameters.

### Return Value

This method returns a promise that resolves with a void value when a connection is established.

### Example

See [Boilerplate](#boilerplate) for code sample.

## disconnect

`disconnect(): Promise<void>`

Tells the RippleAPI instance to disconnect from its rippled server.

### Parameters

This method has no parameters.

### Return Value

This method returns a promise that resolves with a void value when a connection is destroyed.

### Example

See [Boilerplate](#boilerplate) for code sample

## isConnected

`isConnected(): boolean`

Checks if the RippleAPI instance is connected to its rippled server.

### Parameters

This method has no parameters.

### Return Value

This method returns `true` if connected and `false` if not connected.

### Example

```javascript
return api.isConnected();
```

```json
true
```

## getServerInfo

`getServerInfo(): Promise<object>`

Get status information about the server that the RippleAPI instance is connected to.

### Parameters

This method has no parameters.

### Return Value

This method returns a promise that resolves with an object with the following structure:

Name | Type | Description
---- | ---- | -----------
buildVersion | string | The version number of the running rippled version.
completeLedgers | string | Range expression indicating the sequence numbers of the ledger versions the local rippled has in its database. It is possible to be a disjoint sequence, e.g. “2500-5000,32570-7695432”.
hostID | string | On an admin request, returns the hostname of the server running the rippled instance; otherwise, returns a unique four letter word.
ioLatencyMs | number | Amount of time spent waiting for I/O operations, in milliseconds. If this number is not very, very low, then the rippled server is probably having serious load issues.
lastClose | object | Information about the last time the server closed a ledger.
*lastClose.* convergeTimeS | number | The time it took to reach a consensus for the last ledger closing, in seconds.
*lastClose.* proposers | integer | Number of trusted validators participating in the ledger closing.
loadFactor | number | The load factor the server is currently enforcing, as a multiplier on the base transaction fee. The load factor is determined by the highest of the individual server’s load factor, cluster’s load factor, and the overall network’s load factor.
peers | integer | How many other rippled servers the node is currently connected to.
pubkeyNode | string | Public key used to verify this node for internal communications; this key is automatically generated by the server the first time it starts up.
serverState | string | A string indicating to what extent the server is participating in the network. See [Possible Server States](https://xrpl.org/rippled-server-states.html) for more details.
validatedLedger | object | Information about the fully-validated ledger with the highest sequence number (the most recent).
*validatedLedger.* age | integer | The time since the ledger was closed, in seconds.
*validatedLedger.* baseFeeXRP | [value](#value) | Base fee, in XRP. This may be represented in scientific notation such as 1e-05 for 0.00005.
*validatedLedger.* hash | string | Unique hash for the ledger, as an uppercase hexadecimal string.
*validatedLedger.* reserveBaseXRP | [value](#value) | Minimum amount of XRP necessary for every account to keep in reserve.
*validatedLedger.* reserveIncrementXRP | [value](#value) | Amount of XRP added to the account reserve for each object an account owns in the ledger.
*validatedLedger.* ledgerVersion | integer | Identifying ledger index of this ledger version.
validationQuorum | number | Minimum number of trusted validations required to validate a ledger version. Some circumstances may cause the server to require more validations.
load | object | *Optional* *(Admin only)* Detailed information about the current load state of the server.
*load.* jobTypes | array\<object\> | *(Admin only)* Information about the rate of different types of jobs the server is doing and how much time it spends on each.
*load.* threads | number | *(Admin only)* The number of threads in the server’s main job pool, performing various operations.
pubkeyValidator | string | *Optional* *(Admin only)* Public key used by this node to sign ledger validations.

### Example

```javascript
return api.getServerInfo().then(info => {/* ... */});
```


```json
{
  "buildVersion": "0.24.0-rc1",
  "completeLedgers": "32570-6595042",
  "hostID": "ARTS",
  "ioLatencyMs": 1,
  "lastClose": {
    "convergeTimeS": 2.007,
    "proposers": 4
  },
  "loadFactor": 1,
  "peers": 53,
  "pubkeyNode": "n94wWvFUmaKGYrKUGgpv1DyYgDeXRGdACkNQaSe7zJiy5Znio7UC",
  "serverState": "full",
  "validatedLedger": {
    "age": 5,
    "baseFeeXRP": "0.00001",
    "hash": "4482DEE5362332F54A4036ED57EE1767C9F33CF7CE5A6670355C16CECE381D46",
    "reserveBaseXRP": "20",
    "reserveIncrementXRP": "5",
    "ledgerVersion": 6595042
  },
  "validationQuorum": 3
}
```


## getFee

`getFee(): Promise<string>`

Returns the estimated transaction fee for the rippled server the RippleAPI instance is connected to.

This uses the [feeCushion parameter](#parameters) provided to the RippleAPI constructor, or the default value of `1.2`.

### Parameters

Name | Type | Description
---- | ---- | -----------
cushion | number | *Optional* The fee is the product of the base fee, the `load_factor`, and this cushion. Default is provided by the `RippleAPI` constructor's `feeCushion`.

### Return Value

This method returns a promise that resolves with a string-encoded floating point value representing the estimated fee to submit a transaction, expressed in XRP.

### Example

```javascript
return api.getFee().then(fee => {/* ... */});
```

```json
"0.000012"
```

## getLedgerVersion

`getLedgerVersion(): Promise<number>`

Returns the most recent validated ledger version number known to the connected server.

### Parameters

This method has no parameters.

### Return Value

This method returns a promise that resolves with a positive integer representing the most recent validated ledger version number known to the connected server.

### Example

```javascript
return api.getLedgerVersion().then(ledgerVersion => {
  /* ... */
});
```

```json
16869039
```


## getTransaction

`getTransaction(id: string, options: object): Promise<object>`

Retrieves a transaction by its [Transaction ID](#transaction-id).

### Parameters

Name | Type | Description
---- | ---- | -----------
id | [transactionHash](#transaction-id) | A hash of a transaction used to identify the transaction, represented in hexadecimal.
options | object | *Optional* Options to limit the ledger versions to search or include raw transaction data.
*options.* includeRawTransaction | object | *Optional* Include raw transaction data. For advanced users; exercise caution when interpreting this data.
*options.* maxLedgerVersion | integer | *Optional* The highest ledger version to search. This must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*options.* maxLedgerVersion | string | *Optional* The highest ledger version to search. This must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*options.* minLedgerVersion | integer | *Optional* The lowest ledger version to search. This must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*options.* minLedgerVersion | string | *Optional* The lowest ledger version to search. This must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.

### Return Value

This method returns a promise that resolves with a transaction object containing the following fields.

Name | Type | Description
---- | ---- | -----------
id | [transactionHash](#transaction-id) | A hash of the transaction that can be used to identify it.
address | [address](#address) | The address of the account that initiated the transaction.
sequence | [sequence](#account-sequence-number) | The account sequence number of the transaction for the account that initiated it.
type | [transactionType](#transaction-types) | The type of the transaction.
specification | object | A specification that would produce the same outcome as this transaction. *Exception:* For payment transactions, this omits the `destination.amount` field, to prevent misunderstanding. The structure of the specification depends on the value of the `type` field (see [Transaction Types](#transaction-types) for details). *Note:* This is **not** necessarily the same as the original specification.
outcome | object | The outcome of the transaction (what effects it had).
*outcome.* result | string | Result code returned by rippled. See [Transaction Results](https://xrpl.org/transaction-results.html) for a complete list.
*outcome.* fee | [value](#value) | The XRP fee that was charged for the transaction.
*outcome.balanceChanges.* \* | array\<[balance](#amount)\> | Key is the XRP Ledger address; value is an array of signed amounts representing changes of balances for that address.
*outcome.orderbookChanges.* \* | array | Key is the maker's XRP Ledger address; value is an array of changes
*outcome.orderbookChanges.* \*[] | object | A change to an order.
*outcome.orderbookChanges.\*[].* direction | string | Equal to "buy" for buy orders and "sell" for sell orders.
*outcome.orderbookChanges.\*[].* quantity | [amount](#amount) | The amount to be bought or sold by the maker.
*outcome.orderbookChanges.\*[].* totalPrice | [amount](#amount) | The total amount to be paid or received by the taker.
*outcome.orderbookChanges.\*[].* sequence | [sequence](#account-sequence-number) | The order sequence number, used to identify the order for cancellation
*outcome.orderbookChanges.\*[].* status | string | The status of the order. One of "created", "filled", "partially-filled", "cancelled".
*outcome.orderbookChanges.\*[].* expirationTime | date-time string | *Optional* The time after which the order expires, if any.
*outcome.orderbookChanges.\*[].* makerExchangeRate | [value](#value) | *Optional* The exchange rate between the `quantity` currency and the `totalPrice` currency from the point of view of the maker.
*outcome.* ledgerVersion | integer | The ledger version that the transaction was validated in.
*outcome.* ledgerVersion | string | The ledger version that the transaction was validated in.
*outcome.* indexInLedger | integer | The ordering index of the transaction in the ledger.
*outcome.* channelChanges | object | *Optional* Properties reflecting the details of the payment channel.
*outcome.* deliveredAmount | [amount](#amount) | *Optional* For payment transactions, it is impossible to reliably compute the actual delivered amount from the balanceChanges due to fixed precision. If the payment is not a partial payment and the transaction succeeded, the deliveredAmount should always be considered to be the amount specified in the transaction.
*outcome.* timestamp | date-time string | *Optional* The timestamp when the transaction was validated. (May be missing when requesting transactions in binary mode.)
rawTransaction | string | *Optional* The raw transaction data as a JSON string. For advanced users only; exercise caution when interpreting this data.

### Example

```javascript
const id = '01CDEAA89BF99D97DFD47F79A0477E1DCC0989D39F70E8AACBFE68CC83BD1E94';
return api.getTransaction(id).then(transaction => {
  /* ... */
});
```


```json
{
  "type": "payment",
  "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "sequence": 4,
  "id": "F4AB442A6D4CBB935D66E1DA7309A5FC71C7143ED4049053EC14E3875B0CF9BF",
  "specification": {
    "source": {
      "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "maxAmount": {
        "currency": "XRP",
        "value": "1.112209"
      }
    },
    "destination": {
      "address": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
    },
    "paths": "[[{\"currency\":\"USD\",\"issuer\":\"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo\",\"type\":48,\"type_hex\":\"0000000000000030\"},{\"account\":\"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo\",\"currency\":\"USD\",\"issuer\":\"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo\",\"type\":49,\"type_hex\":\"0000000000000031\"}]]"
  },
  "outcome": {
    "result": "tesSUCCESS",
    "timestamp": "2013-03-12T23:56:50.000Z",
    "fee": "0.00001",
    "deliveredAmount": {
      "currency": "USD",
      "value": "0.001",
      "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
    },
    "balanceChanges": {
      "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo": [
        {
          "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM",
          "currency": "USD",
          "value": "-0.001"
        },
        {
          "counterparty": "r9tGqzZgKxVFvzKFdUqXAqTzazWBUia8Qr",
          "currency": "USD",
          "value": "0.001002"
        }
      ],
      "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM": [
        {
          "counterparty": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
          "currency": "USD",
          "value": "0.001"
        }
      ],
      "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59": [
        {
          "currency": "XRP",
          "value": "-1.101208"
        }
      ],
      "r9tGqzZgKxVFvzKFdUqXAqTzazWBUia8Qr": [
        {
          "currency": "XRP",
          "value": "1.101198"
        },
        {
          "counterparty": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
          "currency": "USD",
          "value": "-0.001002"
        }
      ]
    },
    "orderbookChanges": {
      "r9tGqzZgKxVFvzKFdUqXAqTzazWBUia8Qr": [
        {
          "direction": "buy",
          "quantity": {
            "currency": "XRP",
            "value": "1.101198"
          },
          "totalPrice": {
            "currency": "USD",
            "counterparty": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
            "value": "0.001002"
          },
          "makerExchangeRate": "1099",
          "sequence": 58,
          "status": "partially-filled"
        }
      ]
    },
    "ledgerVersion": 348860,
    "indexInLedger": 0
  }
}
```


## getTransactions

`getTransactions(address: string, options: object): Promise<Array<object>>`

Retrieves historical transactions of an account.

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account to get transactions for.
options | object | *Optional* Options to filter the resulting transactions.
*options.* binary | boolean | *Optional* If true, return transactions in binary format rather than JSON.
*options.* counterparty | [address](#address) | *Optional* If provided, only return transactions with this account as a counterparty to the transaction.
*options.* earliestFirst | boolean | *Optional* If true, sort transactions so that the earliest ones come first. By default, the newest transactions come first.
*options.* excludeFailures | boolean | *Optional* If true, the result omits transactions that did not succeed.
*options.* includeRawTransactions | object | *Optional* Include raw transaction data. For advanced users; exercise caution when interpreting this data. 
*options.* initiated | boolean | *Optional* If true, return only transactions initiated by the account specified by `address`. If false, return only transactions not initiated by the account specified by `address`.
*options.* limit | integer | *Optional* If specified, return at most this many transactions.
*options.* maxLedgerVersion | integer | *Optional* Return only transactions in this ledger version or lower.
*options.* maxLedgerVersion | string | *Optional* Return only transactions in this ledger version or lower.
*options.* minLedgerVersion | integer | *Optional* Return only transactions in this ledger version or higher.
*options.* minLedgerVersion | string | *Optional* Return only transactions in this ledger version or higher.
*options.* start | string | *Optional* If specified, start the results from this transaction. You cannot use `start` with `minLedgerVersion` or `maxLedgerVersion`. When `start` is specified, these ledger versions are determined internally.
*options.* types | array\<[transactionType](#transaction-types)\> | *Optional* Only return transactions of the specified [Transaction Types](#transaction-types).

### Return Value

This method returns a promise that resolves with an array of transaction object in the same format as [getTransaction](#gettransaction).

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
return api.getTransactions(address).then(transaction => {
  /* ... */
});
```


```json
[
  {
    "type": "payment",
    "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "sequence": 4,
    "id": "99404A34E8170319521223A6C604AF48B9F1E3000C377E6141F9A1BF60B0B865",
    "specification": {
      "memos": [
        {
          "type": "client",
          "format": "rt1.5.2"
        }
      ],
      "source": {
        "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "maxAmount": {
          "currency": "XRP",
          "value": "1.112209"
        }
      },
      "destination": {
        "address": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
      },
      "paths": "[[{\"issuer\":\"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo\",\"currency\":\"USD\"},{\"account\":\"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo\",\"issuer\":\"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo\",\"currency\":\"USD\"}]]"
    },
    "outcome": {
      "result": "tesSUCCESS",
      "timestamp": "2019-04-01T07:39:01.000Z",
      "fee": "0.00001",
      "deliveredAmount": {
        "currency": "USD",
        "value": "0.001",
        "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
      },
      "balanceChanges": {
        "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo": [
          {
            "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM",
            "currency": "USD",
            "value": "-0.001"
          },
          {
            "counterparty": "r9tGqzZgKxVFvzKFdUqXAqTzazWBUia8Qr",
            "currency": "USD",
            "value": "0.001002"
          }
        ],
        "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM": [
          {
            "counterparty": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
            "currency": "USD",
            "value": "0.001"
          }
        ],
        "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59": [
          {
            "currency": "XRP",
            "value": "-1.101208"
          }
        ],
        "r9tGqzZgKxVFvzKFdUqXAqTzazWBUia8Qr": [
          {
            "currency": "XRP",
            "value": "1.101198"
          },
          {
            "counterparty": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
            "currency": "USD",
            "value": "-0.001002"
          }
        ]
      },
      "orderbookChanges": {
        "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59": [
          {
            "direction": "buy",
            "quantity": {
              "currency": "XRP",
              "value": "1.101198"
            },
            "totalPrice": {
              "currency": "USD",
              "counterparty": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
              "value": "0.001002"
            },
            "makerExchangeRate": "1099",
            "sequence": 58,
            "status": "partially-filled"
          }
        ]
      },
      "ledgerVersion": 348859,
      "indexInLedger": 0
    }
  },
  {
    "type": "payment",
    "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "id": "99404A34E8170319521223A6C604AF48B9F1E3000C377E6141F9A1BF60B0B865",
    "sequence": 4,
    "specification": {
      "memos": [
        {
          "type": "client",
          "format": "rt1.5.2"
        }
      ],
      "source": {
        "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "maxAmount": {
          "currency": "XRP",
          "value": "1.112209"
        }
      },
      "destination": {
        "address": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
      },
      "paths": "[[{\"issuer\":\"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo\",\"currency\":\"USD\"},{\"account\":\"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo\",\"issuer\":\"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo\",\"currency\":\"USD\"}]]"
    },
    "outcome": {
      "result": "tesSUCCESS",
      "timestamp": "2019-04-01T07:39:01.000Z",
      "fee": "0.00001",
      "deliveredAmount": {
        "currency": "USD",
        "value": "0.001",
        "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
      },
      "balanceChanges": {
        "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo": [
          {
            "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM",
            "currency": "USD",
            "value": "-0.001"
          },
          {
            "counterparty": "r9tGqzZgKxVFvzKFdUqXAqTzazWBUia8Qr",
            "currency": "USD",
            "value": "0.001002"
          }
        ],
        "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM": [
          {
            "counterparty": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
            "currency": "USD",
            "value": "0.001"
          }
        ],
        "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59": [
          {
            "currency": "XRP",
            "value": "-1.101208"
          }
        ],
        "r9tGqzZgKxVFvzKFdUqXAqTzazWBUia8Qr": [
          {
            "currency": "XRP",
            "value": "1.101198"
          },
          {
            "counterparty": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
            "currency": "USD",
            "value": "-0.001002"
          }
        ]
      },
      "orderbookChanges": {
        "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59": [
          {
            "direction": "buy",
            "quantity": {
              "currency": "XRP",
              "value": "1.101198"
            },
            "totalPrice": {
              "currency": "USD",
              "counterparty": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
              "value": "0.001002"
            },
            "makerExchangeRate": "1099",
            "sequence": 58,
            "status": "partially-filled"
          }
        ]
      },
      "ledgerVersion": 348858,
      "indexInLedger": 0
    }
  }
]
```


## getTrustlines

`getTrustlines(address: string, options: object): Promise<Array<object>>`

Returns trustlines for a specified account.

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account to get trustlines for.
options | object | *Optional* Options to filter and determine which trustlines to return.
*options.* counterparty | [address](#address) | *Optional* Only return trustlines with this counterparty.
*options.* currency | [currency](#currency) | *Optional* Only return trustlines for this currency.
*options.* ledgerVersion | integer | *Optional* Return trustlines as they were in this historical ledger version.
*options.* ledgerVersion | string | *Optional* Return trustlines as they were in this historical ledger version.
*options.* limit | integer | *Optional* Return at most this many trustlines.

### Return Value

This method returns a promise that resolves with an array of objects with the following structure.

Name | Type | Description
---- | ---- | -----------
specification | [trustline](#trustline) | A trust line specification that would produce this trust line in its current state.
counterparty | object | Properties of the trustline from the perspective of the counterparty.
*counterparty.* limit | [value](#value) | The maximum amount that the counterparty can be owed through the trust line.
*counterparty.* authorized | boolean | *Optional* If true, the counterparty authorizes this party to hold issuances from the counterparty.
*counterparty.* frozen | boolean | *Optional* If true, the trust line is frozen, which means that funds can only be sent directly to the counterparty.
*counterparty.* ripplingDisabled | boolean | *Optional* If true, payments cannot ripple through this trustline.
state | object | Non-settings details of the trust line's state.
*state.* balance | [signedValue](#value) | The balance on the trust line, representing which party owes the other and by how much.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
return api.getTrustlines(address).then(trustlines =>
  {/* ... */});
```


```json
[
  {
    "specification": {
      "limit": "5",
      "currency": "USD",
      "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
      "ripplingDisabled": true,
      "frozen": true
    },
    "counterparty": {
      "limit": "0"
    },
    "state": {
      "balance": "2.497605752725159"
    }
  },
  {
    "specification": {
      "limit": "5000",
      "currency": "USD",
      "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    },
    "counterparty": {
      "limit": "0"
    },
    "state": {
      "balance": "0"
    }
  },
  {
    "specification": {
      "limit": "1",
      "currency": "USD",
      "counterparty": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun"
    },
    "counterparty": {
      "limit": "0"
    },
    "state": {
      "balance": "1"
    }
  },
  {
    "specification": {
      "limit": "1",
      "currency": "USD",
      "counterparty": "r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X",
      "ripplingDisabled": true
    },
    "counterparty": {
      "limit": "0"
    },
    "state": {
      "balance": "0"
    }
  },
  {
    "specification": {
      "limit": "500",
      "currency": "USD",
      "counterparty": "rfF3PNkwkq1DygW2wum2HK3RGfgkJjdPVD",
      "ripplingDisabled": true
    },
    "counterparty": {
      "limit": "0"
    },
    "state": {
      "balance": "35"
    }
  },
  {
    "specification": {
      "limit": "0",
      "currency": "USD",
      "counterparty": "rE6R3DWF9fBD7CyiQciePF9SqK58Ubp8o2"
    },
    "counterparty": {
      "limit": "100",
      "ripplingDisabled": true
    },
    "state": {
      "balance": "0"
    }
  },
  {
    "specification": {
      "limit": "0",
      "currency": "USD",
      "counterparty": "rEhDDUUNxpXgEHVJtC2cjXAgyx5VCFxdMF",
      "frozen": true
    },
    "counterparty": {
      "limit": "1"
    },
    "state": {
      "balance": "0"
    }
  }
]
```


## getBalances

`getBalances(address: string, options: object): Promise<Array<object>>`

Returns balances for a specified account.

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account to get balances for.
options | object | *Optional* Options to filter and determine which balances to return.
*options.* counterparty | [address](#address) | *Optional* Only return balances with this counterparty.
*options.* currency | [currency](#currency) | *Optional* Only return balances for this currency.
*options.* ledgerVersion | integer | *Optional* Return balances as they were in this historical ledger version.
*options.* ledgerVersion | string | *Optional* Return balances as they were in this historical ledger version.
*options.* limit | integer | *Optional* Return at most this many balances.

### Return Value

This method returns a promise that resolves with an array of objects with the following structure:

Name | Type | Description
---- | ---- | -----------
currency | [currency](#currency) | The three-character code or hexadecimal string used to denote currencies
value | [signedValue](#value) | The balance on the trustline
counterparty | [address](#address) | *Optional* The XRP Ledger address of the account that owes or is owed the funds.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
return api.getBalances(address).then(balances =>
  {/* ... */});
```


```json
[
  {
    "value": "922.913243",
    "currency": "XRP"
  },
  {
    "value": "0",
    "currency": "ASP",
    "counterparty": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z"
  },
  {
    "value": "0",
    "currency": "XAU",
    "counterparty": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z"
  },
  {
    "value": "2.497605752725159",
    "currency": "USD",
    "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
  },
  {
    "value": "481.992867407479",
    "currency": "MXN",
    "counterparty": "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4"
  },
  {
    "value": "0.793598266778297",
    "currency": "EUR",
    "counterparty": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun"
  },
  {
    "value": "0",
    "currency": "CNY",
    "counterparty": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK"
  },
  {
    "value": "1.294889190631542",
    "currency": "DYM",
    "counterparty": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E"
  },
  {
    "value": "0.3488146605801446",
    "currency": "CHF",
    "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  {
    "value": "2.114103174931847",
    "currency": "BTC",
    "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  {
    "value": "0",
    "currency": "USD",
    "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  {
    "value": "-0.00111",
    "currency": "BTC",
    "counterparty": "rpgKWEmNqSDAGFhy5WDnsyPqfQxbWxKeVd"
  },
  {
    "value": "-0.1010780000080207",
    "currency": "BTC",
    "counterparty": "rBJ3YjwXi2MGbg7GVLuTXUWQ8DjL7tDXh4"
  },
  {
    "value": "1",
    "currency": "USD",
    "counterparty": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun"
  },
  {
    "value": "8.07619790068559",
    "currency": "CNY",
    "counterparty": "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA"
  },
  {
    "value": "7.292695098901099",
    "currency": "JPY",
    "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  {
    "value": "0",
    "currency": "AUX",
    "counterparty": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z"
  },
  {
    "value": "0",
    "currency": "USD",
    "counterparty": "r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X"
  },
  {
    "value": "12.41688780720394",
    "currency": "EUR",
    "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  {
    "value": "35",
    "currency": "USD",
    "counterparty": "rfF3PNkwkq1DygW2wum2HK3RGfgkJjdPVD"
  },
  {
    "value": "-5",
    "currency": "JOE",
    "counterparty": "rwUVoVMSURqNyvocPCcvLu3ygJzZyw8qwp"
  },
  {
    "value": "0",
    "currency": "USD",
    "counterparty": "rE6R3DWF9fBD7CyiQciePF9SqK58Ubp8o2"
  },
  {
    "value": "0",
    "currency": "JOE",
    "counterparty": "rE6R3DWF9fBD7CyiQciePF9SqK58Ubp8o2"
  },
  {
    "value": "0",
    "currency": "015841551A748AD2C1F76FF6ECB0CCCD00000000",
    "counterparty": "rs9M85karFkCRjvc6KMWn8Coigm9cbcgcx"
  },
  {
    "value": "0",
    "currency": "USD",
    "counterparty": "rEhDDUUNxpXgEHVJtC2cjXAgyx5VCFxdMF"
  }
]
```


## getBalanceSheet

`getBalanceSheet(address: string, options: object): Promise<object>`

Returns aggregate balances by currency plus a breakdown of assets and obligations for a specified account.

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The XRP Ledger address of the account to get the balance sheet of.
options | object | *Optional* Options to determine how the balances are calculated.
*options.* excludeAddresses | array\<[address](#address)\> | *Optional* Addresses to exclude from the balance totals.
*options.* ledgerVersion | integer | *Optional* Get the balance sheet as of this historical ledger version.
*options.* ledgerVersion | string | *Optional* Get the balance sheet as of this historical ledger version.

### Return Value

This method returns a promise that resolves with an object with the following structure:

Name | Type | Description
---- | ---- | -----------
assets | array\<[amount](#amount)\> | *Optional* Total amounts held that are issued by others. For the recommended gateway configuration, there should be none.
balances | array\<[amount](#amount)\> | *Optional* Amounts issued to the "hotwallet" accounts from the request. The keys are the accounts' addresses, and the values are arrays of currency amounts they hold. The issuer (omitted from the currency amounts) is the account from the request.
obligations | array | *Optional* Total amounts issued to accounts that are not hot wallets, as a map of currencies to the total value issued.
obligations[] | object | An amount that is owed.
*obligations[].* currency | [currency](#currency) | The three-character code or hexadecimal string used to denote currencies
*obligations[].* value | [value](#value) | A string representation of a non-negative floating point number

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
return api.getBalanceSheet(address).then(balanceSheet =>
  {/* ... */});
```


```json
{
  "balances": [
    {
    "counterparty": "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ",
    "currency": "EUR",
    "value": "29826.1965999999"
  },
  {
    "counterparty": "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ",
    "currency": "USD",
    "value": "10.0"
  },
  {
    "counterparty": "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt",
    "currency": "USD",
    "value": "13857.70416"
  }
  ],
  "assets": [
    {
    "counterparty": "r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH",
    "currency": "BTC",
    "value": "5444166510000000e-26"
  },
  {
    "counterparty": "r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH",
    "currency": "USD",
    "value": "100.0"
  },
  {
    "counterparty": "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6",
    "currency": "BTC",
    "value": "8700000000000000e-30"
  }
  ],
  "obligations": [
    {
      "currency": "BTC",
      "value": "5908.324927635318"
    },
    {
      "currency": "EUR",
      "value": "992471.7419793958"
    },
    {
      "currency": "GBP",
      "value": "4991.38706013193"
    },
    {
      "currency": "USD",
      "value": "1997134.20229482"
    }
  ]
}
```


## getPaths

`getPaths(pathfind: object): Promise<Array<object>>`

Finds paths to send a payment. Paths are options for how to route a payment.

### Parameters

Name | Type | Description
---- | ---- | -----------
pathfind | object | Specification of a pathfind request.
*pathfind.* source | object | Properties of the source of funds.
*pathfind.source.* address | [address](#address) | The XRP Ledger address of the planned sender.
*pathfind.source.* amount | [laxAmount](#amount) | *Optional* The amount of funds to send.
*pathfind.source.* currencies | array | *Optional* An array of currencies (with optional counterparty) that may be used in the payment paths.
*pathfind.source.* currencies[] | object | A currency with optional counterparty.
*pathfind.source.currencies[].* currency | [currency](#currency) | The three-character code or hexadecimal string used to denote currencies
*pathfind.source.currencies[].* counterparty | [address](#address) | *Optional* The counterparty for the currency; if omitted any counterparty may be used.
*pathfind.* destination | object | Properties of the destination of funds.
*pathfind.destination.* address | [address](#address) | An address representing the destination of the transaction.
*pathfind.destination.* amount | [laxLaxAmount](#amount) | The amount to be received by the receiver (`value` may be ommitted if a source amount is specified).

### Return Value

This method returns a promise that resolves with an array of objects with the following structure:

Name | Type | Description
---- | ---- | -----------
source | object | Properties of the source of the payment.
*source.* address | [address](#address) | The address to send from.
*source.* amount | [laxAmount](#amount) | An exact amount to send. If the counterparty is not specified, amounts with any counterparty may be used. (This field cannot be used with source.maxAmount)
*source.* tag | integer | *Optional* An arbitrary 32-bit unsigned integer. It typically maps to an off-ledger account; for example, a hosted wallet or exchange account.
*source.* maxAmount | [laxAmount](#amount) | The maximum amount to send. (This field cannot be used with source.amount)
destination | object | Properties of the destination of the payment.
*destination.* address | [address](#address) | An address representing the destination of the transaction.
*destination.* amount | [laxAmount](#amount) | An exact amount to deliver to the recipient. If the counterparty is not specified, amounts with any counterparty may be used. (This field cannot be used with `destination.minAmount`.)
*destination.* tag | integer | *Optional* An arbitrary 32-bit unsigned integer. It typically maps to an off-ledger account; for example, a hosted wallet or exchange account.
*destination.* minAmount | [laxAmount](#amount) | The minimum amount to be delivered. (This field cannot be used with destination.amount)
paths | string | The paths of trustlines and orders to use in executing the payment.

### Example

```javascript
const pathfind = {
  "source": {
    "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
  },
  "destination": {
    "address": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
    "amount": {
      "currency": "USD",
      "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM",
      "value": "100"
    }
  }
};
return api.getPaths(pathfind)
  .then(paths => {/* ... */});
```


```json
[
  {
    "source": {
      "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "maxAmount": {
        "currency": "JPY",
        "value": "0.1117218827811721"
      }
    },
    "destination": {
      "address": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
      "amount": {
        "currency": "USD",
        "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM",
        "value": "100"
      }
    },
    "paths": "[[{\"account\":\"rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6\"},{\"currency\":\"USD\",\"issuer\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"},{\"account\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"}],[{\"account\":\"rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6\"},{\"currency\":\"XRP\"},{\"currency\":\"USD\",\"issuer\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"},{\"account\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"}],[{\"account\":\"rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6\"},{\"currency\":\"XRP\"},{\"currency\":\"USD\",\"issuer\":\"rpHgehzdpfWRXKvSv6duKvVuo1aZVimdaT\"},{\"account\":\"rpHgehzdpfWRXKvSv6duKvVuo1aZVimdaT\"},{\"account\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"}],[{\"account\":\"rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6\"},{\"currency\":\"XRP\"},{\"currency\":\"USD\",\"issuer\":\"rHHa9t2kLQyXRbdLkSzEgkzwf9unmFgZs9\"},{\"account\":\"rHHa9t2kLQyXRbdLkSzEgkzwf9unmFgZs9\"},{\"account\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"}]]"
  },
  {
    "source": {
      "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "maxAmount": {
        "currency": "USD",
        "value": "0.001002"
      }
    },
    "destination": {
      "address": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
      "amount": {
        "currency": "USD",
        "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM",
        "value": "100"
      }
    },
    "paths": "[[{\"account\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"}],[{\"account\":\"rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q\"},{\"currency\":\"USD\",\"issuer\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"},{\"account\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"}],[{\"account\":\"rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q\"},{\"currency\":\"XRP\"},{\"currency\":\"USD\",\"issuer\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"},{\"account\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"}],[{\"account\":\"rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q\"},{\"currency\":\"XRP\"},{\"currency\":\"USD\",\"issuer\":\"rpHgehzdpfWRXKvSv6duKvVuo1aZVimdaT\"},{\"account\":\"rpHgehzdpfWRXKvSv6duKvVuo1aZVimdaT\"},{\"account\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"}]]"
  },
  {
    "source": {
      "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "maxAmount": {
        "currency": "XRP",
        "value": "0.207669"
      }
    },
    "destination": {
      "address": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
      "amount": {
        "currency": "USD",
        "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM",
        "value": "100"
      }
    },
    "paths": "[[{\"currency\":\"USD\",\"issuer\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"},{\"account\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"}],[{\"currency\":\"USD\",\"issuer\":\"rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc\"},{\"account\":\"rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc\"},{\"account\":\"rf9X8QoYnWLHMHuDfjkmRcD2UE5qX5aYV\"},{\"account\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"}],[{\"currency\":\"USD\",\"issuer\":\"rDVdJ62foD1sn7ZpxtXyptdkBSyhsQGviT\"},{\"account\":\"rDVdJ62foD1sn7ZpxtXyptdkBSyhsQGviT\"},{\"account\":\"rfQPFZ3eLcaSUKjUy7A3LAmDNM4F9Hz9j1\"},{\"account\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"}],[{\"currency\":\"USD\",\"issuer\":\"rpHgehzdpfWRXKvSv6duKvVuo1aZVimdaT\"},{\"account\":\"rpHgehzdpfWRXKvSv6duKvVuo1aZVimdaT\"},{\"account\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"}]]"
  }
]
```


## getOrders

`getOrders(address: string, options: object): Promise<Array<object>>`

Returns open orders for the specified account. Open orders are orders that have not yet been fully executed and are still in the order book.

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The XRP Ledger address of the account to get open orders for.
options | object | *Optional* Options that determine what orders to return.
*options.* ledgerVersion | integer | *Optional* Return orders as of this historical ledger version.
*options.* ledgerVersion | string | *Optional* Return orders as of this historical ledger version.
*options.* limit | integer | *Optional* Return at most this many orders.

### Return Value

This method returns a promise that resolves with an array of objects with the following structure:

Name | Type | Description
---- | ---- | -----------
specification | [order](#order) | An order specification that would create an order equivalent to the current state of this order.
properties | object | Properties of the order not in the specification.
*properties.* maker | [address](#address) | The address of the account that submitted the order.
*properties.* sequence | [sequence](#account-sequence-number) | The account sequence number of the transaction that created this order.
*properties.* makerExchangeRate | [value](#value) | The exchange rate from the point of view of the account that submitted the order (also known as "quality").

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
return api.getOrders(address).then(orders =>
  {/* ... */});
```


```json
[
  {
    "specification": {
      "direction": "sell",
      "quantity": {
        "currency": "EUR",
        "value": "17.70155237781915",
        "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
      },
      "totalPrice": {
        "currency": "USD",
        "value": "1122.990930900328",
        "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 719930,
      "makerExchangeRate": "63.44025128030504"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "EUR",
        "value": "750",
        "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
      },
      "totalPrice": {
        "currency": "USD",
        "value": "19.11697137482289",
        "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 756999,
      "makerExchangeRate": "39.23215583132338"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "USD",
        "value": "19.50899530491766",
        "counterparty": "rpDMez6pm6dBve2TJsmDpv7Yae6V5Pyvy2"
      },
      "totalPrice": {
        "currency": "USD",
        "value": "18.46856867857617",
        "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 757002,
      "makerExchangeRate": "1.056334989703257"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "USD",
        "value": "1445.796633544794",
        "counterparty": "rpDMez6pm6dBve2TJsmDpv7Yae6V5Pyvy2"
      },
      "totalPrice": {
        "currency": "USD",
        "value": "14.40727807030772",
        "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 757003,
      "makerExchangeRate": "100.3518240218094"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "USD",
        "value": "750",
        "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
      },
      "totalPrice": {
        "currency": "NZD",
        "value": "9.178557969538755",
        "counterparty": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 782148,
      "makerExchangeRate": "81.7121820757743"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "USD",
        "value": "500",
        "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
      },
      "totalPrice": {
        "currency": "USD",
        "value": "9.94768291869523",
        "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 787368,
      "makerExchangeRate": "50.26296114247091"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "USD",
        "value": "10000",
        "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
      },
      "totalPrice": {
        "currency": "USD",
        "value": "9.994805759894176",
        "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 787408,
      "makerExchangeRate": "1000.519693952099"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "MXN",
        "value": "15834.53653918684",
        "counterparty": "rG6FZ31hDHN1K5Dkbma3PSB5uVCuVVRzfn"
      },
      "totalPrice": {
        "currency": "USD",
        "value": "11.67691646304319",
        "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 803438,
      "makerExchangeRate": "1356.054621894598"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "USD",
        "value": "3968.240250979598",
        "counterparty": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH"
      },
      "totalPrice": {
        "currency": "XAU",
        "value": "0.03206299605333101",
        "counterparty": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 807858,
      "makerExchangeRate": "123763.8630020459"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "USD",
        "value": "4139.022125516302",
        "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
      },
      "totalPrice": {
        "currency": "XAU",
        "value": "0.03347459066593226",
        "counterparty": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 807896,
      "makerExchangeRate": "123646.6837435794"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "XRP",
        "value": "115760.19"
      },
      "totalPrice": {
        "currency": "NZD",
        "value": "6.840555705",
        "counterparty": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 814018,
      "makerExchangeRate": "16922.62953364839"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "USD",
        "value": "902.4050961259154",
        "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
      },
      "totalPrice": {
        "currency": "EUR",
        "value": "14.40843766044656",
        "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 827522,
      "makerExchangeRate": "62.63032241192674"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "USD",
        "value": "181.4887131319798",
        "counterparty": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH"
      },
      "totalPrice": {
        "currency": "XAG",
        "value": "1.128432823485989",
        "counterparty": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 833591,
      "makerExchangeRate": "160.8325363767064"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "USD",
        "value": "1814.887131319799",
        "counterparty": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH"
      },
      "totalPrice": {
        "currency": "XAG",
        "value": "1.128432823485991",
        "counterparty": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 833592,
      "makerExchangeRate": "1608.325363767062"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "USD",
        "value": "118.6872603846736",
        "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
      },
      "totalPrice": {
        "currency": "XAG",
        "value": "0.7283371225235964",
        "counterparty": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 838954,
      "makerExchangeRate": "162.9564891233845"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "XAU",
        "value": "1",
        "counterparty": "r9Dr5xwkeLegBeXq6ujinjSBLQzQ1zQGjH"
      },
      "totalPrice": {
        "currency": "XRP",
        "value": "2229.229447"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 843730,
      "makerExchangeRate": "0.0004485854972648762"
    }
  },
  {
    "specification": {
      "direction": "buy",
      "quantity": {
        "currency": "EUR",
        "value": "750",
        "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
      },
      "totalPrice": {
        "currency": "USD",
        "value": "17.77537376072202",
        "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
      }
    },
    "properties": {
      "maker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "sequence": 844068,
      "makerExchangeRate": "42.19320561670911"
    }
  }
]
```


## getOrderbook

`getOrderbook(address: string, orderbook: object, options: object): Promise<object>`

Returns open orders for the specified account. Open orders are orders that have not yet been fully executed and are still in the order book.

**Breaking change:** In ripple-lib 1.1.0 and earlier, orders returned by this method were not sorted correctly. Orders are now sorted correctly, from best to worst.

**See also:** An alternative way to get orderbooks is with `request` and [`formatBidsAndAsks`](#formatbidsandasks).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | Address of an account to use as point-of-view. (This affects which unfunded offers are returned.)
orderbook | object | The order book to get.
*orderbook.* base | object | The currency code, and the counterparty if it's not XRP.
*orderbook.* counter | object | The currency code, and the counterparty if it's not XRP.
options | object | *Optional* Options to determine what to return.
*options.* ledgerVersion | integer | *Optional* Return the order book as of this historical ledger version.
*options.* ledgerVersion | string | *Optional* Return the order book as of this historical ledger version.
*options.* limit | integer | *Optional* Return at most this many orders from the order book.

### Return Value

This method returns a promise that resolves with an object with the following structure Both `bids` and `asks` have the same format:

Name | Type | Description
---- | ---- | -----------
bids | array | The buy orders in the order book.
bids[] | object | An order in the order book.
*bids[].* specification | [order](#order) | An order specification that would create an order equivalent to the current state of this order.
*bids[].* properties | object | Properties of the order not in the specification.
*bids[].properties.* maker | [address](#address) | The address of the account that submitted the order.
*bids[].properties.* sequence | [sequence](#account-sequence-number) | The account sequence number of the transaction that created this order.
*bids[].properties.* makerExchangeRate | [value](#value) | The exchange rate from the point of view of the account that submitted the order (also known as "quality").
*bids[].data.* \* | object | 
*bids[].* state | object | *Optional* The state of the order.
*bids[].state.* fundedAmount | [amount](#amount) | How much of the amount the maker would have to pay that the maker currently holds.
*bids[].state.* priceOfFundedAmount | [amount](#amount) | How much the `fundedAmount` would convert to through the exchange rate of this order.
asks | array | The sell orders in the order book.
asks[] | object | An order in the order book.
*asks[].* specification | [order](#order) | An order specification that would create an order equivalent to the current state of this order.
*asks[].* properties | object | Properties of the order not in the specification.
*asks[].properties.* maker | [address](#address) | The address of the account that submitted the order.
*asks[].properties.* sequence | [sequence](#account-sequence-number) | The account sequence number of the transaction that created this order.
*asks[].properties.* makerExchangeRate | [value](#value) | The exchange rate from the point of view of the account that submitted the order (also known as "quality").
*asks[].data.* \* | object | 
*asks[].* state | object | *Optional* The state of the order.
*asks[].state.* fundedAmount | [amount](#amount) | How much of the amount the maker would have to pay that the maker currently holds.
*asks[].state.* priceOfFundedAmount | [amount](#amount) | How much the `fundedAmount` would convert to through the exchange rate of this order.

**Raw order data:** The response includes a `data` property containing the raw order data. This may include `owner_funds`, `Flags`, and other fields.

For details, see the `rippled` [book_offers method](https://xrpl.org/book_offers.html).

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const orderbook = {
  "base": {
    "currency": "USD",
    "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  "counter": {
    "currency": "BTC",
    "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  }
};
return api.getOrderbook(address, orderbook)
  .then(orderbook => {/* ... */});
```


```json
{
  "bids": [
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "USD",
          "value": "93.030522464522",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.2849323720855092",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rwBYyfufTzk77zUSKEu4MvixfarC35av1J",
        "sequence": 386940,
        "makerExchangeRate": "326.5003614141928"
      },
      "data": {
        "Account": "rwBYyfufTzk77zUSKEu4MvixfarC35av1J",
        "BookDirectory": "6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC98570B9980E49C7DE8",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000008",
        "PreviousTxnID": "92DBA0BE18B331AC61FB277211477A255D3B5EA9C5FE689171DE689FB45FE18A",
        "PreviousTxnLgrSeq": 10714030,
        "Sequence": 386940,
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.2849323720855092"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "93.030522464522"
        },
        "index": "8092033091034D94219BC1131AF7A6B469D790D81831CB479AB6F67A32BE4E13",
        "owner_funds": "31.77682120227525",
        "quality": "326.5003614141928"
      }
    },
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "USD",
          "value": "1",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.00302447007930511",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rwjsRktX1eguUr1pHTffyHnC4uyrvX58V1",
        "sequence": 207855,
        "makerExchangeRate": "330.6364334177034"
      },
      "data": {
        "Account": "rwjsRktX1eguUr1pHTffyHnC4uyrvX58V1",
        "BookDirectory": "6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC98570BBF1EEFA2FB0A",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000000",
        "PreviousTxnID": "C6BDA152363E3CFE18688A6830B49F3DB2B05976110B5908EA4EB66D93DEEB1F",
        "PreviousTxnLgrSeq": 10714031,
        "Sequence": 207855,
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.00302447007930511"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "1"
        },
        "index": "8DB3520FF9CB16A0EA955056C49115F8CFB03A587D0A4AFC844F1D220EFCE0B9",
        "owner_funds": "0.0670537912615556",
        "quality": "330.6364334177034"
      }
    },
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "USD",
          "value": "99.34014894048333",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.3",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "expirationTime": "2014-12-25T01:14:43.000Z"
      },
      "properties": {
        "maker": "raudnGKfTK23YKfnS7ixejHrqGERTYNFXk",
        "sequence": 110103,
        "makerExchangeRate": "331.1338298016111"
      },
      "data": {
        "Account": "raudnGKfTK23YKfnS7ixejHrqGERTYNFXk",
        "BookDirectory": "6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC98570BC3A506FC016F",
        "BookNode": "0000000000000000",
        "Expiration": 472785283,
        "Flags": 131072,
        "LedgerEntryType": "Offer",
        "OwnerNode": "00000000000008F0",
        "PreviousTxnID": "77E763F1D02F58965CD1AD94F557B37A582FAC7760B71F391B856959836C2F7B",
        "PreviousTxnLgrSeq": 10713576,
        "Sequence": 110103,
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.3"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "99.34014894048333"
        },
        "index": "9ECDFD31B28643FD3A54658398C5715D6DAD574F83F04529CB24765770F9084D",
        "owner_funds": "4.021116654525635",
        "quality": "331.1338298016111"
      }
    },
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "USD",
          "value": "268.754",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.8095",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rPyYxUGK8L4dgEvjPs3aRc1B1jEiLr3Hx5",
        "sequence": 392,
        "makerExchangeRate": "332"
      },
      "state": {
        "fundedAmount": {
          "currency": "BTC",
          "value": "0.8078974385735969",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "priceOfFundedAmount": {
          "currency": "USD",
          "value": "268.2219496064341",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "data": {
        "Account": "rPyYxUGK8L4dgEvjPs3aRc1B1jEiLr3Hx5",
        "BookDirectory": "6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC98570BCB85BCA78000",
        "BookNode": "0000000000000000",
        "Flags": 131072,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000000",
        "PreviousTxnID": "D22993C68C94ACE3F2FCE4A334EBEA98CC46DCA92886C12B5E5B4780B5E17D4E",
        "PreviousTxnLgrSeq": 10711938,
        "Sequence": 392,
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.8095"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "268.754"
        },
        "index": "18B136E08EF50F0DEE8521EA22D16A950CD8B6DDF5F6E07C35F7FDDBBB09718D",
        "owner_funds": "0.8095132334507441",
        "quality": "332",
        "taker_gets_funded": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.8078974385735969"
        },
        "taker_pays_funded": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "268.2219496064341"
        }
      }
    },
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "USD",
          "value": "152.0098333185607",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.4499999999999999",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "expirationTime": "2014-12-25T01:14:44.000Z"
      },
      "properties": {
        "maker": "raudnGKfTK23YKfnS7ixejHrqGERTYNFXk",
        "sequence": 110105,
        "makerExchangeRate": "337.7996295968016"
      },
      "data": {
        "Account": "raudnGKfTK23YKfnS7ixejHrqGERTYNFXk",
        "BookDirectory": "6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC98570C00450D461510",
        "BookNode": "0000000000000000",
        "Expiration": 472785284,
        "Flags": 131072,
        "LedgerEntryType": "Offer",
        "OwnerNode": "00000000000008F0",
        "PreviousTxnID": "1F4D9D859D9AABA888C0708A572B38919A3AEF2C8C1F5A13F58F44C92E5FF3FB",
        "PreviousTxnLgrSeq": 10713576,
        "Sequence": 110105,
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.4499999999999999"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "152.0098333185607"
        },
        "index": "9F380E0B39E2AF8AA9608C3E39A5A8628E6D0F44385C6D12BE06F4FEC8D83351",
        "quality": "337.7996295968016"
      }
    },
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "USD",
          "value": "1.308365894430151",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.003768001830745216",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rDbsCJr5m8gHDCNEHCZtFxcXHsD4S9jH83",
        "sequence": 110061,
        "makerExchangeRate": "347.2306949944844"
      },
      "data": {
        "Account": "rDbsCJr5m8gHDCNEHCZtFxcXHsD4S9jH83",
        "BookDirectory": "6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC98570C560B764D760C",
        "BookNode": "0000000000000000",
        "Flags": 131072,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000001",
        "PreviousTxnID": "9A0B6B76F0D86614F965A2FFCC8859D8607F4E424351D4CFE2FBE24510F93F25",
        "PreviousTxnLgrSeq": 10708382,
        "Sequence": 110061,
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.003768001830745216"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "1.308365894430151"
        },
        "index": "B971769686CE1B9139502770158A4E7C011CFF8E865E5AAE5428E23AAA0E146D",
        "owner_funds": "0.2229210189326514",
        "quality": "347.2306949944844"
      }
    },
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "USD",
          "value": "176.3546101589987",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.5",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "expirationTime": "2014-12-25T00:41:38.000Z"
      },
      "properties": {
        "maker": "rDVBvAQScXrGRGnzrxRrcJPeNLeLeUTAqE",
        "sequence": 35788,
        "makerExchangeRate": "352.7092203179974"
      },
      "data": {
        "Account": "rDVBvAQScXrGRGnzrxRrcJPeNLeLeUTAqE",
        "BookDirectory": "6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC98570C87DF25DC4FC6",
        "BookNode": "0000000000000000",
        "Expiration": 472783298,
        "Flags": 131072,
        "LedgerEntryType": "Offer",
        "OwnerNode": "00000000000003D2",
        "PreviousTxnID": "E5F9A10F29A4BB3634D5A84FC96931E17267B58E0D2D5ADE24FFB751E52ADB9E",
        "PreviousTxnLgrSeq": 10713533,
        "Sequence": 35788,
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.5"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "176.3546101589987"
        },
        "index": "D2CB71038AD0ECAF4B5FF0A953AD1257225D0071E6F3AF9ADE67F05590B45C6E",
        "owner_funds": "6.617688680663627",
        "quality": "352.7092203179974"
      }
    },
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "USD",
          "value": "179.48",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.5",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rN6jbxx4H6NxcnmkzBxQnbCWLECNKrgSSf",
        "sequence": 491,
        "makerExchangeRate": "358.96"
      },
      "state": {
        "fundedAmount": {
          "currency": "BTC",
          "value": "0.499001996007984",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "priceOfFundedAmount": {
          "currency": "USD",
          "value": "179.1217564870259",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "data": {
        "Account": "rN6jbxx4H6NxcnmkzBxQnbCWLECNKrgSSf",
        "BookDirectory": "6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC98570CC0B8E0E2C000",
        "BookNode": "0000000000000000",
        "Flags": 131072,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000000",
        "PreviousTxnID": "2E16ACFEAC2306E3B3483D445787F3496FACF9504F7A5E909620C1A73E2EDE54",
        "PreviousTxnLgrSeq": 10558020,
        "Sequence": 491,
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.5"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "179.48"
        },
        "index": "DA853913C8013C9471957349EDAEE4DF4846833B8CCB92008E2A8994E37BEF0D",
        "owner_funds": "0.5",
        "quality": "358.96",
        "taker_gets_funded": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.499001996007984"
        },
        "taker_pays_funded": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "179.1217564870259"
        }
      }
    },
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "USD",
          "value": "288.7710263794967",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.8",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "expirationTime": "2014-12-25T00:41:39.000Z"
      },
      "properties": {
        "maker": "rDVBvAQScXrGRGnzrxRrcJPeNLeLeUTAqE",
        "sequence": 35789,
        "makerExchangeRate": "360.9637829743709"
      },
      "data": {
        "Account": "rDVBvAQScXrGRGnzrxRrcJPeNLeLeUTAqE",
        "BookDirectory": "6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC98570CD2F24C9C145D",
        "BookNode": "0000000000000000",
        "Expiration": 472783299,
        "Flags": 131072,
        "LedgerEntryType": "Offer",
        "OwnerNode": "00000000000003D2",
        "PreviousTxnID": "B1B12E47043B4260223A2C4240D19E93526B55B1DB38DEED335DACE7C04FEB23",
        "PreviousTxnLgrSeq": 10713534,
        "Sequence": 35789,
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.8"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "288.7710263794967"
        },
        "index": "B89AD580E908F7337CCBB47A0BAAC6417EF13AC3465E34E8B7DD3BED016EA833",
        "quality": "360.9637829743709"
      }
    },
    {
      "specification": {
        "direction": "buy",
        "quantity": {
          "currency": "USD",
          "value": "182.9814890090516",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.5",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rUeCeioKJkbYhv4mRGuAbZpPcqkMCoYq6N",
        "sequence": 5255,
        "makerExchangeRate": "365.9629780181032"
      },
      "state": {
        "fundedAmount": {
          "currency": "BTC",
          "value": "0.2254411038203033",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "priceOfFundedAmount": {
          "currency": "USD",
          "value": "82.50309772176658",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "data": {
        "Account": "rUeCeioKJkbYhv4mRGuAbZpPcqkMCoYq6N",
        "BookDirectory": "6EAB7C172DEFA430DBFAD120FDC373B5F5AF8B191649EC98570D0069F50EA028",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000012",
        "PreviousTxnID": "F0E8ABF07F83DF0B5EF5B417E8E29A45A5503BA8F26FBC86447CC6B1FAD6A1C4",
        "PreviousTxnLgrSeq": 10447672,
        "Sequence": 5255,
        "TakerGets": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.5"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "182.9814890090516"
        },
        "index": "D652DCE4B19C6CB43912651D3A975371D3B2A16A034EDF07BC11BF721AEF94A4",
        "owner_funds": "0.225891986027944",
        "quality": "365.9629780181032",
        "taker_gets_funded": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.2254411038203033"
        },
        "taker_pays_funded": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "82.50309772176658"
        }
      }
    }
  ],
  "asks": [
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "USD",
          "value": "3205.1",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "10",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "r49y2xKuKVG2dPkNHgWQAV61cjxk8gryjQ",
        "sequence": 434,
        "makerExchangeRate": "0.003120027456241615"
      },
      "data": {
        "Account": "r49y2xKuKVG2dPkNHgWQAV61cjxk8gryjQ",
        "BookDirectory": "20294C923E80A51B487EB9547B3835FD483748B170D2D0A4520B15A60037FFCF",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000000",
        "PreviousTxnID": "544932DC56D72E845AF2B738821FE07865E32EC196270678AB0D947F54E9F49F",
        "PreviousTxnLgrSeq": 10679000,
        "Sequence": 434,
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "3205.1"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "10"
        },
        "index": "CE457115A4ADCC8CB351B3E35A0851E48DE16605C23E305017A9B697B156DE5A",
        "owner_funds": "41952.95917199965",
        "quality": "0.003120027456241615"
      }
    },
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "USD",
          "value": "1599.063669386278",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "4.99707396683212",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rDYCRhpahKEhCFV25xScg67Bwf4W9sTYAm",
        "sequence": 233,
        "makerExchangeRate": "0.003125"
      },
      "data": {
        "Account": "rDYCRhpahKEhCFV25xScg67Bwf4W9sTYAm",
        "BookDirectory": "20294C923E80A51B487EB9547B3835FD483748B170D2D0A4520B1A2BC2EC5000",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000000",
        "PreviousTxnID": "F68F9658AB3D462FEB027E6C380F054BC6D2514B43EC3C6AD46EE19C59BF1CC3",
        "PreviousTxnLgrSeq": 10704238,
        "Sequence": 233,
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "1599.063669386278"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "4.99707396683212"
        },
        "index": "BF14FBB305159DBCAEA91B7E848408F5B559A91B160EBCB6D244958A6A16EA6B",
        "owner_funds": "3169.910902910102",
        "quality": "0.003125"
      }
    },
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "USD",
          "value": "143.1050962074379",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.4499999999999999",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "expirationTime": "2014-12-25T01:14:44.000Z"
      },
      "properties": {
        "maker": "raudnGKfTK23YKfnS7ixejHrqGERTYNFXk",
        "sequence": 110104,
        "makerExchangeRate": "0.003144542101755081"
      },
      "state": {
        "fundedAmount": {
          "currency": "USD",
          "value": "0",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "priceOfFundedAmount": {
          "currency": "BTC",
          "value": "0",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "data": {
        "Account": "raudnGKfTK23YKfnS7ixejHrqGERTYNFXk",
        "BookDirectory": "20294C923E80A51B487EB9547B3835FD483748B170D2D0A4520B2BF1C2F4D4C9",
        "BookNode": "0000000000000000",
        "Expiration": 472785284,
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "00000000000008F0",
        "PreviousTxnID": "446410E1CD718AC01929DD16B558FCF6B3A7B8BF208C420E67A280C089C5C59B",
        "PreviousTxnLgrSeq": 10713576,
        "Sequence": 110104,
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "143.1050962074379"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.4499999999999999"
        },
        "index": "67924B0EAA15784CC00CCD5FDD655EE2D6D2AE40341776B5F14E52341E7FC73E",
        "owner_funds": "0",
        "quality": "0.003144542101755081",
        "taker_gets_funded": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0"
        },
        "taker_pays_funded": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0"
        }
      }
    },
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "USD",
          "value": "254.329207354604",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.8",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "expirationTime": "2014-12-24T21:44:11.000Z"
      },
      "properties": {
        "maker": "rDVBvAQScXrGRGnzrxRrcJPeNLeLeUTAqE",
        "sequence": 35625,
        "makerExchangeRate": "0.003145529403882357"
      },
      "state": {
        "fundedAmount": {
          "currency": "USD",
          "value": "0",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "priceOfFundedAmount": {
          "currency": "BTC",
          "value": "0",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "data": {
        "Account": "rDVBvAQScXrGRGnzrxRrcJPeNLeLeUTAqE",
        "BookDirectory": "20294C923E80A51B487EB9547B3835FD483748B170D2D0A4520B2CD7A2BFBB75",
        "BookNode": "0000000000000000",
        "Expiration": 472772651,
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "00000000000003CD",
        "PreviousTxnID": "D49164AB68DDA3AEC9DFCC69A35685C4F532B5C231D3C1D25FEA7D5D0224FB84",
        "PreviousTxnLgrSeq": 10711128,
        "Sequence": 35625,
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "254.329207354604"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.8"
        },
        "index": "567BF2825173E3FB28FC94E436B6EB30D9A415FC2335E6D25CDE1BE47B25D120",
        "owner_funds": "0",
        "quality": "0.003145529403882357",
        "taker_gets_funded": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0"
        },
        "taker_pays_funded": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0"
        }
      }
    },
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "USD",
          "value": "390.4979",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "1.23231134568807",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rwBYyfufTzk77zUSKEu4MvixfarC35av1J",
        "sequence": 387756,
        "makerExchangeRate": "0.003155743848271834"
      },
      "data": {
        "Account": "rwBYyfufTzk77zUSKEu4MvixfarC35av1J",
        "BookDirectory": "20294C923E80A51B487EB9547B3835FD483748B170D2D0A4520B3621DF140FDA",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000008",
        "PreviousTxnID": "2E371E2B287C8A9FBB3424E4204B17AD9FA1BAA9F3B33C7D2261E3B038AFF083",
        "PreviousTxnLgrSeq": 10716291,
        "Sequence": 387756,
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "390.4979"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "1.23231134568807"
        },
        "index": "8CA23E55BF9F46AC7E803D3DB40FD03225EFCA66650D4CF0CBDD28A7CCDC8400",
        "owner_funds": "5704.824764087842",
        "quality": "0.003155743848271834"
      }
    },
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "USD",
          "value": "1",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.003160328237957649",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rwjsRktX1eguUr1pHTffyHnC4uyrvX58V1",
        "sequence": 208927,
        "makerExchangeRate": "0.003160328237957649"
      },
      "data": {
        "Account": "rwjsRktX1eguUr1pHTffyHnC4uyrvX58V1",
        "BookDirectory": "20294C923E80A51B487EB9547B3835FD483748B170D2D0A4520B3A4D41FF4211",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000000",
        "PreviousTxnID": "91763FA7089C63CC4D5D14CBA6A5A5BF7ECE949B0D34F00FD35E733AF9F05AF1",
        "PreviousTxnLgrSeq": 10716292,
        "Sequence": 208927,
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "1"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.003160328237957649"
        },
        "index": "7206866E39D9843623EE79E570242753DEE3C597F3856AEFB4631DD5AD8B0557",
        "owner_funds": "45.55665106096075",
        "quality": "0.003160328237957649"
      }
    },
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "USD",
          "value": "4725",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "15",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "r49y2xKuKVG2dPkNHgWQAV61cjxk8gryjQ",
        "sequence": 429,
        "makerExchangeRate": "0.003174603174603175"
      },
      "data": {
        "Account": "r49y2xKuKVG2dPkNHgWQAV61cjxk8gryjQ",
        "BookDirectory": "20294C923E80A51B487EB9547B3835FD483748B170D2D0A4520B4748E68669A7",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000000",
        "PreviousTxnID": "3B3CF6FF1A336335E78513CF77AFD3A784ACDD7B1B4D3F1F16E22957A060BFAE",
        "PreviousTxnLgrSeq": 10639969,
        "Sequence": 429,
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "4725"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "15"
        },
        "index": "42894809370C7E6B23498EF8E22AD4B05F02B94F08E6983357A51EA96A95FF7F",
        "quality": "0.003174603174603175"
      }
    },
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "USD",
          "value": "1.24252537879871",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "0.003967400879423823",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "rDbsCJr5m8gHDCNEHCZtFxcXHsD4S9jH83",
        "sequence": 110099,
        "makerExchangeRate": "0.003193013959408667"
      },
      "data": {
        "Account": "rDbsCJr5m8gHDCNEHCZtFxcXHsD4S9jH83",
        "BookDirectory": "20294C923E80A51B487EB9547B3835FD483748B170D2D0A4520B58077ED03C1B",
        "BookNode": "0000000000000000",
        "Flags": 131072,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000001",
        "PreviousTxnID": "98F3F2D02D3BB0AEAC09EECCF2F24BBE5E1AB2C71C40D7BD0A5199E12541B6E2",
        "PreviousTxnLgrSeq": 10715839,
        "Sequence": 110099,
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "1.24252537879871"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0.003967400879423823"
        },
        "index": "F4404D6547149419D3607F81D7080979FBB3AFE2661F9A933E2F6C07AC1D1F6D",
        "owner_funds": "73.52163803897041",
        "quality": "0.003193013959408667"
      }
    },
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "USD",
          "value": "496.5429474010489",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "1.6",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "expirationTime": "2014-12-24T21:44:12.000Z"
      },
      "properties": {
        "maker": "rDVBvAQScXrGRGnzrxRrcJPeNLeLeUTAqE",
        "sequence": 35627,
        "makerExchangeRate": "0.003222279177208227"
      },
      "state": {
        "fundedAmount": {
          "currency": "USD",
          "value": "0",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "priceOfFundedAmount": {
          "currency": "BTC",
          "value": "0",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "data": {
        "Account": "rDVBvAQScXrGRGnzrxRrcJPeNLeLeUTAqE",
        "BookDirectory": "20294C923E80A51B487EB9547B3835FD483748B170D2D0A4520B72A555B981A3",
        "BookNode": "0000000000000000",
        "Expiration": 472772652,
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "00000000000003CD",
        "PreviousTxnID": "146C8DBB047BAAFAE5B8C8DECCCDACD9DFCD7A464E5AB273230FF975E9B83CF7",
        "PreviousTxnLgrSeq": 10711128,
        "Sequence": 35627,
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "496.5429474010489"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "1.6"
        },
        "index": "50CAA04E81D0009115B61C132FC9887FA9E5336E0CB8A2E7D3280ADBF6ABC043",
        "quality": "0.003222279177208227",
        "taker_gets_funded": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0"
        },
        "taker_pays_funded": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "0"
        }
      }
    },
    {
      "specification": {
        "direction": "sell",
        "quantity": {
          "currency": "USD",
          "value": "3103",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        },
        "totalPrice": {
          "currency": "BTC",
          "value": "10",
          "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        }
      },
      "properties": {
        "maker": "r49y2xKuKVG2dPkNHgWQAV61cjxk8gryjQ",
        "sequence": 431,
        "makerExchangeRate": "0.003222687721559781"
      },
      "data": {
        "Account": "r49y2xKuKVG2dPkNHgWQAV61cjxk8gryjQ",
        "BookDirectory": "20294C923E80A51B487EB9547B3835FD483748B170D2D0A4520B730474DD96E5",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000000",
        "PreviousTxnID": "624F9ADA85EC3BE845EAC075B47E01E4F89288EAF27823C715777B3DFFB21F24",
        "PreviousTxnLgrSeq": 10639989,
        "Sequence": 431,
        "TakerGets": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "3103"
        },
        "TakerPays": {
          "currency": "BTC",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "10"
        },
        "index": "8A319A496288228AD9CAD74375E32FA81805C56A9AD84798A26756A8B3F9EE23",
        "quality": "0.003222687721559781"
      }
    }
  ]
}
```


## getSettings

`getSettings(address: string, options: object): Promise<object>`

Returns settings for the specified account. Note: For account data that is not modifiable by the user, see [getAccountInfo](#getaccountinfo).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account to get the settings of.
options | object | *Optional* Options that affect what to return.
*options.* ledgerVersion | integer | *Optional* Get the settings as of this historical ledger version.
*options.* ledgerVersion | string | *Optional* Get the settings as of this historical ledger version.

### Return Value

This method returns a promise that resolves with an array of objects with the following structure. All fields are optional, and are omitted if they are set to their default value.

Name | Type | Description
---- | ---- | -----------
defaultRipple | boolean | *Optional* Enable [rippling](https://xrpl.org/rippling.html) on this account’s trust lines by default. Currency issuers should enable this setting; most others should not.
depositAuth | boolean | *Optional* Enable [Deposit Authorization](https://xrpl.org/depositauth.html) on this account. If set, transactions cannot send value of any kind to this account unless the sender of those transactions is the account itself. (Requires the [DepositAuth amendment](https://xrpl.org/known-amendments.html#depositauth))
disableMasterKey | boolean | *Optional* Disallows use of the master key to sign transactions for this account. To disable the master key, you must authorize the transaction by signing it with the master key pair. You cannot use a regular key pair or a multi-signature. You can re-enable the master key pair using a regular key pair or multi-signature. See [AccountSet](https://xrpl.org/accountset.html).
disallowIncomingXRP | boolean | *Optional* Indicates that client applications should not send XRP to this account. Not enforced by rippled.
domain | string | *Optional* The domain that owns this account, as a hexadecimal string representing the ASCII for the domain in lowercase.
emailHash | string,null | *Optional* Hash of an email address to be used for generating an avatar image. Conventionally, clients use Gravatar to display this image. Use `null` to clear.
enableTransactionIDTracking | boolean | *Optional* Track the ID of this account’s most recent transaction.
globalFreeze | boolean | *Optional* Freeze all assets issued by this account.
memos | [memos](#transaction-memos) | *Optional* Array of memos to attach to the transaction.
messageKey | string | *Optional* Public key for sending encrypted messages to this account. Conventionally, it should be a secp256k1 key, the same encryption that is used by the rest of Ripple.
noFreeze | boolean | *Optional* Permanently give up the ability to freeze individual trust lines. This flag can never be disabled after being enabled.
passwordSpent | boolean | *Optional* Indicates that the account has used its free SetRegularKey transaction.
regularKey | [address](#address),null | *Optional* The public key of a new keypair, to use as the regular key to this account, as a base-58-encoded string in the same format as an account address. Use `null` to remove the regular key.
requireAuthorization | boolean | *Optional* If set, this account must individually give other users permission to hold this account’s issued tokens.
requireDestinationTag | boolean | *Optional* Requires incoming payments to specify a destination tag.
signers | object | *Optional* Settings that determine what sets of accounts can be used to sign a transaction on behalf of this account using multisigning.
*signers.* threshold | integer | A target number for the signer weights. A multi-signature from this list is valid only if the sum weights of the signatures provided is equal or greater than this value. To delete the signers setting, use the value `0`.
*signers.* weights | array | *Optional* Weights of signatures for each signer.
*signers.* weights[] | object | An association of an address and a weight.
*signers.weights[].* address | [address](#address) | An account address on the XRP Ledger
*signers.weights[].* weight | integer | The weight that the signature of this account counts as towards the threshold.
tickSize | string | *Optional* Tick size to use for offers involving a currency issued by this address. The exchange rates of those offers is rounded to this many significant digits. Valid values are 3 to 15 inclusive, or 0 to disable.
transferRate | number,null | *Optional* The fee to charge when users transfer this account’s issuances, as the decimal amount that must be sent to deliver 1 unit. Has precision up to 9 digits beyond the decimal point. Use `null` to set no fee.
walletLocator | string,null | *Optional* Transaction hash or any other 64 character hexadecimal string, that may or may not represent the result of a hash operation. Use `null` to clear.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
return api.getSettings(address).then(settings =>
  {/* ... */});
```


```json
{
  "requireDestinationTag": true,
  "disallowIncomingXRP": true,
  "emailHash": "23463B99B62A72F26ED677CC556C44E8",
  "walletLocator": "00000000000000000000000000000000000000000000000000000000DEADBEEF",
  "domain": "example.com",
  "transferRate": 1.002,
  "tickSize": 5,
  "signers": {
    "threshold": 3,
    "weights": [
      {
        "address": "rpHit3GvUR1VSGh2PXcaaZKEEUnCVxWU2i",
        "weight": 1
      }, {
        "address": "rN4oCm1c6BQz6nru83H52FBSpNbC9VQcRc",
        "weight": 1
      }, {
        "address": "rJ8KhCi67VgbapiKCQN3r1ZA6BMUxUvvnD",
        "weight": 1
      }
    ]
  }
}
```


## getAccountInfo

`getAccountInfo(address: string, options: object): Promise<object>`

Returns information for the specified account. Note: For account data that is modifiable by the user, see [getSettings](#getsettings).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account to get the account info of.
options | object | *Optional* Options that affect what to return.
*options.* ledgerVersion | integer | *Optional* Get the account info as of this historical ledger version.
*options.* ledgerVersion | string | *Optional* Get the account info as of this historical ledger version.

### Return Value

This method returns a promise that resolves with an object with the following structure:

Name | Type | Description
---- | ---- | -----------
sequence | [sequence](#account-sequence-number) | The next (smallest unused) sequence number for this account.
xrpBalance | [value](#value) | The XRP balance owned by the account.
ownerCount | integer | Number of other ledger entries (specifically, trust lines and offers) attributed to this account. This is used to calculate the total reserve required to use the account.
previousAffectingTransactionID | string | Hash value representing the most recent transaction that affected this account node directly. **Note:** This does not include changes to the account’s trust lines and offers.
previousAffectingTransactionLedgerVersion | integer | The ledger version that the transaction identified by the `previousAffectingTransactionID` was validated in.
previousAffectingTransactionLedgerVersion | string | The ledger version that the transaction identified by the `previousAffectingTransactionID` was validated in.
previousInitiatedTransactionID | string | *Optional* Hash value representing the most recent transaction that was initiated by this account.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
return api.getAccountInfo(address).then(info =>
  {/* ... */});
```


```json
{
  "sequence": 23,
  "xrpBalance": "922.913243",
  "ownerCount": 1,
  "previousAffectingTransactionID": "19899273706A9E040FDB5885EE991A1DC2BAD878A0D6E7DBCFB714E63BF737F7",
  "previousAffectingTransactionLedgerVersion": 6614625
}
```


## getAccountObjects

`getAccountObjects(address: string, options: object): Promise<AccountObjectsResponse>`

Returns objects owned by an account. For an account's trust lines and balances, see `getTrustlines` and `getBalances`.

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account to get the account objects of.
options | object | *Optional* Options that affect what to return.
*options.* ledgerHash | string | *Optional* (Optional) A 20-byte hex string for the ledger version to use.
*options.* ledgerIndex | integer | *Optional* (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically.
*options.* ledgerIndex | string | *Optional* (Optional) The sequence number of the ledger to use, or a shortcut string to choose a ledger automatically.
*options.* limit | integer | *Optional* (Optional) The maximum number of objects to include in the results.
*options.* type | string | *Optional* (Optional) Filter results to include only this type of ledger object. The valid types are: `check`, `escrow`, `offer`, `payment_channel`, `signer_list`, and `state` (trust line).

### Return Value

This method returns a promise that resolves with an object with the following structure:

Name | Type | Description
---- | ---- | -----------
account | [address](#address) | Unique address of the account this request corresponds to.
account_objects | array\<object\> | Array of objects owned by this account. Each object is in its raw ledger format.
ledger_current_index | integer | *Optional* (May be omitted) The sequence number of the ledger that was used to generate this response.
ledger_current_index | string | *Optional* (May be omitted) The sequence number of the ledger that was used to generate this response.
ledger_hash | string | *Optional* (May be omitted) The identifying hash of the ledger that was used to generate this response.
ledger_index | integer | *Optional* (May be omitted) The sequence number of the ledger that was used to generate this response.
ledger_index | string | *Optional* (May be omitted) The sequence number of the ledger that was used to generate this response.
limit | integer | *Optional* (May be omitted) The limit that was used in this request, if any.
validated | boolean | *Optional* If included and set to true, the information in this request comes from a validated ledger version. Otherwise, the information is subject to change.

The types of objects that may be returned include:

* `Offer` objects for orders that are currently live, unfunded, or expired but not yet removed.
* `RippleState` objects for trust lines where this account's side is not in the default state.
* A `SignerList` object if the account has multi-signing enabled.
* `Escrow` objects for held payments that have not yet been executed or canceled.
* `PayChannel` objects for open payment channels.
* `Check` objects for pending checks.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
return api.getAccountObjects(address: address).then(objects =>
  {/* ... */});
```


```json
{
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "account_objects": [
    {
      "Balance": {
        "currency": "ASP",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "0"
      },
      "Flags": 65536,
      "HighLimit": {
        "currency": "ASP",
        "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "value": "0"
      },
      "HighNode": "0000000000000000",
      "LedgerEntryType": "RippleState",
      "LowLimit": {
        "currency": "ASP",
        "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
        "value": "10"
      },
      "LowNode": "0000000000000000",
      "PreviousTxnID":
        "BF7555B0F018E3C5E2A3FF9437A1A5092F32903BE246202F988181B9CED0D862",
      "PreviousTxnLgrSeq": 1438879,
      "index":
        "2243B0B630EA6F7330B654EFA53E27A7609D9484E535AB11B7F946DF3D247CE9"
    },
    {
      "Balance": {
        "currency": "XAU",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "0"
      },
      "Flags": 3342336,
      "HighLimit": {
        "currency": "XAU",
        "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "value": "0"
      },
      "HighNode": "0000000000000000",
      "LedgerEntryType": "RippleState",
      "LowLimit": {
        "currency": "XAU",
        "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
        "value": "0"
      },
      "LowNode": "0000000000000000",
      "PreviousTxnID":
        "79B26D7D34B950AC2C2F91A299A6888FABB376DD76CFF79D56E805BF439F6942",
      "PreviousTxnLgrSeq": 5982530,
      "index":
        "9ED4406351B7A511A012A9B5E7FE4059FA2F7650621379C0013492C315E25B97"
    },
    {
      "Balance": {
        "currency": "USD",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "0"
      },
      "Flags": 1114112,
      "HighLimit": {
        "currency": "USD",
        "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
        "value": "0"
      },
      "HighNode": "0000000000000000",
      "LedgerEntryType": "RippleState",
      "LowLimit": {
        "currency": "USD",
        "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "value": "5"
      },
      "LowNode": "0000000000000000",
      "PreviousTxnID":
        "6FE8C824364FB1195BCFEDCB368DFEE3980F7F78D3BF4DC4174BB4C86CF8C5CE",
      "PreviousTxnLgrSeq": 10555014,
      "index":
        "2DECFAC23B77D5AEA6116C15F5C6D4669EBAEE9E7EE050A40FE2B1E47B6A9419"
    },
    {
      "Balance": {
        "currency": "MXN",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "481.992867407479"
      },
      "Flags": 65536,
      "HighLimit": {
        "currency": "MXN",
        "issuer": "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4",
        "value": "0"
      },
      "HighNode": "0000000000000000",
      "LedgerEntryType": "RippleState",
      "LowLimit": {
        "currency": "MXN",
        "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "value": "1000"
      },
      "LowNode": "0000000000000000",
      "PreviousTxnID":
        "A467BACE5F183CDE1F075F72435FE86BAD8626ED1048EDEFF7562A4CC76FD1C5",
      "PreviousTxnLgrSeq": 3316170,
      "index":
        "EC8B9B6B364AF6CB6393A423FDD2DDBA96375EC772E6B50A3581E53BFBDFDD9A"
    },
    {
      "Balance": {
        "currency": "EUR",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "0.793598266778297"
      },
      "Flags": 1114112,
      "HighLimit": {
        "currency": "EUR",
        "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
        "value": "0"
      },
      "HighNode": "0000000000000000",
      "LedgerEntryType": "RippleState",
      "LowLimit": {
        "currency": "EUR",
        "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "value": "1"
      },
      "LowNode": "0000000000000000",
      "PreviousTxnID":
        "E9345D44433EA368CFE1E00D84809C8E695C87FED18859248E13662D46A0EC46",
      "PreviousTxnLgrSeq": 5447146,
      "index":
        "4513749B30F4AF8DA11F077C448128D6486BF12854B760E4E5808714588AA915"
    },
    {
      "Balance": {
        "currency": "CNY",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "0"
      },
      "Flags": 2228224,
      "HighLimit": {
        "currency": "CNY",
        "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "value": "3"
      },
      "HighNode": "0000000000000000",
      "LedgerEntryType": "RippleState",
      "LowLimit": {
        "currency": "CNY",
        "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
        "value": "0"
      },
      "LowNode": "0000000000000008",
      "PreviousTxnID":
        "2FDDC81F4394695B01A47913BEC4281AC9A283CC8F903C14ADEA970F60E57FCF",
      "PreviousTxnLgrSeq": 5949673,
      "index":
        "578C327DA8944BDE2E10C9BA36AFA2F43E06C8D1E8819FB225D266CBBCFDE5CE"
    },
    {
      "Balance": {
        "currency": "DYM",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "1.336889190631542"
      },
      "Flags": 65536,
      "HighLimit": {
        "currency": "DYM",
        "issuer": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
        "value": "0"
      },
      "HighNode": "0000000000000000",
      "LedgerEntryType": "RippleState",
      "LowLimit": {
        "currency": "DYM",
        "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "value": "3"
      },
      "LowNode": "0000000000000000",
      "PreviousTxnID":
        "6DA2BD02DFB83FA4DAFC2651860B60071156171E9C021D9E0372A61A477FFBB1",
      "PreviousTxnLgrSeq": 8818732,
      "index":
        "5A2A5FF12E71AEE57564E624117BBA68DEF78CD564EF6259F92A011693E027C7"
    },
    {
      "Balance": {
        "currency": "CHF",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "-0.3488146605801446"
      },
      "Flags": 131072,
      "HighLimit": {
        "currency": "CHF",
        "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "value": "0"
      },
      "HighNode": "0000000000000000",
      "LedgerEntryType": "RippleState",
      "LowLimit": {
        "currency": "CHF",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        "value": "0"
      },
      "LowNode": "000000000000008C",
      "PreviousTxnID":
        "722394372525A13D1EAAB005642F50F05A93CF63F7F472E0F91CDD6D38EB5869",
      "PreviousTxnLgrSeq": 2687590,
      "index":
        "F2DBAD20072527F6AD02CE7F5A450DBC72BE2ABB91741A8A3ADD30D5AD7A99FB"
    },
    {
      "Balance": {
        "currency": "BTC",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "0"
      },
      "Flags": 131072,
      "HighLimit": {
        "currency": "BTC",
        "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "value": "3"
      },
      "HighNode": "0000000000000000",
      "LedgerEntryType": "RippleState",
      "LowLimit": {
        "currency": "BTC",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        "value": "0"
      },
      "LowNode": "0000000000000043",
      "PreviousTxnID":
        "03EDF724397D2DEE70E49D512AECD619E9EA536BE6CFD48ED167AE2596055C9A",
      "PreviousTxnLgrSeq": 8317037,
      "index":
        "767C12AF647CDF5FEB9019B37018748A79C50EDAF87E8D4C7F39F78AA7CA9765"
    },
    {
      "Balance": {
        "currency": "USD",
        "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
        "value": "-16.00534471983042"
      },
      "Flags": 131072,
      "HighLimit": {
        "currency": "USD",
        "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "value": "5000"
      },
      "HighNode": "0000000000000000",
      "LedgerEntryType": "RippleState",
      "LowLimit": {
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        "value": "0"
      },
      "LowNode": "000000000000004A",
      "PreviousTxnID":
        "CFFF5CFE623C9543308C6529782B6A6532207D819795AAFE85555DB8BF390FE7",
      "PreviousTxnLgrSeq": 14365854,
      "index":
        "826CF5BFD28F3934B518D0BDF3231259CBD3FD0946E3C3CA0C97D2C75D2D1A09"
    }
  ],
  "ledger_hash":
    "053DF17D2289D1C4971C22F235BC1FCA7D4B3AE966F842E5819D0749E0B8ECD3",
  "ledger_index": 14378733,
  "validated": true
}
```


## getPaymentChannel

`getPaymentChannel(id: string): Promise<object>`

Returns specified payment channel.

### Parameters

Name | Type | Description
---- | ---- | -----------
id | string | 256-bit hexadecimal channel identifier.

### Return Value

This method returns a promise that resolves with an object with the following structure:

Name | Type | Description
---- | ---- | -----------
account | [address](#address) | Address that created the payment channel.
destination | [address](#address) | Address to receive XRP claims against this channel.
amount | [value](#value) | The total amount of XRP funded in this channel.
balance | [value](#value) | The total amount of XRP delivered by this channel.
settleDelay | number | Amount of seconds the source address must wait before closing the channel if it has unclaimed XRP.
previousAffectingTransactionID | string | Hash value representing the most recent transaction that affected this payment channel.
previousAffectingTransactionLedgerVersion | integer | The ledger version that the transaction identified by the `previousAffectingTransactionID` was validated in.
previousAffectingTransactionLedgerVersion | string | The ledger version that the transaction identified by the `previousAffectingTransactionID` was validated in.
cancelAfter | date-time string | *Optional* Time when this channel expires as specified at creation.
destinationTag | integer | *Optional* Destination tag.
expiration | date-time string | *Optional* Time when this channel expires.
publicKey | string | *Optional* Public key of the key pair the source uses to sign claims against this channel.
sourceTag | integer | *Optional* Source tag.

### Example

```javascript
const channelId =
  'E30E709CF009A1F26E0E5C48F7AA1BFB79393764F15FB108BDC6E06D3CBD8415';
return api.getPaymentChannel(channelId).then(channel =>
  {/* ... */});
```


```json
{
  "account": "r6ZtfQFWbCkp4XqaUygzHaXsQXBT67xLj",
  "amount": "10",
  "balance": "0",
  "destination": "rQf9vCwQtzQQwtnGvr6zc1fqzqg7QBuj7G",
  "publicKey": "02A05282CB6197E34490BACCD9405E81D9DFBE123B0969F9F40EC3F9987AD9A97D",
  "settleDelay": 10000,
  "previousAffectingTransactionID": "F939A0BEF139465403C56CCDC49F59A77C868C78C5AEC184E29D15E9CD1FF675",
  "previousAffectingTransactionLedgerVersion": 151322
}
```


## getLedger

`getLedger(options: object): Promise<object>`

Returns header information for the specified ledger (or the most recent validated ledger if no ledger is specified). Optionally, all the transactions that were validated in the ledger or the account state information can be returned with the ledger header.

### Parameters

Name | Type | Description
---- | ---- | -----------
options | object | *Optional* Options affecting what ledger and how much data to return.
*options.* includeAllData | boolean | *Optional* Include the details of the transactions or state information if `includeTransactions` or `includeState` is set.
*options.* includeState | boolean | *Optional* Return an array of state data in this ledger. By default, provides the identifying hashes of state data. If `includeAllData` is true, return the state data in JSON form instead. **Admin required:** This is a very large amount of data.
*options.* includeTransactions | boolean | *Optional* Return an array of transactions in this ledger. By default, provides the identifying hashes for each transaction. If `includeAllData` is true, include the entire transaction JSON for each transaction instead.
*options.* ledgerHash | string | *Optional* Get ledger data for this historical ledger hash.
*options.* ledgerVersion | integer | *Optional* Get ledger data for this historical ledger version.
*options.* ledgerVersion | string | *Optional* Get ledger data for this historical ledger version.

### Return Value

This method returns a promise that resolves with an object with the following structure:

Name | Type | Description
---- | ---- | -----------
stateHash | string | Hash of all state information in this ledger.
closeTime | date-time string | The approximate time when this ledger was closed. This number is rounded based on the `closeTimeResolution`. If it would have been rounded to the same time as a previous ledger, the close time is recorded as 1 second later instead.
closeTimeResolution | integer | A number of seconds, indicating how much the `closeTime` could be rounded. Ledger close times are approximate so that small differences in servers clocks don't hinder consensus.
closeFlags | integer | A bit-map of flags relating to the closing of this ledger. Currently, the ledger has only one flag defined for `closeFlags`: **sLCF_NoConsensusTime** (value 1). If this flag is enabled, it means that validators disagreed on the correct close time for the ledger, but built otherwise the same ledger, so they declared consensus while "agreeing to disagree" on the close time. In this case, the consensus ledger contains a `closeTime` value that is 1 second after that of the previous ledger. (In this case, there is no official close time, but the actual real-world close time is probably 3-6 seconds later than the specified `closeTime`.)
ledgerHash | string | Unique identifying hash of the entire ledger.
ledgerVersion | integer | The ledger version of this ledger.
ledgerVersion | string | The ledger version of this ledger.
parentLedgerHash | string | Unique identifying hash of the ledger that came immediately before this one.
parentCloseTime | date-time string | The previous ledger's recorded close time.
totalDrops | [value](#value) | Total number of drops (1/1,000,000th of an XRP) in the network, as a quoted integer. (This decreases as transaction fees cause XRP to be destroyed.)
transactionHash | string | Hash of the transaction information included in this ledger.
rawState | string | *Optional* A JSON string containing all state data for this ledger in rippled JSON format.
stateHashes | array\<string\> | *Optional* An array of hashes of all state data in this ledger.
transactionHashes | array\<[transactionHash](#transaction-id)\> | *Optional* An array of hashes of all transactions that were validated in this ledger.
transactions | array\<[getTransaction](#gettransaction)\> | *Optional* Array of all transactions that were validated in this ledger. Transactions are represented in the same format as the return value of [getTransaction](#gettransaction).

### Example

```javascript
return api.getLedger()
  .then(ledger => {/* ... */});
```


```json
{
  "stateHash": "EC028EC32896D537ECCA18D18BEBE6AE99709FEFF9EF72DBD3A7819E918D8B96",
  "closeTime": "2014-09-24T21:21:50.000Z",
  "closeTimeResolution": 10,
  "closeFlags": 0,
  "ledgerHash": "0F7ED9F40742D8A513AE86029462B7A6768325583DF8EE21B7EC663019DD6A0F",
  "ledgerVersion": 9038214,
  "parentLedgerHash": "4BB9CBE44C39DC67A1BE849C7467FE1A6D1F73949EA163C38A0121A15E04FFDE",
  "parentCloseTime": "2014-09-24T21:21:40.000Z",
  "totalDrops": "99999973964317514",
  "transactionHash": "ECB730839EB55B1B114D5D1AD2CD9A932C35BA9AB6D3A8C2F08935EAC2BAC239"
}
```


## parseAccountFlags

`parseAccountFlags(Flags: number): object`

Parse an `AccountRoot` object's [`Flags`](https://xrpl.org/accountroot.html#accountroot-flags).

### Parameters

This method takes one parameter, the AccountRoot `Flags` number to parse. Note that flags have different mappings on other types of objects or in transactions such as AccountSet.

### Return Value

This method returns an object with containing a key for each AccountRoot flag known to this version of RippleAPI. Each flag has a boolean value of `true` or `false`.

### Example

```javascript
const account_info = await api.request('account_info', {account: 'rKsdkGhyZH6b2Zzd5hNnEqSv2wpznn4n6N'})
const flags = api.parseAccountFlags(account_info.account_data.Flags)
console.log(JSON.stringify(flags, null, 2))
```

```json
{
  "passwordSpent": false,
  "requireDestinationTag": false,
  "requireAuthorization": false,
  "depositAuth": true,
  "disallowIncomingXRP": false,
  "disableMasterKey": false,
  "noFreeze": false,
  "globalFreeze": false,
  "defaultRipple": false
}
```

## prepareTransaction

`prepareTransaction(transaction: object, instructions: object): Promise<object>`

Prepare a transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

This method works with any of [the transaction types supported by rippled](https://xrpl.org/transaction-types.html).

Notably, this is the preferred method for preparing `DepositPreauth` or `AccountDelete` transactions.

### Parameters

Name | Type | Description
---- | ---- | -----------
transaction | [Transaction](https://xrpl.org/transaction-formats.html) | The specification (JSON) of the transaction to prepare. Set `Account` to the address of the account that is creating the transaction. You may omit auto-fillable fields like `Fee`, `Flags`, and `Sequence` to have them set automatically.
instructions | [Instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction.

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
async function preparedPreauth() {
  const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
  return api.prepareTransaction({
    TransactionType: 'DepositPreauth',
    Account: address,
    Authorize: 'rMyVso4p83khNyHdV1m1PggV9QNadCj8wM'
  });
}
```

```javascript
{
  txJSON: '{"TransactionType":"DepositPreauth","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59","Authorize":"rMyVso4p83khNyHdV1m1PggV9QNadCj8wM","Flags":2147483648,"LastLedgerSequence":13561714,"Fee":"12","Sequence":1}',
  instructions: {
    fee: '0.000012',
    sequence: 1,
    maxLedgerVersion: 13561714
  }
}
```

## preparePayment

`preparePayment(address: string, payment: object, instructions: object): Promise<object>`

Prepare a payment transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
payment | [payment](#payment) | The specification of the payment to prepare.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const payment = {
  "source": {
    "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "maxAmount": {
      "value": "0.01",
      "currency": "USD",
      "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
    }
  },
  "destination": {
    "address": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
    "amount": {
      "value": "0.01",
      "currency": "USD",
      "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
    }
  }
};
return api.preparePayment(address, payment).then(prepared => {
    /* ... */
  }).catch(error => {
    /* ... as with all prepare* methods, use a Promise catch block to handle errors ... */
  })
```


```json
{
  "txJSON": "{\"Flags\":2147483648,\"TransactionType\":\"Payment\",\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"Destination\":\"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo\",\"Amount\":{\"value\":\"0.01\",\"currency\":\"USD\",\"issuer\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"},\"SendMax\":{\"value\":\"0.01\",\"currency\":\"USD\",\"issuer\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"},\"LastLedgerSequence\":8820051,\"Fee\":\"12\",\"Sequence\":23}",
  "instructions": {
    "fee": "0.000012",
    "sequence": 23,
    "maxLedgerVersion": 8820051
  }
}
```


## prepareTrustline

`prepareTrustline(address: string, trustline: object, instructions: object): Promise<object>`

Prepare a trustline transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
trustline | [trustline](#trustline) | The specification of the trustline to prepare.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const trustline = {
  "currency": "USD",
  "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM",
  "limit": "10000",
  "qualityIn": 0.91,
  "qualityOut": 0.87,
  "ripplingDisabled": true,
  "frozen": false,
  "memos": [
    {
      "type": "test",
      "format": "text/plain",
      "data": "texted data"
    }
  ]
};
return api.prepareTrustline(address, trustline).then(prepared =>
  {/* ... */});
```


```json
{
  "txJSON": "{\"TransactionType\":\"TrustSet\",\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"LimitAmount\":{\"currency\":\"USD\",\"issuer\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\",\"value\":\"10000\"},\"Flags\":2149711872,\"QualityIn\":910000000,\"QualityOut\":870000000,\"Memos\":[{\"Memo\":{\"MemoData\":\"7465787465642064617461\",\"MemoType\":\"74657374\",\"MemoFormat\":\"746578742F706C61696E\"}}],\"LastLedgerSequence\":8820051,\"Fee\":\"12\",\"Sequence\":23}",
  "instructions": {
    "fee": "0.000012",
    "sequence": 23,
    "maxLedgerVersion": 8820051
  }
}
```


## prepareOrder

`prepareOrder(address: string, order: object, instructions: object): Promise<object>`

Prepare an order transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
order | [order](#order) | The specification of the order to prepare.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';

// Buy 10.10 USD (of the specified issuer) for 2.0 XRP (2000000 drops), fill or kill.
const order = {
  "direction": "buy",
  "quantity": {
    "currency": "USD",
    "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM",
    "value": "10.1"
  },
  "totalPrice": {
    "currency": "drops",
    "value": "2000000"
  },
  "passive": false,
  "fillOrKill": true
};
return api.prepareOrder(address, order)
  .then(prepared => {/* ... */});
```


```json
{
  "txJSON": "{\"Flags\":2147745792,\"TransactionType\":\"OfferCreate\",\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"TakerGets\":\"2000000\",\"TakerPays\":{\"value\":\"10.1\",\"currency\":\"USD\",\"issuer\":\"rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM\"},\"LastLedgerSequence\":8819954,\"Fee\":\"12\",\"Sequence\":23}",
  "instructions": {
    "fee": "0.000012",
    "sequence": 23,
    "maxLedgerVersion": 8819954
  }
}
```


## prepareOrderCancellation

`prepareOrderCancellation(address: string, orderCancellation: object, instructions: object): Promise<object>`

Prepare an order cancellation transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
orderCancellation | [orderCancellation](#order-cancellation) | The specification of the order cancellation to prepare.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const orderCancellation = {orderSequence: 123};
return api.prepareOrderCancellation(address, orderCancellation)
  .then(prepared => {/* ... */});
```


```json
{
  "txJSON": "{\"Flags\":2147483648,\"TransactionType\":\"OfferCancel\",\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"OfferSequence\":23,\"LastLedgerSequence\":8820051,\"Fee\":\"12\",\"Sequence\":23}",
  "instructions": {
    "fee": "0.000012",
    "sequence": 23,
    "maxLedgerVersion": 8820051
  }
}
```


## prepareSettings

`prepareSettings(address: string, settings: object, instructions: object): Promise<object>`

Prepare a settings transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
settings | [settings](#settings) | The specification of the settings to prepare.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const settings = {
  "domain": "example.com",
  "memos": [
    {
      "type": "test",
      "format": "text/plain",
      "data": "texted data"
    }
  ]
};
return api.prepareSettings(address, settings)
  .then(prepared => {/* ... */});
```


```json
{
  "domain": "example.com",
  "memos": [
    {
      "type": "test",
      "format": "text/plain",
      "data": "texted data"
    }
  ]
}
```


## prepareEscrowCreation

`prepareEscrowCreation(address: string, escrowCreation: object, instructions: object): Promise<object>`

Prepare an escrow creation transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
escrowCreation | [escrowCreation](#escrow-creation) | The specification of the escrow creation to prepare.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

This is a convenience method for generating the EscrowCreate JSON used by rippled, so the same restrictions apply.

Field mapping: `allowCancelAfter` is equivalent to rippled's `CancelAfter`; `allowExecuteAfter` is equivalent to `FinishAfter`. At the `allowCancelAfter` time, the escrow is considered expired. This means that the funds can only be returned to the sender. At the `allowExecuteAfter` time, the escrow is permitted to be released to the recipient (if the `condition` is fulfilled).

Note that `allowCancelAfter` must be chronologically later than `allowExecuteAfter`.

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const escrowCreation = {
  "destination": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
  "amount": "0.01",
  "allowExecuteAfter": "2014-09-24T21:21:50.000Z",
  "allowCancelAfter":  "2017-01-01T00:00:00.000Z"
};
return api.prepareEscrowCreation(address, escrowCreation).then(prepared =>
  {/* ... */});
```


```json
{
  "txJSON": "{\"Flags\":2147483648,\"TransactionType\":\"EscrowCreate\",\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"Destination\":\"rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo\",\"Amount\":\"10000\",\"CancelAfter\":536544000,\"FinishAfter\":464908910,\"LastLedgerSequence\":8820051,\"Fee\":\"12\",\"Sequence\":23}",
  "instructions": {
    "fee": "0.000012",
    "sequence": 23,
    "maxLedgerVersion": 8820051
  }
}
```


## prepareEscrowCancellation

`prepareEscrowCancellation(address: string, escrowCancellation: object, instructions: object): Promise<object>`

Prepare an escrow cancellation transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
escrowCancellation | [escrowCancellation](#escrow-cancellation) | The specification of the escrow cancellation to prepare.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const escrowCancellation = {
  "owner": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "escrowSequence": 1234
};
return api.prepareEscrowCancellation(address, escrowCancellation).then(prepared =>
  {/* ... */});
```


```json
{
  "txJSON": "{\"Flags\":2147483648,\"TransactionType\":\"EscrowCancel\",\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"Owner\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"OfferSequence\":1234,\"LastLedgerSequence\":8820051,\"Fee\":\"12\",\"Sequence\":23}",
  "instructions": {
    "fee": "0.000012",
    "sequence": 23,
    "maxLedgerVersion": 8820051
  }
}
```


## prepareEscrowExecution

`prepareEscrowExecution(address: string, escrowExecution: object, instructions: object): Promise<object>`

Prepare an escrow execution transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
escrowExecution | [escrowExecution](#escrow-execution) | The specification of the escrow execution to prepare.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const escrowExecution = {
  "owner": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "escrowSequence": 1234,
  "condition": "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100",
  "fulfillment": "A0028000"
};
return api.prepareEscrowExecution(address, escrowExecution).then(prepared =>
  {/* ... */});
```


```json
{
  "txJSON": "{\"Flags\":2147483648,\"TransactionType\":\"EscrowFinish\",\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"Owner\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"OfferSequence\":1234,\"Condition\":\"A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100\",\"Fulfillment\":\"A0028000\",\"LastLedgerSequence\":8820051,\"Fee\":\"396\",\"Sequence\":23}",
  "instructions": {
    "fee": "0.000396",
    "sequence": 23,
    "maxLedgerVersion": 8820051
  }
}
```


## preparePaymentChannelCreate

`preparePaymentChannelCreate(address: string, paymentChannelCreate: object, instructions: object): Promise<object>`

Prepare a payment channel creation transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
paymentChannelCreate | [paymentChannelCreate](#payment-channel-create) | The specification of the payment channel to create.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const paymentChannelCreate = {
  "amount": "1",
  "destination": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
  "settleDelay": 86400,
  "publicKey": "32D2471DB72B27E3310F355BB33E339BF26F8392D5A93D3BC0FC3B566612DA0F0A"
};
return api.preparePaymentChannelCreate(address, paymentChannelCreate).then(prepared =>
  {/* ... */});
```


```json
{
  "txJSON":"{\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"TransactionType\":\"PaymentChannelCreate\",\"Amount\":\"1000000\",\"Destination\":\"rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW\",\"SettleDelay\":86400,\"PublicKey\":\"32D2471DB72B27E3310F355BB33E339BF26F8392D5A93D3BC0FC3B566612DA0F0A\",\"Flags\":2147483648,\"LastLedgerSequence\":8820051,\"Fee\":\"12\",\"Sequence\":23}",
  "instructions": {
    "fee": "0.000012",
    "sequence": 23,
    "maxLedgerVersion": 8820051
  }
}
```


## preparePaymentChannelClaim

`preparePaymentChannelClaim(address: string, paymentChannelClaim: object, instructions: object): Promise<object>`

Prepare a payment channel claim transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
paymentChannelClaim | [paymentChannelClaim](#payment-channel-claim) | Details of the channel and claim.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const paymentChannelClaim = {
  "channel": "C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198"
};
return api.preparePaymentChannelClaim(address, paymentChannelClaim).then(prepared =>
  {/* ... */});
```


```json
{
  "txJSON": "{\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"TransactionType\":\"PaymentChannelClaim\",\"Channel\":\"C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198\",\"Flags\":2147483648,\"LastLedgerSequence\":8820051,\"Fee\":\"12\",\"Sequence\":23}",
  "instructions": {
    "fee": "0.000012",
    "sequence": 23,
    "maxLedgerVersion": 8820051
  }
}
```


## preparePaymentChannelFund

`preparePaymentChannelFund(address: string, paymentChannelFund: object, instructions: object): Promise<object>`

Prepare a payment channel fund transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
paymentChannelFund | [paymentChannelFund](#payment-channel-fund) | The channel to fund, and the details of how to fund it.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const paymentChannelFund = {
  "channel": "C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198",
  "amount": "1"
};
return api.preparePaymentChannelFund(address, paymentChannelFund).then(prepared =>
  {/* ... */});
```


```json
{
  "txJSON":"{\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"TransactionType\":\"PaymentChannelFund\",\"Channel\":\"C1AE6DDDEEC05CF2978C0BAD6FE302948E9533691DC749DCDD3B9E5992CA6198\",\"Amount\":\"1000000\",\"Flags\":2147483648,\"LastLedgerSequence\":8820051,\"Fee\":\"12\",\"Sequence\":23}",
  "instructions": {
    "fee": "0.000012",
    "sequence": 23,
    "maxLedgerVersion": 8820051
  }
}
```


## prepareCheckCreate

`prepareCheckCreate(address: string, checkCreate: object, instructions: object): Promise<object>`

Prepare a Check creation transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
checkCreate | [checkCreate](#check-create) | The specification of the Check create creation to prepare.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const checkCreate = {
  "destination": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
  "sendMax": {
    "currency": "drops",
    "value": "1000000"
  }
};
return api.prepareCheckCreate(address, checkCreate).then(prepared =>
  {/* ... */});
```


```json
{
  "txJSON": "{\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"TransactionType\":\"CheckCreate\",\"Destination\":\"rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW\",\"SendMax\":\"1000000\",\"Flags\":2147483648,\"LastLedgerSequence\":8820051,\"Sequence\":23,\"Fee\":\"12\"}",
  "instructions": {
    "fee": "0.000012",
    "sequence": 23,
    "maxLedgerVersion": 8820051
  }
}
```


## prepareCheckCancel

`prepareCheckCancel(address: string, checkCancel: object, instructions: object): Promise<object>`

Prepare a Check cancellation transaction. This type of transaction cancels an unredeemed Check, removing it from the ledger without sending any money. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
checkCancel | [checkCancel](#check-cancel) | The specification of the Check cancellation to prepare.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const checkCancel = {
  "checkID": "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0"
};
return api.prepareCheckCancel(address, checkCancel).then(prepared =>
  {/* ... */});
```


```json
{
  "txJSON": "{\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"TransactionType\":\"CheckCancel\",\"CheckID\":\"49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0\",\"Flags\":2147483648,\"LastLedgerSequence\":8819954,\"Fee\":\"12\",\"Sequence\":23}",
  "instructions": {
    "fee": "0.000012",
    "sequence": 23,
    "maxLedgerVersion": 8819954
  }
}
```


## prepareCheckCash

`prepareCheckCash(address: string, checkCash: object, instructions: object): Promise<object>`

Prepare a Check cashing transaction. This redeems a Check to receive up to the amount authorized by the corresponding CheckCreate transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
checkCash | [checkCash](#check-cash) | The specification of the Check cash to prepare.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const checkCash = {
  "amount": {
    "currency": "drops",
    "value": "1000000"
  },
  "checkID": "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334"
};
return api.prepareCheckCash(address, checkCash).then(prepared =>
  {/* ... */});
```


```json
{
  "txJSON": "{\"Account\":\"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59\",\"TransactionType\":\"CheckCash\",\"CheckID\":\"838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334\",\"Amount\":\"1000000\",\"Flags\":2147483648,\"LastLedgerSequence\":8819954,\"Sequence\":23,\"Fee\":\"12\"}",
  "instructions": {
    "fee": "0.000012",
    "sequence": 23,
    "maxLedgerVersion": 8819954
  }
}
```


## prepareTicketCreate

`prepareTicketCreate(address: string, ticketCount: number, instructions: object): Promise<object>`

Prepare a ticket transaction. The prepared transaction can then be [signed](#sign) and [submitted](#submit).

Ticket functionality requires the [TicketBatch amendment](https://github.com/ripple/xrpl-dev-portal/issues/898). As of 2020-11-24, this amendment is not activated on the Mainnet, Testnet, or Devnet.

### Parameters

Name | Type | Description
---- | ---- | -----------
address | [address](#address) | The address of the account that is creating the transaction.
ticketCount | number | The number of tickets to be created.
instructions | [instructions](#transaction-instructions) | *Optional* Instructions for executing the transaction

### Return Value

This method returns a promise that resolves with an object with the following structure:

<aside class="notice">
All "prepare*" methods have the same return type.
</aside>

Name | Type | Description
---- | ---- | -----------
txJSON | string | The prepared transaction in rippled JSON format.
instructions | object | The instructions for how to execute the transaction after adding automatic defaults.
*instructions.* fee | [value](#value) | The fee to pay for the transaction. See [Transaction Fees](#transaction-fees) for more information. For multi-signed transactions, this fee is multiplied by (N+1), where N is the number of signatures you plan to provide.
*instructions.* maxLedgerVersion | integer,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* maxLedgerVersion | string,null | The highest ledger version that the transaction can be included in. Set to `null` if there is no maximum. If not null, this must be an integer greater than 0, or one of the following strings: 'validated', 'closed', 'current'.
*instructions.* sequence | [sequence](#account-sequence-number) | *Optional* The initiating account's sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.
*instructions.* ticketSequence | [ticket-sequence](#account-sequence-number) | *Optional* The initiating account's ticket sequence number for this transaction. `sequence` and `ticketSequence` are mutually exclusive, only one of them can be set.

### Example

```javascript
const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
return api.prepareTicketCreate(address, 2).then(prepared => {
    /* ... */
  }).catch(error => {
    /* ... as with all prepare* methods, use a Promise catch block to handle errors ... */
  })
```


```json
{
    "TransactionType": "TicketCreate",
    "Account": "r4SDqUD1ZcfoZrhnsZ94XNFKxYL4oHYJyA",
    "TicketCount": 2,
    "LastLedgerSequence": 13,
    "Fee": "12",
    "Sequence": 25
}
```


## sign

```
sign(txJSON: string, secret: string, options: object): {signedTransaction: string, id: string}
sign(txJSON: string, keypair: object, options: object): {signedTransaction: string, id: string}
```

Sign a prepared transaction. The signed transaction can then be [submitted](#submit).

This method can sign any of [the transaction types supported by ripple-binary-codec](https://github.com/ripple/ripple-binary-codec/blob/cfcde79c19c359e9a0466d7bc3dc9a3aef47bb99/src/enums/definitions.json#L1637). When a new transaction type is added to the XRP Ledger, it is unrecognized until `ripple-binary-codec` is updated. If you try to sign an unrecognized transaction type, this method throws an error like the following:

`Error: [TRANSACTION_TYPE] is not a valid name or ordinal for TransactionType`

### Parameters

Name | Type | Description
---- | ---- | -----------
txJSON | string | Transaction represented as a JSON string in rippled format.
keypair | object | *Optional* The private and public key of the account that is initiating the transaction. (This field cannot be used with secret).
*keypair.* privateKey | privateKey | The uppercase hexadecimal representation of the secp256k1 or Ed25519 private key. Ed25519 keys are prefixed with 0xED. You can read about how keys are derived [here](https://xrpl.org/cryptographic-keys.html).
*keypair.* publicKey | publicKey | The uppercase hexadecimal representation of the secp256k1 or Ed25519 public key. Ed25519 keys are prefixed with 0xED. You can read about how keys are derived [here](https://xrpl.org/cryptographic-keys.html).
options | object | *Optional* Options that control the type of signature to create.
*options.* signAs | [address](#address) | *Optional* The account that the signature should count for in multisigning.
secret | secret string | *Optional* The secret of the account that is initiating the transaction. (This field cannot be used with keypair).

When this method is used for multi-signing, the `options` parameter is required. See the multi-signing example in this section for more details.

### Return Value

This method returns an object with the following structure:

Name | Type | Description
---- | ---- | -----------
signedTransaction | string | The signed transaction represented as an uppercase hexadecimal string.
id | [transactionHash](#transaction-id) | The [Transaction ID](#transaction-id) of the signed transaction.

### Example

```javascript
// AccountSet transaction that sets Domain to example.com:
const txJSON = '{"Flags":2147483648,"TransactionType":"AccountSet","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59","Domain":"6578616D706C652E636F6D","LastLedgerSequence":8820051,"Fee":"12","Sequence":23}';
const secret = 'shsWGZcmZz6YsWWmcnpfr6fLTdtFV';
const keypair = { privateKey: '00ACCD3309DB14D1A4FC9B1DAE608031F4408C85C73EE05E035B7DC8B25840107A', publicKey: '02F89EAEC7667B30F33D0687BBA86C3FE2A08CCA40A9186C5BDE2DAA6FA97A37D8' };
return api.sign(txJSON, secret); // or: api.sign(txJSON, keypair);
```


```json
{
  "signedTransaction": "12000322800000002400000017201B0086955368400000000000000C732102F89EAEC7667B30F33D0687BBA86C3FE2A08CCA40A9186C5BDE2DAA6FA97A37D8744630440220680070A157682D9EB510E8AD58C35DC9C8346B155077D73792E88120B7A3B6B1022079537D3300C9B4D2D3D62ACCE1E66CDA893F9612CB2577ADEC8154B933765336770B6578616D706C652E636F6D81145E7B112523F68D2F5E879DB4EAC51C6698A69304",
  "id": "10B54D31384A49336C36A5907E3C28227139E282D3C7F734FEA351DE446F3674"
}
```


### Example Keypairs

To learn how keypairs are derived read [here](https://xrpl.org/cryptographic-keys.html#generating-keys).
```javascript
// secp25519 (33 bytes)
const privateKey = "002512BBDFDBB77510883B7DCCBEF270B86DEAC8B64AC762873D75A1BEE6298665"
const publicKey = "0390A196799EE412284A5D80BF78C3E84CBB80E1437A0AECD9ADF94D7FEAAFA284"

// ed25519 (Note the 0xED prefixes a 32 byte value for a total of 33 bytes)
const privateKey = "ED0B6CBAC838DFE7F47EA1BD0DF00EC282FDF45510C92161072CCFB84035390C4D"
const publicKey = "ED1A7C082846CFF58FF9A892BA4BA2593151CCF1DBA59F37714CC9ED39824AF85F"
```

### Example (multi-signing)

```javascript
const RippleAPI = require('ripple-lib').RippleAPI;

// jon's address will have a multi-signing setup with a quorum of 2
const jon = {
    account: 'rJKpme4m2zBQceBuU89d7vLMzgoUw2Ptj',
    secret: 'sh4Va7b1wQof8knHFV2sxwX12fSgK'
};
const aya = {
    account: 'rnrPdBjs98fFFfmRpL6hM7exT788SWQPFN',
    secret: 'snaMuMrXeVc2Vd4NYvHofeGNjgYoe'
};
const bran = {
    account: 'rJ93RLnT1t5A8fCr7HTScw7WtfKJMRXodH',
    secret: 'shQtQ8Um5MS218yvEU3Ehy1eZQKqH'
};

// Setup the signers list with a quorum of 2
const multiSignSetupTransaction = {
    "Flags": 0,
    "TransactionType": "SignerListSet",
    "Account": "rJKpme4m2zBQceBuU89d7vLMzgoUw2Ptj",
    "Fee": "120",
    "SignerQuorum": 2,
    "SignerEntries": [
        {
            "SignerEntry": {
                "Account": "rnrPdBjs98fFFfmRpL6hM7exT788SWQPFN",
                "SignerWeight": 2
            }
        },
        {
            "SignerEntry": {
                "Account": "rJ93RLnT1t5A8fCr7HTScw7WtfKJMRXodH",
                "SignerWeight": 1
            }
        },
    ]
};

// a transaction which requires multi signing
const multiSignPaymentTransaction = {
    TransactionType: 'Payment',
    Account: 'rJKpme4m2zBQceBuU89d7vLMzgoUw2Ptj',
    Destination: 'rJ93RLnT1t5A8fCr7HTScw7WtfKJMRXodH',
    Amount: '88000000'
};

const multiSignPaymentInstruction = {
  signersCount: 2
};

const api = new RippleAPI({
    server: 'wss://s.altnet.rippletest.net:51233'
});

api.connect().then(() => {
    // adding the multi signing feature to jon's account
    api.prepareTransaction(multiSignSetupTransaction).then((prepared) => {
        console.log(prepared);
        jonSign = api.sign(prepared.txJSON, jon.secret).signedTransaction;
        api.submit(jonSign).then( response => {
            console.log(response.resultCode, response.resultMessage);

            // multi sign a transaction
            api.prepareTransaction(multiSignPaymentTransaction, multiSignPaymentInstruction).then(prepared => {
                console.log(prepared);

                // Aya and Bran sign it too but with 'signAs' set to their own account
                let ayaSign = api.sign(prepared.txJSON, aya.secret, {'signAs': aya.account}).signedTransaction;
                let branSign = api.sign(prepared.txJSON, bran.secret, {'signAs': bran.account}).signedTransaction;

                // signatures are combined and submitted
                let combinedTx = api.combine([ayaSign, branSign]);
                api.submit(combinedTx.signedTransaction).then(response => {
                    console.log(response.tx_json.hash);
                    return api.disconnect();
                }).catch(console.error);
            }).catch(console.error);
        }).catch(console.error)
    }).catch(console.error);
}).catch(console.error);
```

If the multi-signing account was setup properly, the above example logs `resultCode: 'tesSUCCESS'` and the hash for the transaction. If any of `{signAs: some_address}` options were missing, the code returns a validation error such as:

```
[ValidationError(txJSON is not the same for all signedTransactions)]
```

## combine

`combine(signedTransactions: Array<string>): {signedTransaction: string, id: string}`

Combines signed transactions from multiple accounts for a multisignature transaction into a form that can be [submitted](#submit).

### Parameters

Name | Type | Description
---- | ---- | -----------
signedTransactions | array\<string\> | An array of signed transactions (from the output of [sign](#sign)) to combine.

### Return Value

This method returns an object with the following structure:

Name | Type | Description
---- | ---- | -----------
signedTransaction | string | The signed transaction represented as an uppercase hexadecimal string.
id | [transactionHash](#transaction-id) | The [Transaction ID](#transaction-id) of the signed transaction.

### Example

```javascript
const signedTransactions = [ "12000322800000002400000004201B000000116840000000000F42407300770B6578616D706C652E636F6D811407C532442A675C881BA1235354D4AB9D023243A6F3E0107321026C784C1987F83BACBF02CD3E484AFC84ADE5CA6B36ED4DCA06D5BA233B9D382774473045022100E484F54FF909469FA2033E22EFF3DF8EDFE62217062680BB2F3EDF2F185074FE0220350DB29001C710F0450DAF466C5D819DC6D6A3340602DE9B6CB7DA8E17C90F798114FE9337B0574213FA5BCC0A319DBB4A7AC0CCA894E1F1",
  "12000322800000002400000004201B000000116840000000000F42407300770B6578616D706C652E636F6D811407C532442A675C881BA1235354D4AB9D023243A6F3E01073210287AAAB8FBE8C4C4A47F6F1228C6E5123A7ED844BFE88A9B22C2F7CC34279EEAA74473045022100B09DDF23144595B5A9523B20E605E138DC6549F5CA7B5984D7C32B0E3469DF6B022018845CA6C203D4B6288C87DDA439134C83E7ADF8358BD41A8A9141A9B631419F8114517D9B9609229E0CDFE2428B586738C5B2E84D45E1F1" ];
return api.combine(signedTransactions);
```


```json
{
  "signedTransaction": "12000322800000002400000004201B000000116840000000000F42407300770B6578616D706C652E636F6D811407C532442A675C881BA1235354D4AB9D023243A6F3E01073210287AAAB8FBE8C4C4A47F6F1228C6E5123A7ED844BFE88A9B22C2F7CC34279EEAA74473045022100B09DDF23144595B5A9523B20E605E138DC6549F5CA7B5984D7C32B0E3469DF6B022018845CA6C203D4B6288C87DDA439134C83E7ADF8358BD41A8A9141A9B631419F8114517D9B9609229E0CDFE2428B586738C5B2E84D45E1E0107321026C784C1987F83BACBF02CD3E484AFC84ADE5CA6B36ED4DCA06D5BA233B9D382774473045022100E484F54FF909469FA2033E22EFF3DF8EDFE62217062680BB2F3EDF2F185074FE0220350DB29001C710F0450DAF466C5D819DC6D6A3340602DE9B6CB7DA8E17C90F798114FE9337B0574213FA5BCC0A319DBB4A7AC0CCA894E1F1",
  "id": "8A3BFD2214B4C8271ED62648FCE9ADE4EE82EF01827CF7D1F7ED497549A368CC"
}
```


## submit

`request('submit', {tx_blob: string, fail_hard: boolean}): Promise<object>`

The `submit` method applies a transaction and sends it to the network to be confirmed and included in future ledgers.

This method takes a signed, serialized transaction as a binary blob, and submits it to the network as-is. Since signed transaction objects are immutable, no part of the transaction can be modified or automatically filled in after submission.

To send a transaction as robustly as possible, you should construct and sign it in advance, persist it somewhere that you can access even after a power outage, then `submit` it as a `tx_blob`. After submission, monitor the network with the `tx` method to see if the transaction was successfully applied; if a restart or other problem occurs, you can safely re-submit the `tx_blob` transaction: it won't be applied twice since it has the same sequence number as the old transaction.

### Parameters

| `Field`     | Type    | Description                                          |
|:------------|:--------|:-----------------------------------------------------|
| `tx_blob`   | String  | Hex representation of the signed transaction to submit. This can be a multi-signed transaction. |
| `fail_hard` | Boolean | (Optional, defaults to false) If true, and the transaction fails locally, do not retry or relay the transaction to other servers |

### Return Value

When successful, this method returns an object containing the following fields:

| `Field`                 | Type    | Description                              |
|:------------------------|:--------|:-----------------------------------------|
| `engine_result`         | String  | Text [result code](https://xrpl.org/transaction-results.html) indicating the preliminary result of the transaction, for example `tesSUCCESS` |
| `engine_result_code`    | Integer | Numeric version of the [result code](https://xrpl.org/transaction-results.html). **Not recommended.** |
| `engine_result_message` | String  | Human-readable explanation of the transaction's preliminary result |
| `tx_blob`               | String  | The complete transaction in hex string format |
| `tx_json`               | Object  | The complete transaction in JSON format  |
| `accepted`              | Boolean | The value `true` indicates that the transaction was applied, queued, broadcast, or kept for later. The value `false` indicates that none of those happened, so the transaction cannot possibly succeed as long as you do not submit it again and have not already submitted it another time. [New in: rippled 1.5.0] |
| `account_sequence_available` | Number | The next [Sequence Number](https://xrpl.org/basic-data-types.html#account-sequence) available for the sending account after all pending and [queued](https://xrpl.org/transaction-queue.html) transactions. [New in: rippled 1.5.0] |
| `account_sequence_next` | number  | The next [Sequence Number](https://xrpl.org/basic-data-types.html#account-sequence) for the sending account after all transactions that have been provisionally applied, but not transactions in the [queue](https://xrpl.org/transaction-queue.html). [New in: rippled 1.5.0] |
| `applied`               | Boolean | The value `true` indicates that this transaction was applied to the open ledger. In this case, the transaction is likely, but not guaranteed, to be validated in the next ledger version. [New in: rippled 1.5.0] |
| `broadcast`             | Boolean | The value `true` indicates this transaction was broadcast to peer servers in the peer-to-peer XRP Ledger network. (Note: if the server has no peers, such as in [stand-alone mode](https://xrpl.org/rippled-server-modes.html#reasons-to-run-a-rippled-server-in-stand-alone-mode), the server uses the value `true` for cases where it _would_ have broadcast the transaction.) The value `false` indicates the transaction was not broadcast to any other servers. [New in: rippled 1.5.0] |
| `kept`                  | Boolean | The value `true` indicates that the transaction was kept to be retried later. [New in: rippled 1.5.0] |
| `queued`                | Boolean | The value `true` indicates the transaction was put in the [Transaction Queue](https://xrpl.org/transaction-queue.html), which means it is likely to be included in a future ledger version. [New in: rippled 1.5.0] |
| `open_ledger_cost`      | String  | The current [open ledger cost](https://xrpl.org/transaction-cost.html#open-ledger-cost) before processing this transaction. Transactions with a lower cost are likely to be [queued](https://xrpl.org/transaction-queue.html). [New in: rippled 1.5.0] |
| `validated_ledger_index` | Integer  | The [ledger index](https://xrpl.org/basic-data-types.html#ledger-index) of the newest validated ledger at the time of submission. This provides a lower bound on the ledger versions that the transaction can appear in as a result of this request. (The transaction could only have been validated in this ledger version or earlier if it had already been submitted before.) |

Note: Many situations can prevent a transaction from processing successfully, such as a lack of trust lines connecting the two accounts in a payment, or changes in the state of the ledger since the time the transaction was constructed. Even if nothing is wrong, it may take several seconds to close and validate the ledger version that includes the transaction. Do not consider the transaction's results final until they appear in a validated ledger version.

### Example

```javascript
const signedTransaction = '12000022800000002400000007201B007008BC61400000000754D4C068400000000000000C732103E8110048477E60F292DEDA67CF518511E70A15E1E3771B3C024026E1F824832874473045022100D659C836C24FF346A87054E463078D805B19EFE9F10348FD4C6ED6C3F3C4D750022060BE0BFD5E2C4963A1B0E0F21D5BA800969863BA486F71E75C08D76D77C45B22811492F80A3F3849DBB5714A4F2C691CE7D47BEED58083141266204CFBC657E65D9B4D30301FF98644693935';
const failHard = false;
const result = await api.request('submit', {
  tx_blob: signedTransaction,
  fail_hard: failHard // optional
});
```

```json
{
  "accepted": true,
  "account_sequence_available": 8,
  "account_sequence_next": 8,
  "applied": true,
  "broadcast": true,
  "engine_result": "tesSUCCESS",
  "engine_result_code": 0,
  "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
  "kept": true,
  "open_ledger_cost": "10",
  "queued": false,
  "tx_blob": "12000022800000002400000007201B007008BC61400000000754D4C068400000000000000C732103E8110048477E60F292DEDA67CF518511E70A15E1E3771B3C024026E1F824832874473045022100D659C836C24FF346A87054E463078D805B19EFE9F10348FD4C6ED6C3F3C4D750022060BE0BFD5E2C4963A1B0E0F21D5BA800969863BA486F71E75C08D76D77C45B22811492F80A3F3849DBB5714A4F2C691CE7D47BEED58083141266204CFBC657E65D9B4D30301FF98644693935",
  "tx_json": {
      "Account": "rNQao3Z1irwRjKWSs8heL4a8WKLPKfLrXs",
      "Amount": "123000000",
      "Destination": "rpgHWJdXkSvvzikdJCpuMzU7zWnuqsJRCZ",
      "Fee": "12",
      "Flags": 2147483648,
      "LastLedgerSequence": 7342268,
      "Sequence": 7,
      "SigningPubKey": "03E8110048477E60F292DEDA67CF518511E70A15E1E3771B3C024026E1F8248328",
      "TransactionType": "Payment",
      "TxnSignature": "3045022100D659C836C24FF346A87054E463078D805B19EFE9F10348FD4C6ED6C3F3C4D750022060BE0BFD5E2C4963A1B0E0F21D5BA800969863BA486F71E75C08D76D77C45B22",
      "hash": "FE8D68D7FF5805EB07AF15A1ADF07FB5463CCD2C6C0A15981EB3D26A02E1551C"
  },
  "validated_ledger_index": 7341775
}
```

(In ripple-lib 1.8.0, [the old `submit` method](https://github.com/ripple/ripple-lib/blob/1.7.0/docs/index.md#submit) was deprecated.)

## generateXAddress

`generateXAddress(options?: object): {address: string, secret: string}`

Generate a new XRP Ledger address and corresponding secret.

### Parameters

Name | Type | Description
---- | ---- | -----------
options | object | *Optional* Options to control how the address and secret are generated.
*options.* algorithm | string | *Optional* The digital signature algorithm to generate an address for. Can be `ecdsa-secp256k1` (default) or `ed25519`.
*options.* entropy | array\<integer\> | *Optional* The entropy to use to generate the seed. Must be an array of length 16 with values from 0-255 (16 bytes of entropy)
*options.* includeClassicAddress | boolean | *Optional* Specifies whether the classic address should also be included in the returned payload.
*options.* test | boolean | *Optional* Specifies whether the address is intended for use on a test network such as Testnet or Devnet. If `true`, the address should only be used for testing, and starts with `T`. If `false`, the address should only be used on Mainnet, and starts with `X`.

### Return Value

This method returns an object with the following structure:

Name | Type | Description
---- | ---- | -----------
xAddress | [xAddress](#x-address) | A randomly generated XRP Ledger address in X-address format.
secret | secret string | The secret corresponding to the address.

### Example

```javascript
return api.generateXAddress();
```


```json
{
  "xAddress": "XVLcsWWNiFdUEqoDmSwgxh1abfddG1LtbGFk7omPgYpbyE8",
  "secret": "sp6JS7f14BuwFY8Mw6bTtLKWauoUs"
}
```


## generateAddress

`generateAddress(options?: object): {address: string, secret: string}`

Deprecated: This method returns a classic address. If you do not need the classic address, use `generateXAddress` instead.

Generate a new XRP Ledger address and corresponding secret.

### Parameters

Name | Type | Description
---- | ---- | -----------
options | object | *Optional* Options to control how the address and secret are generated.
*options.* algorithm | string | *Optional* The digital signature algorithm to generate an address for. Can be `ecdsa-secp256k1` (default) or `ed25519`.
*options.* entropy | array\<integer\> | *Optional* The entropy to use to generate the seed. Must be an array of length 16 with values from 0-255 (16 bytes of entropy)
*options.* includeClassicAddress | boolean | *Optional* If `true`, also return the classic address.
*options.* test | boolean | *Optional* Specifies whether the address is intended for use on a test network such as Testnet or Devnet. If `true`, the address should only be used for testing, and starts with `T`. If `false`, the address should only be used on Mainnet, and starts with `X`.

### Return Value

This method returns an object with the following structure:

Name | Type | Description
---- | ---- | -----------
xAddress | [xAddress](#x-address) | A randomly generated XRP Ledger address in X-address format.
classicAddress | [classicAddress](#classic-address) | A randomly generated XRP Ledger Account ID (classic address).
address | [classicAddress](#classic-address) | Deprecated: Use `classicAddress` instead.
secret | secret string | The secret corresponding to the address.

### Example

```javascript
return api.generateAddress();
```


```json
{
  "xAddress": "XVLcsWWNiFdUEqoDmSwgxh1abfddG1LtbGFk7omPgYpbyE8",
  "classicAddress": "rGCkuB7PBr5tNy68tPEABEtcdno4hE6Y7f",
  "address": "rGCkuB7PBr5tNy68tPEABEtcdno4hE6Y7f",
  "secret": "sp6JS7f14BuwFY8Mw6bTtLKWauoUs"
}
```


## isValidAddress

`isValidAddress(address: string): boolean`

Checks if the specified string contains a valid address. X-addresses are considered valid with ripple-lib v1.4.0 and higher.

### Parameters

This method takes one parameter, the address to validate.

### Return Value

This method returns `true` if the address is valid and `false` if it is not.

### Example

```javascript
return api.isValidAddress("address")
```

## isValidSecret

`isValidSecret(secret: string): boolean`

Checks if the specified string contains a valid secret.

### Parameters

This method takes one parameter, the secret which to validate.

### Return Value

This method returns `true` if the secret is valid and `false` if it is not.

### Example

```javascript
return api.isValidSecret("secret")
```

## deriveKeypair

`deriveKeypair(seed: string): {privateKey: string, publicKey: string}`

Derive a public and private key from a seed.

### Parameters

This method takes one parameter, the seed from which to derive the public and private key.

### Return Value

This method returns an object containing the public and private components of the keypair corresponding to the seed.

### Example

```javascript
var keypair = api.deriveKeypair(seed)
var public_key = keypair.publicKey;
var private_key = keypair.privateKey;
```

## deriveAddress

`deriveAddress(publicKey: string): string`

Derive an XRP Ledger address from a public key.

### Parameters

This method takes one parameter, the public key from which to derive the address.

### Return Value

This method returns a string corresponding to the address derived from the public key.

### Example

```javascript
var address = api.deriveAddress(public_key);
```

## generateFaucetWallet

`generateFaucetWallet(onTestnet = true)`

Calls the Testnet or Devnet faucet API in order to generate a new, random wallet with some amount of test XRP. This is for testing purposes only.

### Example

**Request**

Create a new wallet on the Testnet:

```javascript
const wallet = await api.generateFaucetWallet()
```

**Response**


```json
{
    "account": {
        "xAddress": "T7i2Q8yGcMcCQa2n6d9EvSEptT4CE6ap7Q1r1fmjstkLfsK",
        "secret": "ssKCsaRqWh669atvv83bdYRaiHomY",
        "classicAddress": "r9SYfmVxrb7iuCVfNhW2gqqzapfE2r6juG",
        "address": "r9SYfmVxrb7iuCVfNhW2gqqzapfE2r6juG"
    },
    "amount": 1000,
    "balance": 1000
}
```

## signPaymentChannelClaim

`signPaymentChannelClaim(channel: string, amount: string, privateKey: string): string`

Sign a payment channel claim. A [PaymentChannelClaim](#preparepaymentchannelclaim) transaction can use the resulting signature to withdraw XRP from a payment channel.

### Parameters

Name | Type | Description
---- | ---- | -----------
channel | string | 256-bit hexadecimal channel identifier.
amount | [value](#value) | Amount of XRP authorized by the claim.
privateKey | string | The private key to sign the payment channel claim.

### Return Value

This method returns a signature string:

Name | Type | Description
---- | ---- | -----------
 | string | The hexadecimal representation of a signature.

### Example

```javascript
const channel =
  '3E18C05AD40319B809520F1A136370C4075321B285217323396D6FD9EE1E9037';
const amount = '.00001';
const privateKey =
  'ACCD3309DB14D1A4FC9B1DAE608031F4408C85C73EE05E035B7DC8B25840107A';
return api.signPaymentChannelClaim(channel, amount, privateKey);
```


```json
"3045022100B5C54654221F154347679B97AE7791CBEF5E6772A3F894F9C781B8F1B400F89F022021E466D29DC5AEB5DFAFC76E8A88D2E388EBD25A84143B6AC3B647F479CB89B7"
```


## verifyPaymentChannelClaim

`verifyPaymentChannelClaim(channel: string, amount: string, signature: string, publicKey: string): boolean`

Verify a payment channel claim signature.

### Parameters

Name | Type | Description
---- | ---- | -----------
channel | string | 256-bit hexadecimal channel identifier.
amount | [value](#value) | Amount of XRP authorized by the claim.
signature | string | Signature of this claim.
publicKey | string | Public key of the channel's sender

### Return Value

This method returns `true` if the claim signature is valid.

Name | Type | Description
---- | ---- | -----------
 | boolean | 

### Example

```javascript
const channel =
  '3E18C05AD40319B809520F1A136370C4075321B285217323396D6FD9EE1E9037';
const amount = '.00001';
const signature = "3045022100B5C54654221F154347679B97AE7791CBEF5E6772A3F894F9C781B8F1B400F89F022021E466D29DC5AEB5DFAFC76E8A88D2E388EBD25A84143B6AC3B647F479CB89B7";
const publicKey =
  '02F89EAEC7667B30F33D0687BBA86C3FE2A08CCA40A9186C5BDE2DAA6FA97A37D8';
return api.verifyPaymentChannelClaim(channel, amount, signature, publicKey);
```

```json
true
```

## computeLedgerHash

`computeLedgerHash(ledger: object): string`

Compute the hash of a ledger.

### Parameters

<aside class="notice">
The parameter to this method has the same structure as the return value of getLedger.
</aside>

Name | Type | Description
---- | ---- | -----------
ledger | object | The ledger header to hash.
*ledger.* stateHash | string | Hash of all state information in this ledger.
*ledger.* closeTime | date-time string | The approximate time when this ledger was closed. This number is rounded based on the `closeTimeResolution`. If it would have been rounded to the same time as a previous ledger, the close time is recorded as 1 second later instead.
*ledger.* closeTimeResolution | integer | A number of seconds, indicating how much the `closeTime` could be rounded. Ledger close times are approximate so that small differences in servers clocks don't hinder consensus.
*ledger.* closeFlags | integer | A bit-map of flags relating to the closing of this ledger. Currently, the ledger has only one flag defined for `closeFlags`: **sLCF_NoConsensusTime** (value 1). If this flag is enabled, it means that validators disagreed on the correct close time for the ledger, but built otherwise the same ledger, so they declared consensus while "agreeing to disagree" on the close time. In this case, the consensus ledger contains a `closeTime` value that is 1 second after that of the previous ledger. (In this case, there is no official close time, but the actual real-world close time is probably 3-6 seconds later than the specified `closeTime`.)
*ledger.* ledgerHash | string | Unique identifying hash of the entire ledger.
*ledger.* ledgerVersion | integer | The ledger version of this ledger.
*ledger.* ledgerVersion | string | The ledger version of this ledger.
*ledger.* parentLedgerHash | string | Unique identifying hash of the ledger that came immediately before this one.
*ledger.* parentCloseTime | date-time string | The previous ledger's recorded close time.
*ledger.* totalDrops | [value](#value) | Total number of drops (1/1,000,000th of an XRP) in the network, as a quoted integer. (This decreases as transaction fees cause XRP to be destroyed.)
*ledger.* transactionHash | string | Hash of the transaction information included in this ledger.
*ledger.* rawState | string | *Optional* A JSON string containing all state data for this ledger in rippled JSON format.
*ledger.* stateHashes | array\<string\> | *Optional* An array of hashes of all state data in this ledger.
*ledger.* transactionHashes | array\<[transactionHash](#transaction-id)\> | *Optional* An array of hashes of all transactions that were validated in this ledger.
*ledger.* transactions | array\<[getTransaction](#gettransaction)\> | *Optional* Array of all transactions that were validated in this ledger. Transactions are represented in the same format as the return value of [getTransaction](#gettransaction).

### Return Value

This method returns an uppercase hexadecimal string representing the hash of the ledger.

### Example

```javascript
const ledger = {
  "stateHash": "D9ABF622DA26EEEE48203085D4BC23B0F77DC6F8724AC33D975DA3CA492D2E44",
  "closeTime": "2015-08-12T01:01:10.000Z",
  "parentCloseTime": "2015-08-12T01:01:00.000Z",
  "closeFlags": 0,
  "closeTimeResolution": 10,
  "ledgerVersion": 15202439,
  "parentLedgerHash": "12724A65B030C15A1573AA28B1BBB5DF3DA4589AA3623675A31CAE69B23B1C4E",
  "totalDrops": "99998831688050493",
  "transactionHash": "325EACC5271322539EEEC2D6A5292471EF1B3E72AE7180533EFC3B8F0AD435C8"
};
return api.computeLedgerHash(ledger);
```

```json
"F4D865D83EB88C1A1911B9E90641919A1314F36E1B099F8E95FE3B7C77BE3349"
```

## xrpToDrops

`xrpToDrops(xrp: string | BigNumber): string`

Converts an XRP amount to drops. 1 XRP = 1,000,000 drops, so 1 drop = 0.000001 XRP. This method is useful when converting amounts for use with the rippled API, which requires XRP amounts to be specified in drops.

### Parameters

`xrp`: A string or BigNumber representing an amount of XRP. If `xrp` is a string, it may start with `-`, must contain at least one number, and may contain up to one `.`. This method throws a `ValidationError` for invalid input.

### Return Value

A string representing an equivalent amount of drops.

### Example

```javascript
return api.xrpToDrops('1');
```

```json
'1000000'
```

## dropsToXrp

`dropsToXrp(drops: string | BigNumber): string`

Converts an amount of drops to XRP. 1 drop = 0.000001 XRP, so 1 XRP = 1,000,000 drops. This method is useful when converting amounts from the rippled API, which describes XRP amounts in drops.

### Parameters

`drops`: A string or BigNumber representing an amount of drops. If `drops` is a string, it may start with `-` and must contain at least one number. This method throws a `ValidationError` for invalid input.

### Return Value

A string representing an equivalent amount of XRP.

### Example

```javascript
return api.dropsToXrp('1');
```

```json
'0.000001'
```

## iso8601ToRippleTime

`iso8601ToRippleTime(iso8601: string): number`

This method parses a string representation of a date, and returns the number of seconds since the "Ripple Epoch" of January 1, 2000 (00:00 UTC).

The Ripple Epoch is 946684800 seconds after the Unix Epoch.

This method is useful for creating timestamps to use with the rippled APIs. The rippled APIs represent time as an unsigned integer of the number of seconds since the Ripple Epoch.

### Parameters

`iso8601`: A string representing a date and time. This string is parsed using JavaScript's `Date.parse()` method.

### Return Value

The number of seconds since the Ripple Epoch.

### Example

```javascript
api.iso8601ToRippleTime('2017-02-17T15:04:57Z');
```

```json
540659097
```

## rippleTimeToISO8601

`rippleTimeToISO8601(rippleTime: number): string`

This method takes the number of seconds since the "Ripple Epoch" of January 1, 2000 (00:00 UTC) and returns a string representation of a date.

The Ripple Epoch is 946684800 seconds after the Unix Epoch.

This method is useful for interpreting timestamps returned by the rippled APIs. The rippled APIs represent time as an unsigned integer of the number of seconds since the Ripple Epoch.

### Parameters

`rippleTime`: A number of seconds since the Ripple Epoch.

### Return Value

A string representing a date and time, created by calling a `Date` object's `toISOString()` method.

### Example

```javascript
api.rippleTimeToISO8601(540659097);
```

```json
'2017-02-17T15:04:57.000Z'
```

## txFlags

`txFlags.TRANSACTION_TYPE.FLAG`

This object provides constants for use when creating or interpreting transaction flags. Most transactions have a set of bit-flags that represent various options that affect how a transaction should behave. These options are represented as binary values that can be combined with bitwise-or operations to encode multiple flags at once.

Most flags only have meaning for a specific transaction type. The same bitwise value may be reused for flags on different transaction types, so it is important to pay attention to the transaction type when setting and reading flags.

Bits that are not defined as flags MUST be 0.

### Global Flag

Applies globally to all transactions.

`txFlags.Universal.FullyCanonicalSig`: Require a fully-canonical signature. When preparing transactions, ripple-lib enables this flag for you.

### Payment Flags

`txFlags.Payment.NoRippleDirect`: Do not use the default path; only use specified paths. This is intended to force the transaction to take arbitrage opportunities. Most clients do not need this.

`txFlags.Payment.PartialPayment`: If the specified destination amount cannot be sent without spending more than the source maxAmount, reduce the received amount instead of failing outright. See [Partial Payments](https://xrpl.org/partial-payments.html) for more details.

`txFlags.Payment.LimitQuality`: Only take paths where all the conversions have an input:output ratio that is equal or better than the ratio of `destination.amount`:`source.maxAmount`. See [Limit Quality](https://xrpl.org/payment.html#limit-quality) for details.

### OfferCreate Flags

`txFlags.OfferCreate.Passive`: If enabled, the offer does not consume offers that exactly match it, and instead becomes an Offer object in the ledger. It still consumes offers that cross it.

`txFlags.OfferCreate.ImmediateOrCancel`: Treat the offer as an Immediate or Cancel order. If enabled, the offer never becomes a ledger object: it only tries to match existing offers in the ledger.

`txFlags.OfferCreate.FillOrKill`: Treat the offer as a Fill or Kill order.

`txFlags.OfferCreate.Sell`: Treat the offer as a Sell order. With `order.direction = 'sell'`, exchange the entire `order.quantity`, even if it means obtaining more than the `order.totalPrice` amount in exchange. If using `prepareOrder`, ripple-lib sets this flag for you.

### TrustSet Flags

`txFlags.TrustSet.SetAuth`: Authorize the other party to hold issuances from this account. (No effect unless using the AccountSet.RequireAuth flag.) Cannot be unset.

`txFlags.TrustSet.NoRipple`:  Obsolete.

`txFlags.TrustSet.SetNoRipple`: Blocks [rippling](https://xrpl.org/rippling.html) between two trustlines of the same currency, if this flag is set on both.

`txFlags.TrustSet.ClearNoRipple`: Clears the No-[Rippling](https://xrpl.org/rippling.html) flag.

`txFlags.TrustSet.SetFreeze`: Freeze the trustline. A non-XRP currency can be frozen by the exchange or gateway that issued it. XRP cannot be frozen.

`txFlags.TrustSet.ClearFreeze`: Unfreeze the trustline.

### AccountSet Flags

You can use the `prepareSettings` method to change your account flags. This method uses AccountSet flags internally.

In the rippled API, Account Flags can be enabled and disabled with the SetFlag and ClearFlag parameters. See [AccountSet Flags](https://xrpl.org/accountset.html#accountset-flags).

The AccountSet transaction type has some transaction flags, but their use is discouraged.

* `txFlags.AccountSet.RequireDestTag`
* `txFlags.AccountSet.OptionalDestTag`
* `txFlags.AccountSet.RequireAuth`
* `txFlags.AccountSet.OptionalAuth`
* `txFlags.AccountSet.DisallowXRP`
* `txFlags.AccountSet.AllowXRP`

### PaymentChannelClaim Flags

`txFlags.PaymentChannelClaim.Renew`: Clear the channel's Expiration time. (Expiration is different from the channel's immutable CancelAfter time.) Only the source address of the payment channel can use this flag.

`txFlags.PaymentChannelClaim.Close`: Request to close the channel. Only the channel source and destination addresses can use this flag. This flag closes the channel immediately if it has no more XRP allocated to it after processing the current claim, or if the destination address uses it. If the source address uses this flag when the channel still holds XRP, this schedules the channel to close after SettleDelay seconds have passed. (Specifically, this sets the Expiration of the channel to the close time of the previous ledger plus the channel's SettleDelay time, unless the channel already has an earlier Expiration time.) If the destination address uses this flag when the channel still holds XRP, any XRP that remains after processing the claim is returned to the source address.

### Other Transaction Types

The remaining transaction types do not have any flags at this time.

* OfferCancel
* SetRegularKey
* SignerListSet
* EscrowCreate
* EscrowFinish
* EscrowCancel
* PaymentChannelCreate
* PaymentChannelFund

## accountSetFlags

To modify account flags, you can use an AccountSet transaction and its `SetFlag` or `ClearFlag` fields.
	
The flags are called [AccountSet flags (asf*)](https://xrpl.org/accountset.html#accountset-flags):

`RippleAPI.accountSetFlags.requireDestinationTag`: Require a destination tag to send transactions to this account.
`RippleAPI.accountSetFlags.requireAuthorization`: Require authorization for users to hold balances issued by this address. Can only be enabled if the address has no trust lines connected to it.
`RippleAPI.accountSetFlags.disallowIncomingXRP`: XRP should not be sent to this account. (Enforced by client applications, not by rippled)
`RippleAPI.accountSetFlags.disableMasterKey`: Disallow use of the master key pair. Can only be enabled if the account has configured another way to sign transactions.
`RippleAPI.accountSetFlags.enableTransactionIDTracking`: Track the ID of this account's most recent transaction.
`RippleAPI.accountSetFlags.noFreeze`: Permanently give up the ability to freeze individual trust lines or disable Global Freeze. This flag can never be disabled after being enabled.
`RippleAPI.accountSetFlags.globalFreeze`:	Freeze all assets issued by this account.
`RippleAPI.accountSetFlags.defaultRipple`: Enable [rippling](https://xrpl.org/rippling.html) on this account's trust lines by default.
`RippleAPI.accountSetFlags.depositAuth`:Enable Deposit Authorization on this account.

## schemaValidator

Unlike the rest of the ripple-lib API, schemaValidator is a static object on RippleAPI. It provides utility methods that do not use a server.

## schemaValidate

`RippleAPI.schemaValidator.schemaValidate(schemaName: string, object: any): void`

This method checks an object for conformance to a specified schema. It does not return anything, but throws a `ValidationError` if the object does not conform to the schema.

### Example

```javascript
RippleAPI.schemaValidator.schemaValidate('sign', {
    signedTransaction: '12000322800000002400000017201B0086955368400000000000000C732102F89EAEC7667B30F33D0687BBA86C3FE2A08CCA40A9186C5BDE2DAA6FA97A37D8744630440220680070A157682D9EB510E8AD58C35DC9C8346B155077D73792E88120B7A3B6B1022079537D3300C9B4D2D3D62ACCE1E66CDA893F9612CB2577ADEC8154B933765336770B6578616D706C652E636F6D81145E7B112523F68D2F5E879DB4EAC51C6698A69304',
    id: '10B54D31384A49336C36A5907E3C28227139E282D3C7F734FEA351DE446F3674'
})
```

```json
undefined
```

If the object is valid (conforms to the schema), nothing is returned. Otherwise, `schemaValidate` throws an error:

```javascript
RippleAPI.schemaValidator.schemaValidate('sign', {
    signedTransaction: '12000322800000002400000017201B0086955368400000000000000C732102F89EAEC7667B30F33D0687BBA86C3FE2A08CCA40A9186C5BDE2DAA6FA97A37D8744630440220680070A157682D9EB510E8AD58C35DC9C8346B155077D73792E88120B7A3B6B1022079537D3300C9B4D2D3D62ACCE1E66CDA893F9612CB2577ADEC8154B933765336770B6578616D706C652E636F6D81145E7B112523F68D2F5E879DB4EAC51C6698A69304',
    id: '123'
})
```

```
[ValidationError(instance.id does not match pattern "^[A-F0-9]{64}$")]
```

# API Events

## ledger

This event is emitted whenever a new ledger version is validated on the connected server.

### Return Value

Name | Type | Description
---- | ---- | -----------
baseFeeXRP | [value](#value) | Base fee, in XRP.
ledgerHash | string | Unique hash of the ledger that was closed, as hex.
ledgerTimestamp | date-time string | The time at which this ledger closed.
reserveBaseXRP | [value](#value) | The minimum reserve, in XRP, that is required for an account.
reserveIncrementXRP | [value](#value) | The increase in account reserve that is added for each item the account owns, such as offers or trust lines.
transactionCount | integer | Number of new transactions included in this ledger.
ledgerVersion | integer | Ledger version of the ledger that closed.
ledgerVersion | string | Ledger version of the ledger that closed.
validatedLedgerVersions | string | Range of ledgers that the server has available. This may be discontiguous.

### Example

```javascript
api.on('ledger', ledger => {
  console.log(JSON.stringify(ledger, null, 2));
});
```


```json
{
  "baseFeeXRP": "0.00001",
  "ledgerVersion": 14804627,
  "ledgerHash": "9141FA171F2C0CE63E609466AF728FF66C12F7ACD4B4B50B0947A7F3409D593A",
  "ledgerTimestamp": "2015-07-23T05:50:40.000Z",
  "reserveBaseXRP": "20",
  "reserveIncrementXRP": "5",
  "transactionCount": 19,
  "validatedLedgerVersions": "13983423-14804627"
}
```


## error

This event is emitted when there is an error on the connection to the server that cannot be associated to a specific request.

### Return Value

The first parameter is a string indicating the error type:
* `badMessage` - rippled returned a malformed message
* `websocket` - the websocket library emitted an error
* one of the error codes found in the [`rippled` Universal Errors](https://xrpl.org/error-formatting.html#universal-errors).

The second parameter is a message explaining the error.

The third parameter is:
* the message that caused the error for `badMessage`
* the error object emitted for `websocket`
* the parsed response for rippled errors

### Example

```javascript
api.on('error', (errorCode, errorMessage, data) => {
  console.log(errorCode + ': ' + errorMessage);
});
```

```
tooBusy: The server is too busy to help you now.
```

## connected

This event is emitted after connection successfully opened.

### Example

```javascript
api.on('connected', () => {
  console.log('Connection is open now.');
});
```

## disconnected

This event is emitted when connection is closed.

### Return Value

The only parameter is a number containing the [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) send by the server.

### Example

```javascript
api.on('disconnected', (code) => {
  if (code !== 1000) {
    console.log('Connection is closed due to error.');
  } else {
    console.log('Connection is closed normally.');
  }
});
```

