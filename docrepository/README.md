# S3-to-Elasticsearch 

This repo contains an AWS SAM template that deploys a serverless application. This application uses Amazon ML services like Comprehend and Rekognition to index documents and images, and then sends the results to Elasticsearch for fast indexing.

This architecture is designed for large numbers of documents by using queuing. 

Important: this application uses various AWS services and there are costs associated with these services after the Free Tier usage. You are responsible for any AWS costs incurred.

```bash
.
├── README.MD                   <-- This instructions file
├── addToQueueFunction          <-- Source code for a lambda function
│   └── app.js                  <-- Main Lambda handler
│   └── package.json            <-- NodeJS dependencies and scripts
├── batchingFunction            <-- Source code for a lambda function
│   └── app.js                  <-- Main Lambda handler
│   └── package.json            <-- NodeJS dependencies and scripts
├── addToESindex                <-- Source code for a lambda function
│   └── app.js                  <-- Main Lambda handler
│   └── package.json            <-- NodeJS dependencies and scripts
├── processDOCX                 <-- Source code for a lambda function
│   └── app.js                  <-- Main Lambda handler
│   └── package.json            <-- NodeJS dependencies and scripts
├── processJPG                  <-- Source code for a lambda function
│   └── app.js                  <-- Main Lambda handler
│   └── package.json            <-- NodeJS dependencies and scripts
├── processPDF                  <-- Source code for a lambda function
│   └── app.js                  <-- Main Lambda handler
│   └── package.json            <-- NodeJS dependencies and scripts
├── processTXT                  <-- Source code for a lambda function
│   └── app.js                  <-- Main Lambda handler
│   └── package.json            <-- NodeJS dependencies and scripts
├── template.yaml               <-- SAM template
```

## Requirements

* AWS CLI already configured with Administrator permission
* [NodeJS 12.x installed]

## Installation Instructions

1. Create an AWS account if you do not already have one and login.

2. Clone the repo onto your local development machine using `git clone`.

3. From the command line, run:
```
sam build
sam deploy --guided
```
Follow the prompts in the deploy process to set the stack name, AWS Region, unique bucket names, Elasticsearch domain endpoint, and other parameters.

## How it works

* Ensure you have an Elasticsearch instance running, and have granted permission to the ARN for the "AddToESFunction" Lambda function in this stack. 
* Upload a PDF, DOCX, TEXT or JPG file to the target Documents bucket.
* After a few seconds you will see the index in Elasticsearch has been updated with labels, keywords and entities for the object.

==============================================


