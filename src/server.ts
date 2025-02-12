import express, {Express, Request , Response} from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'http';
import { Subject } from 'rxjs';
import { exec } from 'child_process';
import { Transaction, SignedTransaction, Action, ABI, NameType , AnyAction, APIClient, FetchProvider } from '../lib/core';
import { evmSigToWIRE } from '@wireio/wns';


export interface SubjectResponse {
    any: 'thing';
    body: any;
}

// If you're using localhost
const wire = new APIClient({provider: new FetchProvider('http://127.0.0.1:8888')});

// If you're using testnet on hub
// const wire = new APIClient({provider: new FetchProvider('https://testnet-lb.wire.foundation')});

// const wire = new APIClient({provider: new FetchProvider('https://testnet-00.wire.foundation')});


async function anyToAction(action: AnyAction | AnyAction[]): Promise<Action[]> {
    
    if (!Array.isArray(action)) action = [action];
      const actions: Action[] = [];
      const knownAbis = new Map<NameType, ABI>();
      for (const act of action) {
          if (!knownAbis.has(act.account)) {
              const abi_res = await wire.v1.chain.get_abi(act.account);
              knownAbis.set(act.account, ABI.from(abi_res.abi!));
          }
          actions.push(Action.from(act, knownAbis.get(act.account)!));
      }
  
      return actions;
}


type TxStoreEntry = {
    transaction: Transaction;    // the "un-signed" transaction
    chain_id: string;            // store chain_id so we can sign/push
};

const txStore: Map<string, TxStoreEntry> = new Map();


export class CLIOHTMLServer {
    app!: Express;
    server!: Server;

    subject!: Subject<SubjectResponse>;

    isListening: boolean = false;
    transactionData: any = {};
    constructor() {
        
    }

    
// transaction data passes to the home page
    listen(transactionData: any) {

        if (this.isListening) {
            this.transactionData = transactionData;
            console.log("Server is already running. Updated transaction data.");
            return this.subject;
        }

        this.subject = new Subject<SubjectResponse>()
        this.transactionData = transactionData;
        this.app = express();

        this.app.engine('handlebars', engine());
        

        this.app.set('view engine', 'handlebars');
        this.app.set('views', './views');

        this.app.use(express.json());

        this.app.use(express.static('public'));

        this.app.get('/', (req : Request, res: Response) => {
            
            // res.render('home', {something: 'my content1', trx_data: JSON.stringify(transactionData)});
        
            res.render('home', {
                something: 'my content2',
                trx_data : JSON.stringify(transactionData),
                contract: transactionData.contract || '',
                actionName : transactionData.actionName || '',
                actionData : transactionData.actionData ? JSON.stringify(transactionData.actionData, null, 2) : '',
                permissions: transactionData.permissions ?
                Array.isArray(transactionData.permissions) 
                ? transactionData.permissions.join(', ')
                : transactionData.permissions
                : '', 
            });
        });


        this.app.post('/prepare-transaction',  (req : Request, res : Response) => {
            (async () => {
                try {
                    // If nothing is passed in req.body, fallback to our "transactionData"
                    // Or can pass a real JSON body from the client side
                    const {
                      contract,
                      actionName,
                      actionData,
                      permissions
                    } = req.body && Object.keys(req.body).length > 0 ? req.body : this.transactionData;
            
                    // Build the action object
                    const action = {
                      account: contract,
                      name: actionName,
                      authorization: (permissions || []).map((p: string) => {
                        const [actor, perm] = p.split('@');
                        return { actor, permission: perm };
                      }),
                      data: actionData
                    };
            
                    const actions = await anyToAction(action);
                    
                    // Get chain info
                    const info = await wire.v1.chain.get_info();
                    const header = info.getTransactionHeader();
            
                    // Build the transaction
                    const transaction = Transaction.from({ ...header, actions });
            
                    // Compute the digest
                    const digest = transaction.signingDigest(info.chain_id);
            
                    // Generate a random id for storing
                    const txId = Math.random().toString(36).substring(2, 15);
            
                    // Save it in the store
                    txStore.set(txId, {
                      transaction,
                      chain_id: info.chain_id.toString()
                    });
            
                    return res.json({
                      success: true,
                      txId, digest: digest.hexString
                    });
            
                  } catch (err: any) {
                    console.error('Error in /prepare-transaction', err);
                    return res.status(500).json({ success: false, error: err?.message });
                  }
            })();
            
        });
        


        this.app.post('/push-transaction',  (req : Request , res: Response) => {
            (async () => {
                try {
                    const { txId, signature } = req.body;
                    if (!txId || !signature) {
                      return res.status(400).json({
                        success: false,
                        error: 'Missing txId or signature'
                      });
                    }
            
                    // Retrieve from store
                    const entry = txStore.get(txId);
                    if (!entry) {
                      return res.status(400).json({ success: false, error: 'Invalid txId' });
                    }
            
                    const { transaction, chain_id } = entry;
            
                    // Convert the EVM signature to WIRE
                    const wireSig = evmSigToWIRE(signature, 'EM');
            
                    // Build the signed transaction
                    const signedTrx = SignedTransaction.from({
                      ...transaction,
                      signatures: [wireSig]
                    });
            
                    // Push
                    const result = await wire.v1.chain.push_transaction(signedTrx);
            
                    // remove from store
                    txStore.delete(txId);
            
                    return res.json({ success: true, result });
            
                  } catch (error: any) {
                    console.error('Error in /push-transaction', error);
                    return res.status(500).json({ success: false, error: error?.message });
                  }
                })();
            })
            


        this.app.get('/txdata', (req, res) => {
            res.json(this.transactionData);
        });

        this.server = this.app.listen(3000, () => {
            this.isListening = true;
            console.log('LISTENING ON PORT :', 3000);

            exec(`xdg-open http://127.0.0.1:3000`, (err) => {
                if (err) {
                  console.error('Failed to open in browser:', err);
                }
            });
        });


        return this.subject;
    }
}



const CLIOServer = new CLIOHTMLServer();
export default CLIOServer;



