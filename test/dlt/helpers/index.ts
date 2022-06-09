import { mock } from 'test/helpers'
import data from './data.json'

export const useMockData = (): void => {
  before('set mock adapter to axios', function () {
    mock.onGet('https://api.jisuapi.com/caipiao/history').reply(config => {
      const { start, num, issueno, caipiaoid } = config.params
      const list = (
        issueno
          ? data.filter(
              item => parseInt(item.issueno, 10) < parseInt(issueno, 10)
            )
          : data
      ).slice(start, num)

      return [
        200,
        {
          result: {
            caipiaoid,
            total: data.length,
            start: start ?? 0,
            num: num ?? 10,
            list
          }
        }
      ]
    })

    mock.onGet('https://api.jisuapi.com/caipiao/query').reply(config => {
      const { issueno } = config.params
      const result = issueno
        ? data.find(item => item.issueno === issueno.toString())
        : data[0]

      return [200, { result: result || '' }]
    })
  })

  after('reset mock', function () {
    mock.reset()
  })
}
