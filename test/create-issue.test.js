const createIssue = require('../src/create-issue')

describe('Create Issue', () => {
  test('create issue request succeeds', async () => {

    const api = {
      issues: {
        create: jest.fn((vals) => Promise.resolve({...vals, data: {html_url: 'html_url'}}))
        }
    }


    const state = {
      api,
      debug: jest.fn(),
      owner: 'owner',
      branch: 'branch',
      issueRepo: 'issueRepo',
      installRepo: 'installRepo',
      sha: 'sha',
      labels: 'label-1',
      commit: {
        message: 'title\n\ndescription',
        patch: 'patch',
        filename: 'filename',
        branchUrl: 'branchUrl'
      },
      template: 'test value1: $DIFF value2: $FILENAME value3: $BRANCH_URL value4: $REPO'
    }
    const response = await createIssue(state)
    expect(response.data.html_url).toEqual('html_url');
    expect(response.title).toEqual('title')
    expect(response.body).toEqual('test value1: patch value2: filename value3: branchUrl value4: installRepo')
    expect(response.repo).toEqual('issueRepo')
    expect(response.labels).toEqual('label-1')
    expect(response.owner).toEqual('owner')
  })
  
  test('create issue request fails', async () => {
    const api = {
      issues: {
        create: jest.fn().mockRejectedValue({
          code: 404
        })
      }
    }

    const state = {
      api,
      debug: () => {},
      owner: 'owner',
      branch: 'branch',
      repo: null,
      sha: 'sha',
      labels: ['label-1', 'label-2'],
      commit: {
        message: 'title',
        patch: 'patch',
        filename: 'filename',
        branchUrl: 'branchUrl'
      },
      template: 'test value1: $DIFF value2: $FILENAME value3: $BRANCH_URL value4: $REPO'
    }
  
    await expect(createIssue(state)).rejects.toEqual({
      code: 404
    });
  })
})