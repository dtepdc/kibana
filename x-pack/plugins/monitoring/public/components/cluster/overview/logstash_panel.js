/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { formatNumber } from 'plugins/monitoring/lib/format_number';
import { ClusterItemContainer, BytesPercentageUsage } from './helpers';
import { Tooltip } from 'plugins/monitoring/components/tooltip';
import { LOGSTASH } from '../../../../common/constants';

import {
  EuiFlexGrid,
  EuiFlexItem,
  EuiLink,
  EuiTitle,
  EuiPanel,
  EuiDescriptionList,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
  EuiHorizontalRule,
} from '@elastic/eui';
import { FormattedMessage, injectI18n } from '@kbn/i18n/react';

function LogstashPanelUi(props) {
  if (!props.node_count) {
    return null;
  }

  const goToLogstash = () => props.changeUrl('logstash');
  const goToNodes = () => props.changeUrl('logstash/nodes');
  const goToPipelines = () => props.changeUrl('logstash/pipelines');

  return (
    <ClusterItemContainer
      {...props}
      url="logstash"
      title={props.intl.formatMessage({
        id: 'xpack.monitoring.cluster.overview.logstashPanel.logstashTitle', defaultMessage: 'Logstash' })}
    >
      <EuiFlexGrid columns={3}>
        <EuiFlexItem>
          <EuiPanel paddingSize="m">
            <EuiTitle size="s">
              <h3>
                <EuiLink
                  onClick={goToLogstash}
                  aria-label={props.intl.formatMessage({
                    id: 'xpack.monitoring.cluster.overview.logstashPanel.overviewLinkAriaLabel', defaultMessage: 'Logstash Overview' })}
                >
                  <FormattedMessage
                    id="xpack.monitoring.cluster.overview.logstashPanel.overviewLinkLabel"
                    defaultMessage="Overview"
                  />
                </EuiLink>
              </h3>
            </EuiTitle>
            <EuiHorizontalRule margin="m" />
            <EuiDescriptionList type="column" data-test-subj="logstash_overview">
              <EuiDescriptionListTitle>
                <FormattedMessage
                  id="xpack.monitoring.cluster.overview.logstashPanel.eventsReceivedLabel"
                  defaultMessage="Events Received"
                />
              </EuiDescriptionListTitle>
              <EuiDescriptionListDescription data-test-subj="lsEventsReceived">
                { formatNumber(props.events_in_total, '0.[0]a') }
              </EuiDescriptionListDescription>
              <EuiDescriptionListTitle>
                <FormattedMessage
                  id="xpack.monitoring.cluster.overview.logstashPanel.eventsEmittedLabel"
                  defaultMessage="Events Emitted"
                />
              </EuiDescriptionListTitle>
              <EuiDescriptionListDescription data-test-subj="lsEventsEmitted">
                { formatNumber(props.events_out_total, '0.[0]a') }
              </EuiDescriptionListDescription>
            </EuiDescriptionList>
          </EuiPanel>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiPanel paddingSize="m">
            <EuiTitle size="s">
              <h3>
                <EuiLink
                  onClick={goToNodes}
                  data-test-subj="lsNodes"
                  aria-label={props.intl.formatMessage({
                    id: 'xpack.monitoring.cluster.overview.logstashPanel.nodesCountLinkAriaLabel',
                    defaultMessage: 'Logstash Nodes: {nodesCount}' },
                  { nodesCount: props.node_count }
                  )}
                >
                  <FormattedMessage
                    id="xpack.monitoring.cluster.overview.logstashPanel.nodesCountLinkLabel"
                    defaultMessage="Nodes: {nodesCount}"
                    values={{ nodesCount: (<span data-test-subj="number_of_logstash_instances">{ props.node_count }</span>) }}
                  />
                </EuiLink>
              </h3>
            </EuiTitle>
            <EuiHorizontalRule margin="m" />
            <EuiDescriptionList type="column">
              <EuiDescriptionListTitle>
                <FormattedMessage
                  id="xpack.monitoring.cluster.overview.logstashPanel.uptimeLabel"
                  defaultMessage="Uptime"
                />
              </EuiDescriptionListTitle>
              <EuiDescriptionListDescription data-test-subj="lsUptime">
                { formatNumber(props.max_uptime, 'time_since') }
              </EuiDescriptionListDescription>
              <EuiDescriptionListTitle>
                <FormattedMessage
                  id="xpack.monitoring.cluster.overview.logstashPanel.jvmHeapLabel"
                  defaultMessage="{javaVirtualMachine} Heap"
                  values={{ javaVirtualMachine: 'JVM' }}
                />
              </EuiDescriptionListTitle>
              <EuiDescriptionListDescription data-test-subj="lsJvmHeap">
                <BytesPercentageUsage usedBytes={props.avg_memory_used} maxBytes={props.avg_memory} />
              </EuiDescriptionListDescription>
            </EuiDescriptionList>
          </EuiPanel>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiPanel paddingSize="m">
            <EuiTitle size="s">
              <h3>
                <EuiLink
                  onClick={goToPipelines}
                  data-test-subj="lsPipelines"
                  aria-label={props.intl.formatMessage({
                    id: 'xpack.monitoring.cluster.overview.logstashPanel.pipelineCountLinkAriaLabel',
                    defaultMessage: 'Logstash Pipelines (beta feature): {pipelineCount}' },
                  { pipelineCount: props.pipeline_count }
                  )}
                >
                  <Tooltip
                    text={props.intl.formatMessage({
                      id: 'xpack.monitoring.cluster.overview.logstashPanel.betaFeatureTooltip',
                      defaultMessage: 'Beta Feature' })}
                    placement="bottom"
                    trigger="hover"
                  >
                    <span className="kuiIcon fa-flask betaIcon" />
                  </Tooltip>
                  <FormattedMessage
                    id="xpack.monitoring.cluster.overview.logstashPanel.pipelinesCountLinkLabel"
                    defaultMessage="Pipelines: {pipelineCount}"
                    values={{ pipelineCount: (<span data-test-subj="number_of_logstash_pipelines">{ props.pipeline_count }</span>) }}
                  />
                </EuiLink>
              </h3>
            </EuiTitle>
            <EuiHorizontalRule margin="m" />
            <EuiDescriptionList type="column">
              <EuiDescriptionListTitle>
                <FormattedMessage
                  id="xpack.monitoring.cluster.overview.logstashPanel.withMemoryQueuesLabel"
                  defaultMessage="With Memory Queues"
                />
              </EuiDescriptionListTitle>
              <EuiDescriptionListDescription>{ props.queue_types[LOGSTASH.QUEUE_TYPES.MEMORY] }</EuiDescriptionListDescription>
              <EuiDescriptionListTitle>
                <FormattedMessage
                  id="xpack.monitoring.cluster.overview.logstashPanel.withPersistentQueuesLabel"
                  defaultMessage="With Persistent Queues"
                />
              </EuiDescriptionListTitle>
              <EuiDescriptionListDescription>{ props.queue_types[LOGSTASH.QUEUE_TYPES.PERSISTED] }</EuiDescriptionListDescription>
            </EuiDescriptionList>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGrid>
    </ClusterItemContainer>
  );
}

export const LogstashPanel = injectI18n(LogstashPanelUi);
