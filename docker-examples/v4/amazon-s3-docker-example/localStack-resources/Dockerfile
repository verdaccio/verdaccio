FROM python:2.7

ENV AWS_ACCESS_KEY_ID='[something]'
ENV AWS_SECRET_ACCESS_KEY='[something]'
ENV AWS_S3_ENDPOINT='http://localstack-s3:4572'

RUN pip install awscli
COPY entry.sh /entry.sh
RUN chmod +x /entry.sh
ENTRYPOINT ["/entry.sh"]