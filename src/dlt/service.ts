import axios from 'axios'

interface IPrize {
  prizename: string
  singlebonus: number
}

interface IPointResult {
  issueno: string
  number: string
  refernumber: string
  prize: Array<IPrize>
}

interface IHistoryPointResult {
  total: number
  start: number
  num: number
  list: Array<IPointResult>
}

// numbers type
export type LotteryRedNumber = [string, string, string, string, string]
export type LotteryBlueNumber = [string, string]
export type LotteryPointId = number | null

export interface LotteryPoint {
  id: number
  red: LotteryRedNumber
  blue: LotteryBlueNumber
  prizes: {
    [requirement: string]: number
  }
}

const BASE_URL = 'https://api.jisuapi.com/caipiao/'
// const API_KEY = '025fec680c503ef9'
const API_KEY = '2c1ad428ccaab0f5'

const format = ({
  issueno: id,
  number: red,
  refernumber: blue,
  prize: prizes
}: IPointResult) => {
  const formatedPrizes = Object.fromEntries(
    prizes.map(({ prizename, singlebonus }) => [prizename, singlebonus])
  )

  return {
    id: parseInt(id, 10),
    red: red.split(' ') as LotteryRedNumber,
    blue: blue.split(' ') as LotteryBlueNumber,
    prizes: {
      '5+2': formatedPrizes['一等奖'] || 1_000_000,
      '5+1': formatedPrizes['二等奖'] || 100_000,
      '5+0': formatedPrizes['三等奖'] || 10_000,
      '4+2': formatedPrizes['四等奖'] || 3_000,
      '4+1': formatedPrizes['五等奖'] || 300,
      '3+2': formatedPrizes['六等奖'] || 200,
      '4+0': formatedPrizes['七等奖'] || 100,
      '3+1': formatedPrizes['八等奖'] || 15,
      '2+2': formatedPrizes['八等奖'] || 15,
      '3+0': formatedPrizes['九等奖'] || 5,
      '1+2': formatedPrizes['九等奖'] || 5,
      '2+1': formatedPrizes['九等奖'] || 5,
      '2+0': formatedPrizes['九等奖'] || 5
    }
  }
}

export const getPoint = async (
  id?: LotteryPointId
): Promise<LotteryPoint | null> => {
  const { data } = await axios.get<{ result: IPointResult }>('query', {
    baseURL: BASE_URL,
    params: {
      appkey: API_KEY,
      caipiaoid: 14,
      issueno: id || undefined
    }
  })

  return data.result ? format(data.result) : null
}

export const getHistoryPoint = async (
  start?: LotteryPointId,
  end?: LotteryPointId
): Promise<LotteryPoint[]> => {
  const { data } = await axios.get<{ result: IHistoryPointResult }>('history', {
    baseURL: BASE_URL,
    params: {
      appkey: API_KEY,
      caipiaoid: 14,
      issueno: end || undefined,
      start: 0,
      num: start ? 20 : 1
    }
  })
  const { list } = data.result
  let history: LotteryPoint[] = list
    .map(format)
    .filter(({ id }) => !start || id >= start)
  const hasStartPoint = !start || !!history.find(({ id }) => id <= start)
  const hasEndPoint = !end || !!history.find(({ id }) => id === end)

  // TODO: API can't get 'end point' when setting end in params
  if (!hasEndPoint) {
    const endPoint = await getPoint(end)

    if (endPoint) history = [endPoint, ...history]
  }
  if (!hasStartPoint) {
    const firstPoint = history.reduce(
      (res, item) => (res.id < item.id ? res : item),
      history[history.length - 1]
    )

    history = [...history, ...(await getHistoryPoint(start, firstPoint.id))]
  }

  return history
}

export default getPoint
