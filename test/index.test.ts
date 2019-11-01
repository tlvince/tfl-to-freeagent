import { convert, Params } from '../src'
import { promises as fsP } from 'fs'

interface SetupResponse {
  csvFixture: string
}

const setup = async (): Promise<SetupResponse> => {
  const buffer = await fsP.readFile('./test/fixtures/tfl.csv')
  const csvFixture = buffer.toString()
  return {
    csvFixture,
  }
}

describe('convert', () => {
  it('should handle a well-formed CSV', async () => {
    const { csvFixture } = await setup()
    /* eslint-disable @typescript-eslint/camelcase */
    const params: Params = {
      claimant_name: 'Foo',
      project_client: 'Fez Consulting Ltd',
      project_name: 'Business Strategy',
    }
    /* eslint-enable @typescript-eslint/camelcase */
    const converted = await convert(csvFixture, params)
    expect(converted).toMatchSnapshot()
  })
})
