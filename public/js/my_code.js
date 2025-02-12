
// console.log("CODE HERE");

// console.log("LOADED DATA", mydata);


async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed.');
    return;
  }
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    document.querySelector('.showAccount').textContent = accounts[0] || '';
    const currentChainId = await ethereum.request({
        method: 'eth_chainId'
    });
    const chainIdDecimal = parseInt(currentChainId,16);
    document.querySelector('.showChainId').textContent = chainIdDecimal;
    console.log("Connected account:", accounts[0]);
  } catch (error) {
    console.error('Error connecting wallet:', error);
  }
}


async function prepareAndSign() {
  try {
    // 1) Prepare transaction
    const prepareResp = await fetch('/prepare-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ contract: '...', actionName: '...', actionData: {...}, permissions: [...]})
    });
    const prepareData = await prepareResp.json();
    if (!prepareData.success) {
      console.error('Failed to prepare transaction:', prepareData.error);
      alert('Failed to prepare transaction. Check console.');
      return;
    }
    const { txId, digest } = prepareData;
    console.log('Got txId:', txId, ' digest:', digest);

    // 2) Sign the digest with MetaMask
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    
    // personal_sign typically wants [ message, address ]
    const signature = await ethereum.request({
      method: 'personal_sign',
      params: [digest, account],
    });
    console.log('EVM Signature:', signature);

    // 3) Push the transaction with the signature
    const pushResp = await fetch('/push-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txId, signature })
    });
    const pushData = await pushResp.json();
    if (!pushData.success) {
      console.error('Failed to push transaction:', pushData.error);
      alert('Failed to push transaction. Check console.');
      return;
    }

    console.log('Transaction push result:', pushData.result);
    alert('Transaction pushed! See console for details.');

  } catch (error) {
    console.error('Error in prepareAndSign:', error);
  }
}


// Sign the transaction data (here we sign the raw JSON as an example)
// async function onPushTransaction() {
//   if (typeof window.ethereum === 'undefined') {
//     alert('MetaMask is not installed.');
//     return;
//   }
//   try {
//     // For signing, we use the entire transaction data (as shown in the first <pre>)
//     const txData = document.querySelector('pre').innerText;
//     const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
//     const account = accounts[0];
    
//     console.log("TxData ->", txData);

    

    
//     // Use personal_sign (in a real app, compute the proper digest)
//     const signature = await ethereum.request({
//       method: 'personal_sign',
//       params: [txData, account],
//     });
//     console.log('Signature:', signature);
//     alert('Transaction signed successfully!');

//     // Optionally, send the signature back to your server
//     const response = await fetch('/sig', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ signature })
//     });
//     const result = await response.text();
//     console.log('Server response:', result);
//   } catch (error) {
//     console.error('Error signing transaction:', error);
//   }
// }

