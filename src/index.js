#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eosjs_1 = require("eosjs");
const eosjs_jssig_1 = require("eosjs/dist/eosjs-jssig");
const server_1 = __importDefault(require("./server"));
const commander_1 = require("commander");
// const DEFAULT_ENDPOINT = 'http://127.0.0.1:3000';
// This is for only get info !or get block
const DEFAULT_ENDPOINT = 'https://testnet-lb.wire.foundation';
const fetch = globalThis.fetch;
function createRpc(url = DEFAULT_ENDPOINT) {
    return new eosjs_1.JsonRpc(url, { fetch });
}
function createApi(privateKeys, rpc) {
    const signatureProvider = new eosjs_jssig_1.JsSignatureProvider(privateKeys || []);
    return new eosjs_1.Api({
        rpc,
        signatureProvider,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder()
    });
}
function sendthistohome(contract, actionName, actionData, permissions) {
    const data = {
        contract,
        actionName,
        actionData,
        permissions
    };
    server_1.default.listen(data);
}
;
// -----------------------------------------------------------------------------
// SUBCOMMAND: convert
// -----------------------------------------------------------------------------
commander_1.program
    .command('convert')
    .description('Pack and unpack transactions')
    .action(() => {
    console.log('(Placeholder) Convert subcommand logic here...');
});
// -----------------------------------------------------------------------------
// SUBCOMMAND: validate
// -----------------------------------------------------------------------------
commander_1.program
    .command('validate')
    .description('Validate transactions')
    .action(() => {
    console.log('(Placeholder) Validate subcommand logic here...');
});
// -----------------------------------------------------------------------------
// SUBCOMMAND: get
// -----------------------------------------------------------------------------
const getCmd = commander_1.program
    .command('get')
    .description('Retrieve various items and information from the blockchain');
// get info
getCmd
    .command('info')
    .description('Retrieve chain info (similar to cleos get info)')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    const rpc = createRpc(commander_1.program.opts().url);
    try {
        const info = yield rpc.get_info();
        console.log(JSON.stringify(info, null, 2));
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching chain info:', error.message);
        }
        else {
            console.error('Unknown error:', error);
        }
    }
}));
// get block <block_num>
getCmd
    .command('block <block_num>')
    .description('Retrieve a specific block by block number or ID')
    .action((blockNum) => __awaiter(void 0, void 0, void 0, function* () {
    const rpc = createRpc(commander_1.program.opts().url);
    try {
        const block = yield rpc.get_block(blockNum);
        console.log(JSON.stringify(block, null, 2));
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching block:', error.message);
        }
        else {
            console.error('Unknown error:', error);
        }
    }
}));
// -----------------------------------------------------------------------------
// SUBCOMMAND: set
// -----------------------------------------------------------------------------
commander_1.program
    .command('set')
    .description('Set or update blockchain state')
    .action(() => {
    console.log('(Placeholder) set logic...');
});
// -----------------------------------------------------------------------------
// SUBCOMMAND: transfer
// -----------------------------------------------------------------------------
commander_1.program
    .command('transfer <from> <to> <quantity> [memo]')
    .description('Transfer tokens from account to account')
    .option('-p, --permission <permission>', 'permission to authorize', 'from@active')
    .action((from, to, quantity, memo, options) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Transferring tokens... 
    From: ${from}, To: ${to}, Qty: ${quantity}, Memo: ${memo}`);
    const rpc = createRpc(commander_1.program.opts().url);
    const api = createApi([], rpc);
}));
// -----------------------------------------------------------------------------
// SUBCOMMAND: net
// -----------------------------------------------------------------------------
commander_1.program
    .command('net')
    .description('Interact with local p2p network connections')
    .action(() => {
    console.log('(Placeholder) net subcommand logic...');
});
// -----------------------------------------------------------------------------
// SUBCOMMAND: wallet
// -----------------------------------------------------------------------------
commander_1.program
    .command('wallet')
    .description('Interact with local wallet')
    .action(() => {
    console.log('(Placeholder) wallet subcommand logic...');
});
// -----------------------------------------------------------------------------
// SUBCOMMAND: sign
// -----------------------------------------------------------------------------
commander_1.program
    .command('sign')
    .description('Sign a transaction')
    .action(() => {
    console.log('(Placeholder) sign subcommand logic...');
});
// -----------------------------------------------------------------------------
// SUBCOMMAND: push
// -----------------------------------------------------------------------------
const pushCmd = commander_1.program
    .command('push')
    .description('Push arbitrary transactions to the blockchain');
// push action
pushCmd
    .command('action <contract> <actionName> [data]')
    .description('Push a single action to the blockchain')
    .option('-p, --permission <permission...>', 'permission(s) to authorize', ['account@active'])
    .option('-e, --external', 'Use external wallet to sign transaction')
    .action((contract, actionName, rawData, options) => {
    console.log('Push action command...');
    console.log(`Contract: ${contract}`);
    console.log(`Action: ${actionName}`);
    console.log(`Data: ${rawData}`);
    let actionData;
    try {
        actionData = JSON.parse(rawData);
    }
    catch (_a) {
        console.log('Data is not valid JSON; treating as raw text...');
        actionData = rawData;
    }
    if (options.external) {
        sendthistohome(contract, actionName, actionData, options.permission);
        console.log('Local signing page opened. Use MetaMask in your browser to sign the transaction.');
    }
    else {
        console.log(`Pushing action ${actionName} on ${contract} with data:`, actionData);
    }
});
// -----------------------------------------------------------------------------
// SUBCOMMAND: multisig
// -----------------------------------------------------------------------------
commander_1.program
    .command('multisig')
    .description('Multisig contract commands')
    .action(() => {
    console.log('(Placeholder) multisig subcommand logic...');
});
// -----------------------------------------------------------------------------
// SUBCOMMAND: wrap
// -----------------------------------------------------------------------------
commander_1.program
    .command('wrap')
    .description('Wrap contract commands')
    .action(() => {
    console.log('(Placeholder) wrap subcommand logic...');
});
// -----------------------------------------------------------------------------
// SUBCOMMAND: system
// -----------------------------------------------------------------------------
commander_1.program
    .command('system')
    .description('Send eosio.system contract action to the blockchain.')
    .action(() => {
    console.log('(Placeholder) system subcommand logic...');
});
// -----------------------------------------------------------------------------
// Final parse
// -----------------------------------------------------------------------------
commander_1.program.parse(process.argv);
if (!process.argv.slice(2).length) {
    commander_1.program.help();
}
