import { expect } from 'chai'
import * as view from 'dlt/view'

describe('Test dlt view', function () {
  it('simple data', function () {
    const str = view.cli(
      [
        {
          red: ['01', '02', '03', '04', '05'],
          blue: ['01', '02'],
          id: 22011,
          reward: 200
        }
      ],
      { red: ['01', '02', '03', '04', '05'], blue: ['01', '02'] }
    )

    expect(str).to.matchSnapshot()
  })

  it('multiple data', function () {
    const str = view.cli(
      [
        {
          red: ['01', '02', '03', '04', '05'],
          blue: ['01', '02'],
          id: 22011,
          reward: 200
        },
        {
          red: ['01', '02', '09', '10', '12'],
          blue: ['03', '06'],
          id: 22010,
          reward: 10
        }
      ],
      { red: ['01', '02', '03', '04', '05'], blue: ['01', '02'] }
    )

    expect(str).to.matchSnapshot()
  })

  it('use lowest config', function () {
    const str = view.cli(
      [
        {
          red: ['01', '02', '03', '04', '05'],
          blue: ['01', '02'],
          id: 22011,
          reward: 200
        },
        {
          red: ['01', '02', '09', '10', '12'],
          blue: ['03', '06'],
          id: 22010,
          reward: 10
        }
      ],
      { red: ['01', '02', '03', '04', '05'], blue: ['01', '02'] },
      { lowest: 20 }
    )

    expect(str).to.matchSnapshot()
  })

  it('did not win', function () {
    const str = view.cli(
      [
        {
          red: ['01', '02', '03', '04', '05'],
          blue: ['01', '02'],
          id: 22011,
          reward: 0
        },
        {
          red: ['01', '02', '09', '10', '12'],
          blue: ['03', '06'],
          id: 22010,
          reward: 0
        }
      ],
      { red: ['11', '12', '13', '14', '15'], blue: ['11', '12'] },
      { lowest: 20 }
    )

    expect(str).to.matchSnapshot()
  })
})
