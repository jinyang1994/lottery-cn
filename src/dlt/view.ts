import { table, Alignment } from 'table'
import 'colors'
import type {
  LotteryRedNumber,
  LotteryBlueNumber,
  LotteryPoint
} from './service'

const format = (
  numbers: string[],
  selected?: string[],
  setColor?: (num: string) => string
) => {
  if (!setColor || !selected?.length) return numbers.join(' ')
  const reg = new RegExp(selected.join('|'), 'g')
  return numbers.join(' ').replace(reg, match => setColor(match))
}

const toCurrencyString = (amount: number): string =>
  amount.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })

export const cli = (
  history: Array<Omit<LotteryPoint, 'prizes'> & { reward: number }>,
  selected: { red: LotteryRedNumber; blue: LotteryBlueNumber },
  viewConfig = { lowest: 0 }
): string => {
  const list = history.filter(
    item => !viewConfig.lowest || item.reward >= viewConfig.lowest
  )
  const tableConfig = {
    border: {
      topBody: '─',
      topJoin: '┬',
      topLeft: '┌',
      topRight: '┐',

      bottomBody: '─',
      bottomJoin: '┴',
      bottomLeft: '└',
      bottomRight: '┘',

      bodyLeft: '│',
      bodyRight: '│',
      bodyJoin: '│',

      joinBody: '─',
      joinLeft: '├',
      joinRight: '┤',
      joinJoin: '┼'
    },
    spanningCells: [
      {
        col: 0,
        row: list.length + 1,
        colSpan: 3,
        alignment: 'center' as Alignment
      }
    ]
  }
  const totalReward = list.reduce((acc, cur) => acc + cur.reward, 0)
  const data = [
    ['期号', '中奖号码', '奖金'],
    ...list.map(({ id, red, blue, reward }) => {
      const formated = {
        red: format(red, selected.red, num => num.red),
        blue: format(blue, selected.blue, num => num.blue)
      }

      return [
        id,
        `${formated.red} - ${formated.blue}`,
        `${toCurrencyString(reward)}`
      ]
    }),
    [
      totalReward
        ? `恭喜你！奖金总计：${toCurrencyString(totalReward).yellow}`
        : '很遗憾！没有中奖',
      '',
      ''
    ]
  ]

  return table(data, tableConfig)
}

export default cli
