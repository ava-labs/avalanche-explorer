# Avalanche Explorer

Frontend Vue.js application for displaying Avalanche network activity and blockchains data from the [Ortelius indexer](https://github.com/ava-labs/ortelius) and [Gecko client](https://github.com/ava-labs/gecko).

## Prerequisites

- Node v12.14

## Installation

1) `yarn install`

## Development

1) `yarn serve` - project runs with hot reloading

When you go to the app on your browser, you might get a warning saying "Site is not secure." This is because we are signing our own SSL Certificates. Please ignore and continue to the website.

## Configuration

See `.env.example`. By default, the Avalanche Explorer interfaces with the Denali test network. 

To connect to a local network, install and run instances of:
- Data indexing backend [Ortelius](https://github.com/ava-labs/ortelius).
- Avalanche clients via [Gecko](https://github.com/ava-labs/gecko) or [Avash](https://github.com/ava-labs/avash).

## Known Addresses

The file `/src/known_addresses.ts` is a dictionary that maps an address to a name. This can be customized freely. 
