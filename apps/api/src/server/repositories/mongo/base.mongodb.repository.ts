import { Repository } from '@app/server/repositories'
import { Db } from 'mongodb'

export const MongoEthVM = {
  collections: {
    balances: 'balances',
    blocks: 'blocks',
    blockMetrics: 'block_metrics',
    contracts: 'contracts',
    transactions: 'transactions',
    uncles: 'uncles',
    pendingTxs: 'pending_transactions',
    statistics: 'aggregate_block_metrics',
    tokenTransfers: 'token_transfers',
    accountMetadata: 'account_metadata',
    tokenExchangeRates: 'token_exchange_rates',
    processingMetadata: 'processing_metadata'
  }
}

export abstract class BaseMongoDbRepository implements Repository {
  constructor(protected readonly db: Db) {}
}
