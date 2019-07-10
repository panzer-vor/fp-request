import mergeConfig from '../../src/core/mergeConfig'

describe('core: mergeConfig', () => {
  test('deepMergeStrat default', () => {
    const config = {
      method: 'post'
    }
    expect(mergeConfig(config)).toEqual(config)
  })
})
