For AWS Marketplace data—specifically from AWS Data Exchange—you cannot simply download a direct URL like a typical CSV. Instead, you "subscribe" to a dataset (even free ones) and then use a script to export that data into your own Amazon S3 bucket. [1, 2, 3] 
## Prerequisites

   1. Subscribe Manually: Go to the [AWS Data Exchange Console](https://console.aws.amazon.com/dataexchange/home), search for your "Free Sample" product (e.g., Shutterstock 500 Image sample), and click Subscribe.
   2. AWS Credentials: Ensure your local environment is configured with aws configure (Access Key and Secret Key). [4, 5, 6, 7, 8] 

## Python Script: Export & Download AWS Data
This script uses the boto3 library to find your subscribed data, move it to your S3 bucket, and then download it to your local machine. [2, 9] 

import boto3import timeimport os
# ConfigurationREGION = "us-east-1"S3_BUCKET_NAME = "your-demo-bucket-name"  # The bucket where AWS will send the dataLOCAL_FOLDER = "./aws_samples"
# Initialize Clientsdx = boto3.client('dataexchange', region_name=REGION)s3 = boto3.client('s3', region_name=REGION)
def download_aws_marketplace_sample():
    # 1. List your subscribed datasets to find the ID
    subscriptions = dx.list_data_sets(Origin='ENTITLED')
    if not subscriptions['DataSets']:
        print("No active subscriptions found. Please subscribe via the AWS Console first.")
        return

    # Use the first available dataset for this demo
    dataset_id = subscriptions['DataSets'][0]['Id']
    dataset_name = subscriptions['DataSets'][0]['Name']
    print(f"Targeting Dataset: {dataset_name} ({dataset_id})")

    # 2. Get the latest Revision ID (the actual data snapshot)
    revisions = dx.list_data_set_revisions(DataSetId=dataset_id)
    latest_revision_id = revisions['Revisions'][0]['Id']

    # 3. Create an Export Job to move data to your S3 bucket
    # AWS Marketplace data must land in S3 before you can download it locally
    create_job_response = dx.create_job(
        Type='EXPORT_REVISIONS_TO_S3',
        Details={
            'ExportRevisionsToS3': {
                'DataSetId': dataset_id,
                'RevisionDestinations': [
                    {'Bucket': S3_BUCKET_NAME, 'RevisionId': latest_revision_id}
                ]
            }
        }
    )
    job_id = create_job_response['Id']
    dx.start_job(JobId=job_id)

    # 4. Wait for AWS to finish the export
    print("Exporting data to S3... this may take a minute.")
    while True:
        status = dx.get_job(JobId=job_id)['State']
        if status == 'COMPLETED': break
        if status == 'ERROR': raise Exception("Export Job Failed")
        time.sleep(5)

    # 5. Download from your S3 bucket to local machine
    print(f"Downloading files from S3 bucket: {S3_BUCKET_NAME}...")
    if not os.path.exists(LOCAL_FOLDER): os.makedirs(LOCAL_FOLDER)
    
    objects = s3.list_objects_v2(Bucket=S3_BUCKET_NAME)
    for obj in objects.get('Contents', []):
        file_name = obj['Key']
        s3.download_file(S3_BUCKET_NAME, file_name, os.path.join(LOCAL_FOLDER, file_name))
        print(f"Downloaded: {file_name}")
if __name__ == "__main__":
    download_aws_marketplace_sample()

## Critical Tips for Your Demo

* Permissions: Your IAM user needs the AWSDataExchangeFullAccess and AmazonS3FullAccess policies to run this script.
* Bucket Selection: The S3 bucket must be in the same region as the Data Exchange product (usually us-east-1).
* Cost Warning: While the sample data is free, AWS will charge standard S3 storage and retrieval fees once the data is moved into your account. [2, 3, 6, 10] 

Would you like me to show you how to link these high-res AWS images to the product descriptions you already have in your local database?

[1] [https://stackoverflow.com](https://stackoverflow.com/questions/64754672/how-to-download-dataset-from-aws-data-exchange)
[2] [https://oneuptime.com](https://oneuptime.com/blog/post/2026-02-12-aws-data-exchange-third-party-data/view)
[3] [https://www.youtube.com](https://www.youtube.com/watch?v=9D-w4oZ_jMY&t=377)
[4] [https://aws.amazon.com](https://aws.amazon.com/data-exchange/)
[5] [https://aws.amazon.com](https://aws.amazon.com/blogs/awsmarketplace/how-to-discover-use-open-data-aws-data-exchange/)
[6] [https://www.youtube.com](https://www.youtube.com/watch?v=JmrYZPjSDl4)
[7] [https://aws.amazon.com](https://aws.amazon.com/sdk-for-python/)
[8] [https://www.scaler.com](https://www.scaler.com/topics/aws/aws-data-exchange/)
[9] [https://github.com](https://github.com/aws-samples/aws-dataexchange-api-samples)
[10] [https://docs.aws.amazon.com](https://docs.aws.amazon.com/boto3/latest/reference/services/marketplace-reporting.html)
