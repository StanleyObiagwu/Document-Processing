

'use strict'

const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION 
const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'})
const s3 = new AWS.S3()

// Invoked when a JPG image is put into the source
// bucket. Sends image to Rekognition to detect
// content and stores labels in OutputBucket.

// The standard Lambda handler
exports.handler = async (event) => {

  console.log(JSON.stringify(event, null, 2))
  
  // Handle each incoming S3 object in the event
  await Promise.all(
    event.Records.map(async (event) => {
      try {
        await processImage(event)
      } catch (err) {
        console.error(`Handler error: ${err}`)
      }
    })
  )
}

const processImage = async (event) => {

  // Get object info
  const Bucket = event.s3.bucket.name
  const Name = event.s3.object.key
  console.log(`Bucket: ${Bucket}, Key: ${Name}`)

  // Rekognition expected params
  const params = {
    Image: {
      S3Object: {
        Bucket, 
        Name
      }
    }, 
    MaxLabels: process.env.MaxLabels, 
    MinConfidence: process.env.MinConfidence
  }
  console.log('Params: ', params)

  try {
    // Send image to Rekognition
    const data = await rekognition.detectLabels(params).promise()
    // Extract key output attributes
    const labels = data.Labels.map((label) => ({Name: label.Name, Confidence: label.Confidence}))
    console.log('Rekognition labels: ', labels)

    // Write result to output S3 bucket
    console.log(await s3.putObject({
      Bucket: process.env.OutputBucket,
      Key: `images/${Name}.json`,
      Body: JSON.stringify(labels),
      ContentType: 'application/json'
    }).promise())
  } catch (err) {
    console.error(`Handler error: ${err}`)
  }
}
