

'use strict'

const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION 

const s3 = new AWS.S3()
const pdf = require('pdf-parse')

// Invoked when a PDF is put into the source
// bucket. Extracts text content and saves into
// staging bucket (OutputBucket).

// The standard Lambda handler
exports.handler = async (event) => {

  console.log(JSON.stringify(event, null, 2))

  // Handle each incoming S3 object in the event
  await Promise.all(
   event.Records.map(async (event) => {
     try {
       await processDocument(event)
     } catch (err) {
       console.error(`Handler error: ${err}`)
     }
   })
  )
}

// The standard Lambda handler
const processDocument = async (event) => {

  // Get object info
  const Bucket = event.s3.bucket.name
  const Key = decodeURIComponent(event.s3.object.key.replace(/\+/g, ' '))
    
  console.log(`Bucket: ${Bucket}, Key: ${Key}`)

  // Get content from source S3 object
  const result = await s3.getObject({
    Bucket,
    Key
  }).promise()

  try {
    // Extract text from PDF
    const data = await pdf(result.Body)
    console.log('PDF text length: ', data.text.length)

    // Write result to staging S3 bucket
    console.log(await s3.putObject({
      Bucket: process.env.OutputBucket,
      Key: `pdf/${Key}.txt`,
      Body: data.text,
      ContentType: 'application/text'
    }).promise())

  } catch (err) {
    console.error(`Handler error: ${err}`)
  }
}
