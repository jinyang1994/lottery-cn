const { LotteryDlt } = require('../lib')

const formatSelected = str => {
  try {
    const [redStr, blueStr] = str.split('-')
    const red = redStr.split(',')
    const blue = blueStr.split(',')

    if (red.length !== 5 || blue.length !== 2) throw new Error()
    return { red, blue }
  } catch {
    return null
  }
}

require('yargs').command(
  'dlt <selected>',
  '中国体育彩票超级大乐透',
  yargs =>
    yargs
      .positional('selected', {
        describe: '所选号码 - 例如：01,02,03,04,05-01,02'
      })
      .option('start', {
        describe: '查询起始期号 - 例如：22011',
        type: 'number'
      })
      .option('end', {
        describe: '查询截止期号 - 例如：22012',
        type: 'number'
      })
      .option('point-id', {
        describe: '查询指定期号 - 例如：22012',
        type: 'number'
      })
      .option('lowest', {
        describe: '过滤每期中奖金额 - 例如：5',
        type: 'number'
      }),
  ({ selected, start, end, pointId, lowest }) => {
    const { red, blue } = formatSelected(selected)
    const dlt = new LotteryDlt(red, blue)

    if (pointId) {
      dlt.check(pointId, lowest && { lowest })
    } else {
      dlt.check(start || null, end || null, lowest && { lowest })
    }
  }
)
