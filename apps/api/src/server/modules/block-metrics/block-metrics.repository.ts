import { toBlockMetrics } from '@app/server/modules/block-metrics'
import { BaseMongoDbRepository, MongoEthVM } from '@app/server/repositories'
import { BlockMetrics } from "ethvm-common"

export interface BlockMetricsRepository {
  getBlockMetric(hash: string): Promise<BlockMetrics | null>
  getBlockMetrics(limit: number, page: number): Promise<BlockMetrics[]>
}

export class MongoBlockMetricsRepository extends BaseMongoDbRepository implements BlockMetricsRepository {

  public getBlockMetric(hash: string): Promise<BlockMetrics | null> {
    return this.db
      .collection(MongoEthVM.collections.blockMetrics)
      .findOne({ hash })
      .then(resp => resp ? toBlockMetrics(resp) : null)
  }

  public getBlockMetrics(limit: number, page: number): Promise<BlockMetrics[]> {
    const start = page * limit
    return this.db
      .collection(MongoEthVM.collections.blockMetrics)
      .find()
      .sort({ '_id': -1 })
      .skip(start)
      .limit(limit)
      .toArray()
      .then(resp => resp ? resp.map(stat => toBlockMetrics(stat)) : [])
  }
}
