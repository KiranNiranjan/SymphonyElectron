FROM ubuntu:latest

ARG DEBIAN_FRONTEND=noninteractive

MAINTAINER Kiran Niranjan<kiran.niranjan@symphony.com>

# Update
RUN apt-get update --fix-missing

# Install dependencies
RUN apt-get install -y \
    curl \
    git \
    gcc \
    g++ \
    make \
    build-essential \
    libssl-dev \
    libx11-dev \
    libxkbfile-dev \
    libxtst-dev \
    libpng-dev \
    zlib1g-dev \
    tzdata \
    rpm

# install node
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get install -y nodejs