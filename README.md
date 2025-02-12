# clio-helper

A CLI tool for interacting with `sdk-core` and `sdk-wns`, enabling command-line operations on Wire blockchain applications.

## Prerequisites

You should have Node JS. installed on your computer
To manage Node installation and versions install [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) first.

Required NodeJS version - v20.16.0

- ### Node

```sh
nvm install 20.16.0
```

Once installed, you can set a specific Node version in your project:

```sh
nvm use 20.16.0
```

Check Node version: `node -v`

---

## Development

### Install Dependencies

```sh
npm install 
```

### Build

To compile the TypeScript source code, run:

```sh
npm run build 
```

### Link executable

To test the CLI tool locally, link it globally.  

```sh
npm link
```

This command creates a global symlink, allowing you to run clio-helper from anywhere in your terminal.

> **ℹ️ Note:**  
> By default, the RPC endpoint is set to a local node running on **port 8888**.  
> To connect to a different RPC, update the URL in `server.ts`:  
>
> ```ts
> const wire = new APIClient({ provider: new FetchProvider('http://127.0.0.1:8888') });
> ```  
>
> Replace `'http://127.0.0.1:8888'` with the desired RPC URL as needed.
>
#### Example

```sh
clio-helper push action sysio.token transfer '{"from":"jovi1","to":"yarkin","quantity":"0.1000 SYS","memo":"TAKE IT"}'   -p jovi1@active   --external
```

This command will open the app on port 3000, then you can connect your Metamask wallet and attempt to push transaction.

## Deployment

TBD

## License

[FSL-1.1-Apache-2.0](./LICENSE.md)

<!-- markdownlint-disable MD033 -->
<table>
  <tr>
    <td><img src="https://bucket.gitgo.app/frontend-assets/icons/favicon.ico" alt="Wire Network" width="50"/></td>
    <td>
      <strong>Wire Network</strong><br>
      <a href="https://www.wire.network/">Website</a> |
      <a href="https://x.com/wire_blockchain">Twitter</a> |
      <a href="https://www.linkedin.com/company/wire-network-blockchain/">LinkedIn</a><br>
      © 2024 Wire Network. All rights reserved.
    </td>
  </tr>
</table>
