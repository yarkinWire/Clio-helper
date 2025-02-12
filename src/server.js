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
exports.CLIOHTMLServer = void 0;
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = require("express-handlebars");
const rxjs_1 = require("rxjs");
const child_process_1 = require("child_process");
const core_1 = require("../lib/core");
const wns_1 = require("@wireio/wns");
// If you're using localhost
const wire = new core_1.APIClient({ provider: new core_1.FetchProvider('http://127.0.0.1:8888') });
// If you're using testnet on hub
// const wire = new APIClient({provider: new FetchProvider('https://testnet-lb.wire.foundation')});
// const wire = new APIClient({provider: new FetchProvider('https://testnet-00.wire.foundation')});
function anyToAction(action) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(action))
            action = [action];
        const actions = [];
        const knownAbis = new Map();
        for (const act of action) {
            if (!knownAbis.has(act.account)) {
                const abi_res = yield wire.v1.chain.get_abi(act.account);
                knownAbis.set(act.account, core_1.ABI.from(abi_res.abi));
            }
            actions.push(core_1.Action.from(act, knownAbis.get(act.account)));
        }
        return actions;
    });
}
const txStore = new Map();
class CLIOHTMLServer {
    constructor() {
        this.isListening = false;
        this.transactionData = {};
    }
    // transaction data passes to the home page
    listen(transactionData) {
        if (this.isListening) {
            this.transactionData = transactionData;
            console.log("Server is already running. Updated transaction data.");
            return this.subject;
        }
        this.subject = new rxjs_1.Subject();
        this.transactionData = transactionData;
        this.app = (0, express_1.default)();
        this.app.engine('handlebars', (0, express_handlebars_1.engine)());
        this.app.set('view engine', 'handlebars');
        this.app.set('views', './views');
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static('public'));
        this.app.get('/', (req, res) => {
            // res.render('home', {something: 'my content1', trx_data: JSON.stringify(transactionData)});
            res.render('home', {
                something: 'my content2',
                trx_data: JSON.stringify(transactionData),
                contract: transactionData.contract || '',
                actionName: transactionData.actionName || '',
                actionData: transactionData.actionData ? JSON.stringify(transactionData.actionData, null, 2) : '',
                permissions: transactionData.permissions ?
                    Array.isArray(transactionData.permissions)
                        ? transactionData.permissions.join(', ')
                        : transactionData.permissions
                    : '',
            });
        });
        this.app.post('/prepare-transaction', (req, res) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    // If nothing is passed in req.body, fallback to our "transactionData"
                    // Or can pass a real JSON body from the client side
                    const { contract, actionName, actionData, permissions } = req.body && Object.keys(req.body).length > 0 ? req.body : this.transactionData;
                    // Build the action object
                    const action = {
                        account: contract,
                        name: actionName,
                        authorization: (permissions || []).map((p) => {
                            const [actor, perm] = p.split('@');
                            return { actor, permission: perm };
                        }),
                        data: actionData
                    };
                    const actions = yield anyToAction(action);
                    // Get chain info
                    const info = yield wire.v1.chain.get_info();
                    const header = info.getTransactionHeader();
                    // Build the transaction
                    const transaction = core_1.Transaction.from(Object.assign(Object.assign({}, header), { actions }));
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
                }
                catch (err) {
                    console.error('Error in /prepare-transaction', err);
                    return res.status(500).json({ success: false, error: err === null || err === void 0 ? void 0 : err.message });
                }
            }))();
        });
        this.app.post('/push-transaction', (req, res) => {
            (() => __awaiter(this, void 0, void 0, function* () {
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
                    const wireSig = (0, wns_1.evmSigToWIRE)(signature, 'EM');
                    // Build the signed transaction
                    const signedTrx = core_1.SignedTransaction.from(Object.assign(Object.assign({}, transaction), { signatures: [wireSig] }));
                    // Push
                    const result = yield wire.v1.chain.push_transaction(signedTrx);
                    // remove from store
                    txStore.delete(txId);
                    return res.json({ success: true, result });
                }
                catch (error) {
                    console.error('Error in /push-transaction', error);
                    return res.status(500).json({ success: false, error: error === null || error === void 0 ? void 0 : error.message });
                }
            }))();
        });
        this.app.get('/txdata', (req, res) => {
            res.json(this.transactionData);
        });
        this.server = this.app.listen(3000, () => {
            this.isListening = true;
            console.log('LISTENING ON PORT :', 3000);
            (0, child_process_1.exec)(`xdg-open http://127.0.0.1:3000`, (err) => {
                if (err) {
                    console.error('Failed to open in browser:', err);
                }
            });
        });
        return this.subject;
    }
}
exports.CLIOHTMLServer = CLIOHTMLServer;
const CLIOServer = new CLIOHTMLServer();
exports.default = CLIOServer;
