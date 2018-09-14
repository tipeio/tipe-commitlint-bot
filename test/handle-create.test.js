const handleCreateEvent = require('../src/handle-create-event')

describe('Handle Create Event', () => {
  test('should return for a ref that is not a branch', async () => {
    const context = {
      payload: {
      ref: 'myref',
      ref_type: 'repository',
      repository: {
        name: 'test',
        full_name: 'olivia/test'
      }},
      config: jest.fn(),
      log: {
        debug: jest.fn()
      }
    }
    const res = await handleCreateEvent(context)
    expect(res).toBeUndefined()
  })
  test('should return for a branch that does not match first-tipers', async () => {
    const context = {
      payload: {
      ref: 'first-yolo-',
      ref_type: 'branch',
      repository: {
        name: 'test',
        full_name: 'olivia/test'
      }},
      config: jest.fn(),
      log: {
        debug: jest.fn()
      }
    }
    const res = await handleCreateEvent(context)
    expect(res).toBeUndefined()

  })
})