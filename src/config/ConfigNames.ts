/**
 * Holds and provides all configuration names as constant.
 */
class ConfigNames {

    public static readonly THUNDRA_APIKEY: string =
        'thundra.apikey';

    public static readonly THUNDRA_DEBUG_ENABLE: string =
        'thundra.agent.debug.enable';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly THUNDRA_DISABLE: string =
        'thundra.agent.disable';
    public static readonly THUNDRA_TRACE_DISABLE: string =
        'thundra.agent.trace.disable';
    public static readonly THUNDRA_METRIC_DISABLE: string =
        'thundra.agent.metric.disable';
    public static readonly THUNDRA_LOG_DISABLE: string =
        'thundra.agent.log.disable';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly THUNDRA_APPLICATION_ID: string =
        'thundra.agent.application.id';
    public static readonly THUNDRA_APPLICATION_INSTANCE_ID: string =
        'thundra.agent.application.instanceid';
    public static readonly THUNDRA_APPLICATION_REGION: string =
        'thundra.agent.application.region';
    public static readonly THUNDRA_APPLICATION_NAME: string =
        'thundra.agent.application.name';
    public static readonly THUNDRA_APPLICATION_STAGE: string =
        'thundra.agent.application.stage';
    public static readonly THUNDRA_APPLICATION_DOMAIN_NAME: string =
        'thundra.agent.application.domainname';
    public static readonly THUNDRA_APPLICATION_CLASS_NAME: string =
        'thundra.agent.application.classname';
    public static readonly THUNDRA_APPLICATION_VERSION: string =
        'thundra.agent.application.version';
    public static readonly THUNDRA_APPLICATION_TAG_PREFIX: string =
        'thundra.agent.application.tag.';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly THUNDRA_REPORT_REST_BASEURL: string =
        'thundra.agent.report.rest.baseurl';
    public static readonly THUNDRA_REPORT_REST_TRUSTALLCERTIFICATES: string =
        'thundra.agent.report.rest.trustallcertificates';
    public static readonly THUNDRA_REPORT_REST_LOCAL: string =
        'thundra.agent.report.rest.local';
    public static readonly THUNDRA_REPORT_CLOUDWATCH_ENABLE: string =
        'thundra.agent.report.cloudwatch.enable';
    public static readonly THUNDRA_REPORT_SIZE_MAX: string =
        'thundra.agent.report.size.max';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly THUNDRA_LAMBDA_HANDLER: string =
        'thundra.agent.lambda.handler';

    public static readonly THUNDRA_LAMBDA_WARMUP_WARMUPAWARE: string =
        'thundra.agent.lambda.warmup.warmupaware';

    public static readonly THUNDRA_LAMBDA_TIMEOUT_MARGIN: string =
        'thundra.agent.lambda.timeout.margin';

    public static readonly THUNDRA_LAMBDA_ERROR_STACKTRACE_MASK: string =
        'thundra.agent.lambda.error.stacktrace.mask';

    public static readonly THUNDRA_TRACE_REQUEST_SKIP: string =
        'thundra.agent.trace.request.skip';
    public static readonly THUNDRA_TRACE_RESPONSE_SKIP: string =
        'thundra.agent.trace.response.skip';
    public static readonly THUNDRA_LAMBDA_TRACE_KINESIS_REQUEST_ENABLE: string =
        'thundra.agent.lambda.trace.kinesis.request.enable';
    public static readonly THUNDRA_LAMBDA_TRACE_FIREHOSE_REQUEST_ENABLE: string =
        'thundra.agent.lambda.trace.firehose.request.enable';
    public static readonly THUNDRA_LAMBDA_TRACE_CLOUDWATCHLOG_REQUEST_ENABLE: string =
        'thundra.agent.lambda.trace.cloudwatchlog.request.enable';
    public static readonly THUNDRA_LAMBDA_AWS_STEPFUNCTIONS: string =
        'thundra.agent.lambda.aws.stepfunctions';
    public static readonly THUNDRA_LAMBDA_AWS_APPSYNC: string =
        'thundra.agent.lambda.aws.appsync';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly THUNDRA_INVOCATION_SAMPLE_ONERROR: string =
        'thundra.agent.invocation.sample.onerror';
    public static readonly THUNDRA_INVOCATION_REQUEST_TAGS: string =
        'thundra.agent.invocation.request.tags';
    public static readonly THUNDRA_INVOCATION_RESPONSE_TAGS: string =
        'thundra.agent.invocation.response.tags';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly THUNDRA_TRACE_INSTRUMENT_DISABLE: string =
        'thundra.agent.trace.instrument.disable';
    public static readonly THUNDRA_TRACE_INSTRUMENT_TRACEABLECONFIG: string =
        'thundra.agent.trace.instrument.traceableconfig';
    public static readonly THUNDRA_TRACE_INSTRUMENT_FILE_PREFIX: string =
        'thundra.agent.trace.instrument.file.prefix';
    public static readonly THUNDRA_TRACE_INSTRUMENT_ONLOAD: string =
        'thundra.agent.trace.instrument.onload';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly THUNDRA_TRACE_SPAN_COUNT_MAX: string =
        'thundra.agent.trace.span.count.max';
    public static readonly THUNDRA_TRACE_SPAN_LISTENERCONFIG: string =
        'thundra.agent.trace.span.listenerconfig';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly THUNDRA_SAMPLER_TIMEAWARE_TIMEFREQ: string =
        'thundra.agent.sampler.timeaware.timefreq';
    public static readonly THUNDRA_SAMPLER_COUNTAWARE_COUNTFREQ: string =
        'thundra.agent.sampler.countaware.countfreq';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly THUNDRA_TRACE_INTEGRATIONS_DISABLE: string =
        'thundra.agent.trace.integrations.disable';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_INSTRUMENT_ON_LOAD: string =
        'thundra.agent.trace.integrations.aws.instrument.onload';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_SNS_MESSAGE_MASK: string =
        'thundra.agent.trace.integrations.aws.sns.message.mask';
    public static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_SNS_TRACEINJECTION_DISABLE: string =
        'thundra.agent.trace.integrations.aws.sns.traceinjection.disable';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_SQS_MESSAGE_MASK: string =
        'thundra.agent.trace.integrations.aws.sqs.message.mask';
    public static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_SQS_TRACEINJECTION_DISABLE: string =
        'thundra.agent.trace.integrations.aws.sqs.traceinjection.disable';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_LAMBDA_PAYLOAD_MASK: string =
        'thundra.agent.trace.integrations.aws.lambda.payload.mask';
    public static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_LAMBDA_TRACEINJECTION_DISABLE: string =
        'thundra.agent.trace.integrations.aws.lambda.traceinjection.disable';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_DYNAMODB_STATEMENT_MASK: string =
        'thundra.agent.trace.integrations.aws.dynamodb.statement.mask';
    public static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_DYNAMODB_TRACEINJECTION_ENABLE: string =
        'thundra.agent.trace.integrations.aws.dynamodb.traceinjection.enable';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_ATHENA_STATEMENT_MASK: string =
        'thundra.agent.trace.integrations.aws.athena.statement.mask';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_HTTP_BODY_MASK: string =
        'thundra.agent.trace.integrations.http.body.mask';
    public static readonly THUNDRA_TRACE_INTEGRATIONS_HTTP_RESPONSE_BODY_MASK: string =
        'thundra.agent.trace.integrations.http.response.body.mask';
    public static readonly THUNDRA_TRACE_INTEGRATIONS_HTTP_URL_DEPTH: string =
        'thundra.agent.trace.integrations.http.url.depth';
    public static readonly THUNDRA_TRACE_INTEGRATIONS_HTTP_TRACEINJECTION_DISABLE: string =
        'thundra.agent.trace.integrations.http.traceinjection.disable';
    public static readonly THUNDRA_TRACE_INTEGRATIONS_HTTP_ERROR_ON_4XX_DISABLE: string =
        'thundra.agent.trace.integrations.http.error.on4xx.disable';
    public static readonly THUNDRA_TRACE_INTEGRATIONS_HTTP_ERROR_ON_5XX_DISABLE: string =
        'thundra.agent.trace.integrations.http.error.on5xx.disable';
    public static readonly THUNDRA_TRACE_INTEGRATIONS_HTTP_ERROR_IGNORED_STATUS_CODES: string =
        'thundra.agent.trace.integrations.http.error.ignored.status.codes';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_REDIS_COMMAND_MASK: string =
        'thundra.agent.trace.integrations.redis.command.mask';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_RDB_STATEMENT_MASK: string =
        'thundra.agent.trace.integrations.rdb.statement.mask';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_RABBITMQ_MESSAGE_MASK: string =
    'thundra.agent.trace.integrations.rabbitmq.message.mask';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_ELASTICSEARCH_BODY_MASK: string =
        'thundra.agent.trace.integrations.elasticsearch.body.mask';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_ELASTICSEARCH_PATH_DEPTH: string =
        'thundra.agent.trace.integrations.elasticsearch.path.depth';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_ELASTICSEARCH_BODY_SIZE_MAX: string =
        'thundra.agent.trace.integrations.elasticsearch.body.size.max';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_MONGODB_COMMAND_MASK: string =
        'thundra.agent.trace.integrations.mongodb.command.mask';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_EVENTBRIDGE_DETAIL_MASK: string =
        'thundra.agent.trace.integrations.aws.eventbridge.detail.mask';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_SES_MAIL_MASK: string =
        'thundra.agent.trace.integrations.aws.ses.mail.mask';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_SES_MAIL_DESTINATION_MASK: string =
        'thundra.agent.trace.integrations.aws.ses.mail.destination.mask';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_GOOGLE_PUBSUB_MESSAGE_MASK: string =
        'thundra.agent.trace.integrations.google.pubsub.message.mask';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_HAPI_DISABLE: string =
        'thundra.agent.trace.integrations.hapi.disable';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_KOA_DISABLE: string =
        'thundra.agent.trace.integrations.koa.disable';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_GOOGLE_PUBSUB_DISABLE: string =
        'thundra.agent.trace.integrations.google.pubsub.disable';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_GOOGLE_BIGQUERY_QUERY_MASK: string =
        'thundra.agent.trace.integrations.google.bigquery.query.mask';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_GOOGLE_BIGQUERY_RESPONSE_MASK: string =
        'thundra.agent.trace.integrations.google.bigquery.response.mask';

    public static readonly THUNDRA_TRACE_INTEGRATIONS_GOOGLE_BIGQUERY_RESPONSE_SIZE_MAX: string =
        'thundra.agent.trace.integrations.google.bigquery.response.size.max';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly THUNDRA_LOG_CONSOLE_DISABLE: string =
        'thundra.agent.log.console.disable';
    public static readonly THUNDRA_LOG_LOGLEVEL: string =
        'thundra.agent.log.loglevel';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly THUNDRA_LAMBDA_DEBUGGER_ENABLE: string =
        'thundra.agent.lambda.debugger.enable';
    public static readonly THUNDRA_LAMBDA_DEBUGGER_PORT: string =
        'thundra.agent.lambda.debugger.port';
    public static readonly THUNDRA_LAMBDA_DEBUGGER_LOGS_ENABLE: string =
        'thundra.agent.lambda.debugger.logs.enable';
    public static readonly THUNDRA_LAMBDA_DEBUGGER_WAIT_MAX: string =
        'thundra.agent.lambda.debugger.wait.max';
    public static readonly THUNDRA_LAMBDA_DEBUGGER_IO_WAIT: string =
        'thundra.agent.lambda.debugger.io.wait';
    public static readonly THUNDRA_LAMBDA_DEBUGGER_BROKER_PORT: string =
        'thundra.agent.lambda.debugger.broker.port';
    public static readonly THUNDRA_LAMBDA_DEBUGGER_BROKER_HOST: string =
        'thundra.agent.lambda.debugger.broker.host';
    public static readonly THUNDRA_LAMBDA_DEBUGGER_SESSION_NAME: string =
        'thundra.agent.lambda.debugger.session.name';
    public static readonly THUNDRA_LAMBDA_DEBUGGER_AUTH_TOKEN: string =
        'thundra.agent.lambda.debugger.auth.token';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly THUNDRA_AGENT_TEST_PROJECT_ID: string =
        'thundra.agent.test.project.id';
    public static readonly THUNDRA_AGENT_TEST_RUN_ID: string =
        'thundra.agent.test.run.id';
    public static readonly THUNDRA_AGENT_TEST_STATUS_REPORT_FREQ: string =
        'thundra.agent.test.status.report.freq';
    public static readonly THUNDRA_AGENT_TEST_DISABLE: string =
        'thundra.agent.test.disable';
    public static readonly THUNDRA_AGENT_TEST_LOG_ENABLE: string =
        'thundra.agent.test.log.enable';
    public static readonly THUNDRA_AGENT_TEST_LOG_COUNT_MAX: string =
        'thundra.agent.test.log.count.max';

    /////////////////////////////////////////////////////////////////////////////

    public static readonly GITHUB_REPOSITORY_ENV_VAR_NAME: string =
        'GITHUB_REPOSITORY';
    public static readonly GITHUB_HEAD_REF_ENV_VAR_NAME: string =
        'GITHUB_HEAD_REF';
    public static readonly GITHUB_REF_ENV_VAR_NAME: string =
        'GITHUB_REF';
    public static readonly GITHUB_EVENT_PATH_ENV_VAR_NAME: string =
        'GITHUB_EVENT_PATH';
    public static readonly GITHUB_SHA_ENV_VAR_NAME: string =
        'GITHUB_SHA';
    public static readonly GITHUB_RUN_ID_ENV_VAR_NAME: string =
        'GITHUB_RUN_ID';
    public static readonly INVOCATION_ID_ENV_VAR_NAME: string =
        'INVOCATION_ID';

    public static readonly TRAVIS_ENV_VAR_NAME: string =
        'TRAVIS';
    public static readonly TRAVIS_REPO_SLUG_VAR_NAME: string =
        'TRAVIS_REPO_SLUG';
    public static readonly TRAVIS_PULL_REQUEST_BRANCH_ENV_VAR_NAME: string =
        'TRAVIS_PULL_REQUEST_BRANCH';
    public static readonly TRAVIS_BRANCH_ENV_VAR_NAME: string =
        'TRAVIS_BRANCH';
    public static readonly TRAVIS_COMMIT_ENV_VAR_NAME: string =
        'TRAVIS_COMMIT';
    public static readonly TRAVIS_COMMIT_MESSAGE_ENV_VAR_NAME: string =
        'TRAVIS_COMMIT_MESSAGE';
    public static readonly TRAVIS_BUILD_WEB_URL_ENV_VAR_NAME: string =
        'TRAVIS_BUILD_WEB_URL';
    public static readonly TRAVIS_BUILD_ID_ENV_VAR_NAME: string =
        'TRAVIS_BUILD_ID';

    public static readonly JENKINS_HOME_ENV_VAR_NAME: string =
        'JENKINS_HOME';
    public static readonly JENKINS_URL_ENV_VAR_NAME: string =
        'JENKINS_URL';
    public static readonly GIT_URL_ENV_VAR_NAME: string =
        'GIT_URL';
    public static readonly GIT_URL_1_ENV_VAR_NAME: string =
        'GIT_URL_1';
    public static readonly GIT_BRANCH_ENV_VAR_NAME: string =
        'GIT_BRANCH';
    public static readonly GIT_COMMIT_ENV_VAR_NAME: string =
        'GIT_COMMIT';
    public static readonly JOB_NAME_ENV_VAR_NAME: string =
        'JOB_NAME';
    public static readonly BUILD_ID_ENV_VAR_NAME: string =
        'BUILD_ID';

    public static readonly GITLAB_CI_ENV_VAR_NAME: string =
        'GITLAB_CI';
    public static readonly CI_REPOSITORY_URL_ENV_VAR_NAME: string =
        'CI_REPOSITORY_URL';
    public static readonly CI_COMMIT_BRANCH_ENV_VAR_NAME: string =
        'CI_COMMIT_BRANCH';
    public static readonly CI_COMMIT_REF_NAME_ENV_VAR_NAME: string =
        'CI_COMMIT_REF_NAME';
    public static readonly CI_COMMIT_SHA_ENV_VAR_NAME: string =
        'CI_COMMIT_SHA';
    public static readonly CI_COMMIT_MESSAGE_ENV_VAR_NAME: string =
        'CI_COMMIT_MESSAGE';
    public static readonly CI_JOB_ID_ENV_VAR_NAME: string =
        'CI_JOB_ID';
    public static readonly CI_JOB_URL_ENV_VAR_NAME: string =
        'CI_JOB_URL';

    public static readonly CIRCLECI_ENV_VAR_NAME: string =
        'CIRCLECI';
    public static readonly CIRCLE_REPOSITORY_URL_ENV_VAR_NAME: string =
        'CIRCLE_REPOSITORY_URL';
    public static readonly CIRCLE_BRANCH_ENV_VAR_NAME: string =
        'CIRCLE_BRANCH';
    public static readonly CIRCLE_SHA1_ENV_VAR_NAME: string =
        'CIRCLE_SHA1';
    public static readonly CIRCLE_BUILD_URL_ENV_VAR_NAME: string =
        'CIRCLE_BUILD_URL';
    public static readonly CIRCLE_BUILD_NUM_ENV_VAR_NAME: string =
        'CIRCLE_BUILD_NUM';

    public static readonly BITBUCKET_GIT_HTTP_ORIGIN_ENV_VAR_NAME: string =
        'BITBUCKET_GIT_HTTP_ORIGIN';
    public static readonly BITBUCKET_GIT_SSH_ORIGIN_ENV_VAR_NAME: string =
        'BITBUCKET_GIT_SSH_ORIGIN';
    public static readonly BITBUCKET_BRANCH_ENV_VAR_NAME: string =
        'BITBUCKET_BRANCH';
    public static readonly BITBUCKET_COMMIT_ENV_VAR_NAME: string =
        'BITBUCKET_COMMIT';
    public static readonly BITBUCKET_BUILD_NUMBER_ENV_VAR_NAME: string =
        'BITBUCKET_BUILD_NUMBER';
}

export default ConfigNames;
