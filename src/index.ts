#!/usr/bin/env node

import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import CLIOServer from './server';
import { program } from 'commander';


// const DEFAULT_ENDPOINT = 'http://127.0.0.1:3000';
// This is for only get info or get block
const DEFAULT_ENDPOINT = 'https://testnet-lb.wire.foundation';
const fetch = globalThis.fetch; 

function createRpc(url: string = DEFAULT_ENDPOINT): JsonRpc {
    return new JsonRpc(url, { fetch });
}

function createApi(privateKeys: string[], rpc: JsonRpc): Api {
    const signatureProvider = new JsSignatureProvider(privateKeys || []);
    return new Api({
      rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    });
}



function sendthistohome (
  contract : string, 
  actionName : string, 
  actionData : any, 
  permissions : string[]
) {
  const data = {
      contract,
      actionName,
      actionData,
      permissions
  };
  
  CLIOServer.listen( data);
};



// -----------------------------------------------------------------------------
// SUBCOMMAND: convert
// -----------------------------------------------------------------------------
program
  .command('convert')
  .description('Pack and unpack transactions')
  .action(() => {
    console.log('(Placeholder) Convert subcommand logic here...');
  });

// -----------------------------------------------------------------------------
// SUBCOMMAND: validate
// -----------------------------------------------------------------------------
program
  .command('validate')
  .description('Validate transactions')
  .action(() => {
    console.log('(Placeholder) Validate subcommand logic here...');
  });

// -----------------------------------------------------------------------------
// SUBCOMMAND: get
// -----------------------------------------------------------------------------
const getCmd = program
  .command('get')
  .description('Retrieve various items and information from the blockchain');

// get info
getCmd
  .command('info')
  .description('Retrieve chain info (similar to cleos get info)')
  .action(async () => {
    const rpc = createRpc(program.opts().url);
    try {
      const info = await rpc.get_info();
      console.log(JSON.stringify(info, null, 2));
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching chain info:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  });

// get block <block_num>
getCmd
  .command('block <block_num>')
  .description('Retrieve a specific block by block number or ID')
  .action(async (blockNum: string) => {
    const rpc = createRpc(program.opts().url);
    try {
      const block = await rpc.get_block(blockNum);
      console.log(JSON.stringify(block, null, 2));
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching block:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  });

// -----------------------------------------------------------------------------
// SUBCOMMAND: set
// -----------------------------------------------------------------------------
program
  .command('set')
  .description('Set or update blockchain state')
  .action(() => {
    console.log('(Placeholder) set logic...');
  });

// -----------------------------------------------------------------------------
// SUBCOMMAND: transfer
// -----------------------------------------------------------------------------
program
  .command('transfer <from> <to> <quantity> [memo]')
  .description('Transfer tokens from account to account')
  .option('-p, --permission <permission>', 'permission to authorize', 'from@active')
  .action(async (from: string, to: string, quantity: string, memo: string, options) => {
    console.log(`Transferring tokens... 
    From: ${from}, To: ${to}, Qty: ${quantity}, Memo: ${memo}`);

    const rpc = createRpc(program.opts().url);
    const api = createApi([], rpc);

  });

// -----------------------------------------------------------------------------
// SUBCOMMAND: net
// -----------------------------------------------------------------------------
program
  .command('net')
  .description('Interact with local p2p network connections')
  .action(() => {
    console.log('(Placeholder) net subcommand logic...');
  });

// -----------------------------------------------------------------------------
// SUBCOMMAND: wallet
// -----------------------------------------------------------------------------
program
  .command('wallet')
  .description('Interact with local wallet')
  .action(() => {
    console.log('(Placeholder) wallet subcommand logic...');
  });

// -----------------------------------------------------------------------------
// SUBCOMMAND: sign
// -----------------------------------------------------------------------------
program
  .command('sign')
  .description('Sign a transaction')
  .action(() => {
    console.log('(Placeholder) sign subcommand logic...');
  });

// -----------------------------------------------------------------------------
// SUBCOMMAND: push
// -----------------------------------------------------------------------------
const pushCmd = program
  .command('push')
  .description('Push arbitrary transactions to the blockchain');

// push action
pushCmd
  .command('action <contract> <actionName> [data]')
  .description('Push a single action to the blockchain')
  .option('-p, --permission <permission...>', 'permission(s) to authorize', ['account@active'])
  .option('-e, --external', 'Use external wallet to sign transaction')
  .action((contract: string, actionName: string, rawData: string, options) => {
    
    console.log('Push action command...');
    console.log(`Contract: ${contract}`);
    console.log(`Action: ${actionName}`);
    console.log(`Data: ${rawData}`);

    let actionData: unknown;
    try {
      actionData = JSON.parse(rawData);
    } catch {
      console.log('Data is not valid JSON; treating as raw text...');
      actionData = rawData;
    }

    if (options.external) {
      sendthistohome(contract,actionName,actionData,options.permission);
      console.log('Local signing page opened. Use MetaMask in your browser to sign the transaction.');


    } else {
      console.log(`Pushing action ${actionName} on ${contract} with data:`, actionData);

    }
  });

  

// -----------------------------------------------------------------------------
// SUBCOMMAND: multisig
// -----------------------------------------------------------------------------
program
  .command('multisig')
  .description('Multisig contract commands')
  .action(() => {
    console.log('(Placeholder) multisig subcommand logic...');
  });

// -----------------------------------------------------------------------------
// SUBCOMMAND: wrap
// -----------------------------------------------------------------------------
program
  .command('wrap')
  .description('Wrap contract commands')
  .action(() => {
    console.log('(Placeholder) wrap subcommand logic...');
  });

// -----------------------------------------------------------------------------
// SUBCOMMAND: system
// -----------------------------------------------------------------------------
program
  .command('system')
  .description('Send eosio.system contract action to the blockchain.')
  .action(() => {
    console.log('(Placeholder) system subcommand logic...');
  });

// -----------------------------------------------------------------------------
// Final parse
// -----------------------------------------------------------------------------
program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
