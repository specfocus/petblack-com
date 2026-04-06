import boto3
import time
import os

# Configuration
REGION = "us-east-1"
S3_BUCKET_NAME = "your-demo-bucket-name"  # The bucket where AWS will send the data
LOCAL_FOLDER = "./aws_samples"

# Initialize Clients
dx = boto3.client('dataexchange', region_name=REGION)
s3 = boto3.client('s3', region_name=REGION)

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
