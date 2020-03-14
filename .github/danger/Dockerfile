FROM ruby:2.7-alpine
ENV LANG C.UTF-8

RUN apk --update add --no-cache git \
        && gem install danger

ENTRYPOINT ["danger"]
