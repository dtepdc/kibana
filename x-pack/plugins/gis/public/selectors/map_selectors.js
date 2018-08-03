/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { createSelector } from 'reselect';
import _ from 'lodash';

export const getMapConstants = ({ map }) => map && map.mapConstants;

export const getSelectedLayer = ({ map }) => map && map.selectedLayer;

export const getLayerList = ({ map }) => map && map.layerList;

export const getSources = ({ map }) => map && map.sources;

export const getLayerLoading = ({ map }) => map && map.layerLoading;

export const getTemporaryLayers = ({ map }) => map &&
  map.layerList.filter(({ temporary }) => temporary);

const getLayersById = createSelector(
  getLayerList,
  layerList => layerList.reduce((accu, layer) => ({ ...accu, [layer.id]: layer }), {})
);

export function getLayerById(state, id) {
  return createSelector(
    getLayersById,
    layersByIdList => _.get(layersByIdList, id)
  )(state);
}

