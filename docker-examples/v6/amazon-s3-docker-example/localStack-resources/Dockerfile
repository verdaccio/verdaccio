FROM ubuntu:20.04
FROM python:3.8.5

ENV AWS_ACCESS_KEY_ID='[something]'
ENV AWS_SECRET_ACCESS_KEY='[something]'
ENV AWS_S3_ENDPOINT='http://localstack-s3:4566'

RUN python -m pip install --upgrade pip
RUN pip install awscli
RUN pip install awscli-local
RUN mkdir -p /scripts
COPY entry.sh /scripts
WORKDIR /scripts
RUN chmod +x entry.sh

CMD ["bash", "entry.sh"]
