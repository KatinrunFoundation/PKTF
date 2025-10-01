<h1 align="center">Private Katinrun Foundation Token (PKTF)</h1>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/KatinrunFoundation/PKTF" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://opensource.org/licenses/MIT" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <img alt="Solidity" src="https://img.shields.io/badge/Solidity-0.4.23-363636.svg" />
</p>

> Ethereum-based blockchain voucher system for event management by Katinrun Foundation. Create, distribute, and redeem digital vouchers using smart contracts.

## 📖 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Smart Contracts](#smart-contracts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Components](#components)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

PKTF is an Ethereum-based private token system designed for the Katinrun Foundation to manage event vouchers through blockchain technology. The system consists of:

- **Smart Contracts**: Solidity-based ERC20-compatible token contracts with voucher functionality
- **Voucher Creation**: React-based admin interface for generating vouchers
- **Voucher Redemption**: Angular-based user interface for redeeming vouchers
- **Backend Services**: Node.js API servers handling voucher validation and wallet management
- **Landing Page**: Public-facing information portal

## 🏗 Architecture

### Voucher Creation Flow
<p align="center"><img src="images/PKTF-VoucherDiagram-Voucher Creation(v2).png" width="600"></p>

### Voucher Redemption Flow
<p align="center"><img src="images/PKTF-VoucherDiagram-Voucher Redeem(v2).png" width="600"></p>

For detailed architecture information, read: [Architecture Design of Ethereum-Based Private Katinrun Foundation Token](https://medium.com/@serial_coder/architecture-design-of-ethereum-based-private-katinrun-foundation-token-9306f65ac85e)

## 📁 Project Structure

```
PKTF/
├── contracts/                    # Solidity smart contracts
│   ├── PrivateKatinrunFoudation.sol
│   ├── MintableWithVoucher.sol
│   └── ...
├── migrations/                   # Truffle deployment scripts
├── test/                        # Smart contract tests
├── landing-page/                # React landing page
├── voucher-react/               # React voucher creation app
└── voucher-redeem/
    ├── backend/                 # Node.js API server
    └── frontend/                # Angular redemption app
```

## 📋 Prerequisites

- **Node.js**: >= 18.19.0
- **npm**: >= 9.0.0
- **Truffle**: For smart contract compilation and deployment
- **Ganache**: Local Ethereum blockchain for development
- **MetaMask**: Browser extension for Web3 interaction

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/KatinrunFoundation/PKTF.git
cd PKTF
```

### 2. Install dependencies

#### Root project (Truffle/Smart Contracts)
```bash
npm install
```

#### Landing Page
```bash
cd landing-page
npm install
```

#### Voucher Creation App
```bash
cd voucher-react
npm install
```

#### Redemption Backend
```bash
cd voucher-redeem/backend
npm install
```

#### Redemption Frontend
```bash
cd voucher-redeem/frontend
npm install
```

## 💻 Usage

### Start Local Blockchain

```bash
npm install -g ganache-cli
ganache-cli
```

### Compile Smart Contracts

```bash
npm run compile
```

### Migrate Contracts

```bash
npm run migrate
```

### Run Landing Page

```bash
cd landing-page
npm start
```

Access at: `http://localhost:3000`

### Run Voucher Creation App

```bash
cd voucher-react
npm start
```

Access at: `http://localhost:3000`

### Run Redemption Backend

```bash
cd voucher-redeem/backend
npm start
```

API available at: `http://localhost:3001`

### Run Redemption Frontend

```bash
cd voucher-redeem/frontend
npm start
```

Access at: `http://localhost:4200`

## 📜 Smart Contracts

### Main Contracts

- **PrivateKatinrunFoudation.sol**: Main PKTF token contract
- **MintableWithVoucher.sol**: Extends token with voucher minting capabilities
- **PrivateToken.sol**: Base private token implementation
- **PartialERC20.sol**: ERC20 interface implementation

### Contract Features

- ERC20-compatible token standard
- Voucher-based minting system
- Access control for token creation
- Migration support from legacy tokens
- Event emission for transparency

## 🧪 Testing

Run the complete test suite:

```bash
npm run test
```

Run specific test file:

```bash
truffle test test/YourTest.js
```

## 🚢 Deployment

### Deploy to Kovan Testnet

1. Configure your `.env` file with:
   - `MNEMONIC`: Your wallet seed phrase
   - `INFURA_API_KEY`: Your Infura API key

2. Deploy:

```bash
npm run migrate-kovan
```

### Deploy to Mainnet

Update `truffle-config.js` with mainnet configuration and run:

```bash
truffle migrate --network mainnet
```

## 🧩 Components

### Landing Page
- Built with React 18
- Styled with styled-components
- Responsive design with Rebass

### Voucher Creation (voucher-react)
- React 18 application
- Web3.js integration for blockchain interaction
- QR code generation for vouchers
- Semantic UI for interface
- Date/time picker for voucher expiration

### Redemption Backend
- Express.js REST API
- Firebase Admin for authentication
- Web3 integration for on-chain verification
- Helmet for security
- CORS enabled
- Cron jobs for automated tasks

### Redemption Frontend
- Angular 18 application
- Firebase integration
- Web3 integration
- SweetAlert2 for notifications
- Bootstrap 5 UI framework

## 🔧 Configuration

### Truffle Configuration

Edit `truffle-config.js` or `truffle.js` to:
- Configure network settings
- Set compiler versions
- Adjust gas limits
- Configure deployment accounts

### Firebase Configuration

Add your Firebase config to:
- `voucher-redeem/backend/` - Service account credentials
- `voucher-redeem/frontend/src/environments/` - Firebase config

## 📚 Available Scripts

### Root Project
- `npm run compile` - Compile smart contracts
- `npm run migrate` - Deploy contracts locally
- `npm run test` - Run contract tests
- `npm run migrate-kovan` - Deploy to Kovan testnet
- `npm run console` - Open Truffle console
- `npm run version` - Show Truffle version

### React Apps (landing-page, voucher-react)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Angular App (voucher-redeem/frontend)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Lint code
- `npm run e2e` - Run e2e tests

### Backend (voucher-redeem/backend)
- `npm start` - Start server

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Feel free to check the [issues page](https://github.com/KatinrunFoundation/PKTF/issues).

## 👥 Author

**Katinrun Foundation**

- GitHub: [@KatinrunFoundation](https://github.com/KatinrunFoundation)

## 📝 License

Copyright © 2019-2025 [Katinrun Foundation](https://github.com/KatinrunFoundation)

This project is [MIT](LICENSE) licensed.

## ⭐ Show Your Support

Give a star if this project helped you!

---

## 🔗 Additional Resources

- [Truffle Documentation](https://trufflesuite.com/docs/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [React Documentation](https://react.dev/)
- [Angular Documentation](https://angular.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
