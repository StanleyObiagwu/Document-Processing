

'use strict'

const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION 
const sqs = new AWS.SQS({apiVersion: '2012-11-05'})

let messages = []

// The Lambda handler
exports.handler = async (event) => {
  console.log (JSON.stringify(event, null, 2))

  // Iterate through incoming records and language list
  event.Records.map((record) => {
    messages.push({
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key,
      Language: process.env.language
    })
  })

  console.log('Messages for SQS: ', messages)

  // Send array of messages to SQS
  try {
    await addToSQS(messages)
  } catch (err) {
    console.error(err)
  }
}

// Add items to addToSQS
const addToSQS = async (messages) => {
  // Separate into batches for upload
  let batches = []
  const BATCH_SIZE = 10

  while (messages.length > 0) {
    batches.push(messages.splice(0, BATCH_SIZE))
  }

  console.log(`Total batches: ${batches.length}`)
  let batchCount = 0

  // Save each batch
  await Promise.all(
    batches.map(async (item_data) => {

      const items = []
  
      item_data.forEach(async item => {
        items.push({
          Id: `${Date.now()}-${parseInt(Math.random()*100000)}`,
          MessageBody: JSON.stringify(item)
        })
      })

      // Params object for SQS
      const params = {
        Entries: items,
        QueueUrl: process.env.SQSqueueName
      }
      
      console.log(JSON.stringify(params, null, 2))

      // Push to SQS in batches
      try {
        batchCount++
        console.log(`Trying batch: ${batchCount}`)
        const result = await sqs.sendMessageBatch(params).promise()
        console.log(`Success: ${result}`)
      } catch (err) {
        console.error(`Error: ${err}`)
      }
    })
  )
}
