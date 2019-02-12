import { Block } from '@app/core/models'

const dedup = (block: Block, pastBlocks: Block[]): Block[] => {
  for (let i = 0; i < pastBlocks.length; i++) {
    if (block.getId() === pastBlocks[i].getId()) {
      pastBlocks.splice(i, 1)
    }
  }
  return pastBlocks
}

export const processBlocks = (block: Block, pastBlocks: Block[]): Block[] => {
  const blocks = dedup(block, pastBlocks)
  blocks.push(block)
  return blocks
}
