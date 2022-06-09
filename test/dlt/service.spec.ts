import { expect } from 'chai'
import { getPoint, getHistoryPoint } from 'dlt/service'
import { useMockData } from './helpers'

describe('Test dlt service', function () {
  useMockData()

  it('get point', async function () {
    const point = await getPoint()

    expect(point?.id).to.equal(22055)
    expect(point?.red.length).to.equal(5)
    expect(point?.blue.length).to.equal(2)
    expect(point?.prizes).to.have.all.keys(
      '5+2',
      '5+1',
      '5+0',
      '4+2',
      '4+1',
      '4+0',
      '3+2',
      '3+1',
      '3+0',
      '2+2',
      '2+1',
      '2+0',
      '1+2'
    )
  })

  it('get point base id', async function () {
    const point = await getPoint(22011)

    expect(point?.id).to.equal(22011)
  })

  it('get history point', async function () {
    const history = await getHistoryPoint()
    const [point] = history

    expect(history.length).to.equal(1)
    expect(point.id).to.equal(22055)
    expect(point.red.length).to.equal(5)
    expect(point.blue.length).to.equal(2)
    expect(point.prizes).to.have.all.keys(
      '5+2',
      '5+1',
      '5+0',
      '4+2',
      '4+1',
      '4+0',
      '3+2',
      '3+1',
      '3+0',
      '2+2',
      '2+1',
      '2+0',
      '1+2'
    )
  })

  it('get history point base on start only', async function () {
    const history = await getHistoryPoint(22053, null)
    const [point22055, point22054, point22053] = history

    expect(point22055.id).to.equal(22055)
    expect(point22054.id).to.equal(22054)
    expect(point22053.id).to.equal(22053)
  })

  it('get history point base on start and end', async function () {
    const history = await getHistoryPoint(22020, 22024)
    const [point22024, point22023, point22022, point22021, point22020] = history

    expect(point22024.id).to.equal(22024)
    expect(point22023.id).to.equal(22023)
    expect(point22022.id).to.equal(22022)
    expect(point22021.id).to.equal(22021)
    expect(point22020.id).to.equal(22020)
  })
})
