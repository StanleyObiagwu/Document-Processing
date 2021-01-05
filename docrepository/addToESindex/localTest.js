

// Mock event
const event = require('./localTestEvent')

// Mock environment variables
process.env.AWS_REGION = 'us-east-1'
process.env.localTest = true
process.env.language = 'en'
process.env.OutputBucket = 'patterns-docrepo-parts'
process.env.domain = 'search-patterns-doc-repo-7uqoatjkcqwdgdv6oo5oqb7whq.us-east-1.es.amazonaws.com'

// Lambda handler
const { handler } = require('./app')

const main = async () => {
  console.time('localTest')
  await handler(event)
  console.timeEnd('localTest')
}

main().catch(error => console.error(error))