import intersection from 'lodash/intersection'
import type {
  LotteryRedNumber,
  LotteryBlueNumber,
  LotteryPoint,
  LotteryPointId
} from './service'
import { getHistoryPoint, getPoint } from './service'
import * as view from './view'

interface Config {
  reportTo: string
  lowest: number
  feedback: (
    data: Array<Omit<LotteryPoint, 'prizes'> & { reward: number }>
  ) => void
}

export default class LotteryDlt {
  public readonly red: LotteryRedNumber
  public readonly blue: LotteryBlueNumber
  private _config: Config = {
    reportTo: '',
    lowest: 0,
    feedback: data => {
      const output = view.cli(
        data,
        {
          red: this.red,
          blue: this.blue
        },
        this.viewConfig
      )

      console.log(output)
    }
  }

  constructor(
    red: LotteryRedNumber,
    blue: LotteryBlueNumber,
    userConfig: Partial<Config> = {}
  ) {
    this.red = red
    this.blue = blue
    this._config = { ...this._config, ...userConfig }
  }

  get viewConfig(): { lowest: number } {
    return { lowest: this._config.lowest }
  }

  public config(userConfig: Partial<Config> = {}): void {
    this._config = { ...this._config, ...userConfig }
  }

  public report(email: string): LotteryDlt {
    if (this._config.reportTo) return this
    return new LotteryDlt(this.red, this.blue, { reportTo: email })
  }

  public async check(
    start?: LotteryPointId,
    end?: LotteryPointId
  ): Promise<void> {
    const { feedback } = this._config
    const data =
      start !== undefined && end !== undefined
        ? await LotteryDlt.checkPeriod(start, end)
        : await LotteryDlt.checkPoint(start)

    if (data.length)
      feedback(
        data.map(point => ({ ...point, reward: this.getRewardValue(point) }))
      )
  }

  private static async checkPoint(
    id?: LotteryPointId
  ): Promise<LotteryPoint[]> {
    const point = await getPoint(id)

    if (!point) return []
    return [point]
  }

  private static async checkPeriod(
    start: LotteryPointId,
    end: LotteryPointId
  ): Promise<LotteryPoint[]> {
    const history = await getHistoryPoint(start, end)

    if (!history.length) return []
    return history
  }

  private getRewardValue(point: LotteryPoint) {
    const checked = {
      red: intersection(point.red, this.red),
      blue: intersection(point.blue, this.blue)
    }
    const reward = point.prizes[`${checked.red.length}+${checked.blue.length}`]

    return reward ?? 0
  }
}
