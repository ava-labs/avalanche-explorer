# DEPRECATION NOTICE

This project is in **deprecated**, and the Avalanche Explorer is in the process of being migrated to this [React App](https://github.com/ava-labs/explorer-v2) instead. As such, some URLs will redirect to the new explorer experience as it is developed, starting with the Home page and C-Chain page.

# Avalanche Explorer

Frontend Vue.js application for displaying Avalanche network activity and blockchains data from the [Ortelius indexer](https://github.com/ava-labs/ortelius) and [Avalanche-Go client](https://github.com/ava-labs/gecko).

## Prerequisites

-   Node v14

## Installation

1. `yarn install`

## Development

1. `yarn serve` - project runs with hot reloading

When you go to the app on your browser, you might get a warning saying "Site is not secure." This is because we are signing our own SSL Certificates. Please ignore and continue to the website.

## Configuration

See `.env`. By default, the Avalanche Explorer interfaces with the Everest test network.

For local development against ortelius and avalanche go, use the docker container setup by the ortelius team. Info can be
found [here](https://github.com/ava-labs/ortelius#quick-start-with-standalone-mode). You can also connect to a local network you setup yourself, install and run
instances by following the instructions found in each lib:

-   Data indexing backend [Ortelius](https://github.com/ava-labs/ortelius).
-   Avalanche clients via [Avalanche-Go](https://github.com/ava-labs/gecko) or [Avash](https://github.com/ava-labs/avash).

Once those are stood up and running, run `yarn serve:local` the application will use the configs in the `.env.hosted` file as the base urls for ortelius and avalanche go

## Services

When creating http requests, do so from a service abstraction layer. refer to src/service/\* for an example. The http layer, models and helpers should all be centralized into this layer.

## Known Addresses

The file `/src/known_addresses.ts` is a dictionary that maps an address to a name. This can be customized freely.
