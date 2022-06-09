import { expect } from 'chai'
import LotteryDlt from 'dlt/index'
import { useMockData } from './helpers'

describe('Test dlt main', function () {
  useMockData()

  it('get point', async function () {
    const dlt = new LotteryDlt(['01', '02', '03', '04', '05'], ['01', '02'])

    dlt.config({
      feedback: output => expect(output).to.matchSnapshot()
    })
    await dlt.check()
  })

  it('get history', async function () {
    const dlt = new LotteryDlt(['01', '02', '03', '04', '05'], ['01', '02'])

    dlt.config({
      feedback: output => expect(output).to.matchSnapshot()
    })
    await dlt.check(22040, 22045)
  })
})
