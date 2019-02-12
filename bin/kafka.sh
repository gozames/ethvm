#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

# kafka_usage - prints kafka subcommand usage
kafka_usage() {
  echo ""
  echo "Utility to manipulate Kafka."
  echo ""
  echo "Usage:"
  echo "  ethvm kafka [COMMAND]"
  echo ""
  echo "Commands:"
  echo "  create-topics                       Create EthVM Kafka topics."
  echo "  list-topics                         List registered Kafka topics."
  echo "  reset-topics                        Resets Kafka topics."
  echo "  help                                Print the help information and exit."
  echo ""
}

read_version() {
  local raw_version_path=$(jq -car '.projects[] | select(.id=="kafka-ethvm-utils") | .version' $PROJECTS_PATH)
  local version_path=$(eval "echo -e ${raw_version_path}")
  echo $(to_version "${version_path}")
}

# create_topics - create EthVM Kafka topics
create_topics() {
  local version=$(read_version)
  docker run --rm --network ethvm_back \
    -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
    -e KAFKA_BOOTSTRAP_SERVERS=kafka-1:9091 \
    enkryptio/ethvm-utils:${version} ensure-topics
}

# list_topics - lists registered Kafka topics
list_topics() {
  docker-compose exec kafka-1 sh -c "kafka-topics --list --zookeeper zookeeper:2181"
}

# TODO: reset_topics - reset registered Kafka topics (if any)
reset_streams() {
  docker-compose exec kafka-1 sh -c "kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka-1:9091 --application-id blocks-processor --input-topics blocks,pending-transactions"
  docker-compose exec kafka-1 sh -c "kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka-1:9091 --application-id state-processor --input-topics fungible-token-movements,block-metrics-by-day,contract-creations,contract-destructions"
}

run() {
  local command="${1:-false}"

  case "${command}" in
    ensure-topics) create_topics       ;;
    list-topics)   list_topics         ;;
    reset-streams)  reset_streams      ;;
    help|*)        kafka_usage; exit 0 ;;
  esac
}
run "$@"
