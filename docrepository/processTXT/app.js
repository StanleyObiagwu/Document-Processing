

'use strict'

const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION 
const comprehend = new AWS.Comprehend({apiVersion: '2017-11-27'})
//const textract = new AWS.Textract({apiVersion: '2018-06-27'})

const s3 = new AWS.S3()


// Invoked when a DOCX is put into the source
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

  console.log(result)
  try {
    // Extract text from  TEXT
    const text = result.Body.toString()
    console.log('TXT length: ', text.length)
    
    // Write result to staging S3 bucket
    console.log(await s3.putObject({
      Bucket: process.env.OutputBucket,
      Key: `txt/${Key}.txt`,
      Body: text,
      ContentType: 'application/text'
    }).promise())

  } catch (err) {
    console.error(`Handler error: ${err}`)
  }
}
