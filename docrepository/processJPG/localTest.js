

// Mock event
const event = require('./localTestEvent')

// Mock environment variables
process.env.AWS_REGION = 'us-east-1'
process.env.localTest = true
process.env.MaxLabels = 5
process.env.MinConfidence = 60
process.env.OutputBucket = 'your-bucket-name'

// Lambda handler
const { handler } = require('./app')

const main = async () => {
  console.time('localTest')
  await handler(event)
  console.timeEnd('localTest')
}

main().catch(error => console.error(error))